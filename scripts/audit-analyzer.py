# explores all the functions of the contracts and returns what state variables are read or written
# Tether CA example: 0xdAC17F958D2ee523a2206206994597C13D831ec7

import os
import json
import requests
from typing import Any, Dict, List
import argparse

from web3 import Web3
from slither import Slither


# ============================================================
# Config helpers (optional: you can hardcode or pass directly)
# ============================================================

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--ca", required=True, help="Contract Address")

    args = parser.parse_args()
    return args.ca

def get_etherscan_api_key(default: str | None = None) -> str:
    """
    Get the Etherscan API key from env or fallback default.
    """
    api_key = os.getenv("ETHERSCAN_API_KEY", default or "")
    if not api_key:
        raise RuntimeError("Missing ETHERSCAN_API_KEY")
    return api_key


def get_tenderly_config(
    account_slug: str | None = None,
    project_slug: str | None = None,
    access_key: str | None = None,
) -> Dict[str, str]:
    """
    Return Tenderly configuration. You can call this from n8n
    passing the values or rely on env vars.
    """
    account = account_slug or os.getenv("TENDERLY_ACCOUNT_SLUG", "")
    project = project_slug or os.getenv("TENDERLY_PROJECT_SLUG", "")
    key = access_key or os.getenv("TENDERLY_ACCESS_KEY", "")

    if not (account and project and key):
        raise RuntimeError("Missing Tenderly config (account, project or access key).")

    tenderly_url = (
        f"https://api.tenderly.co/api/v1/account/{account}/project/{project}/simulate-bundle"
    )
    return {
        "account_slug": account,
        "project_slug": project,
        "access_key": key,
        "bundle_url": tenderly_url,
    }


# ============================================================
# 1) Slither analysis – instead of printing, return structured data
# ============================================================

def analyze_contract_with_slither(
    address: str,
    etherscan_api_key: str,
) -> List[Dict[str, Any]]:
    """
    Use Slither to analyze the contract at `address` and
    return a structured description of:
      - contract name
      - functions
      - state variables read/written
      - nodes (as string representations)
    """
    slither = Slither(address, etherscan_api_key=etherscan_api_key)

    contracts_summary: List[Dict[str, Any]] = []

    for contract in slither.contracts:
        contract_info: Dict[str, Any] = {
            "contract_name": contract.name,
            "functions": []
        }

        for function in contract.functions:
            func_info = {
                "function_name": function.name,
                "state_variables_read": [v.name for v in function.state_variables_read],
                "state_variables_written": [v.name for v in function.state_variables_written],
                "nodes": [str(node) for node in function.nodes],
            }
            contract_info["functions"].append(func_info)

        contracts_summary.append(contract_info)

    return contracts_summary


# ============================================================
# 2) ABI fetching – return ABI list instead of printing
# ============================================================

def fetch_contract_abi(
    address: str,
    etherscan_api_key: str,
    chain_id: int = 1,
) -> List[Dict[str, Any]]:
    """
    Fetch the contract ABI from Etherscan (v1 or v2 API)
    and return it as a Python list of JSON ABI entries.
    """
    ether_url = (
        f"https://api.etherscan.io/v2/api"
        f"?apikey={etherscan_api_key}"
        f"&chainid={chain_id}"
        f"&module=contract"
        f"&action=getabi"
        f"&address={address}"
    )

    abi_response = requests.get(ether_url, timeout=10).json()
    res = abi_response.get("result")

    # Handle v1/v2/Etherscan variants
    if isinstance(res, list):
        abi_list = res  # v2 already a Python list
    elif isinstance(res, str):
        abi_list = json.loads(res)  # v1: JSON string
    elif isinstance(res, dict):
        # Some APIs nest ABI under "abi" / "Abi" / "ContractAbi"
        for k in ("abi", "Abi", "ContractAbi"):
            if k in res:
                v = res[k]
                abi_list = json.loads(v) if isinstance(v, str) else v
                break
        else:
            raise RuntimeError(f"Unrecognized ABI dict schema: {res}")
    else:
        raise RuntimeError(f"Bad ABI schema from Etherscan: {type(res)} {res}")

    if abi_response.get("status") != "1":
        # You can choose to raise or just return the ABI with a warning
        # raise RuntimeError(f"Etherscan ABI fetch failed: {abi_response}")
        # For now, we just log via exception for caller to handle
        raise RuntimeError(f"Etherscan ABI fetch failed: {abi_response}")

    return abi_list


# ============================================================
# 3) Web3 contract + calldata building – return data
# ============================================================

def build_web3_contract(
    address: str,
    abi_list: List[Dict[str, Any]],
) -> Any:
    """
    Build a Web3 contract object using an in-memory Web3 instance
    (no provider needed for pure ABI work like encode_abi).
    """
    w3 = Web3()
    checksum_address = Web3.to_checksum_address(address)
    contract = w3.eth.contract(address=checksum_address, abi=abi_list)
    return contract


def build_erc20_calldata(
    contract: Any,
    owner: str,
    spender: str,
    recipient: str,
    amount: int,
) -> Dict[str, Any]:
    """
    Given a Web3 contract and some addresses, build calldata for:
      - approve(spender, amount)
      - transferFrom(owner, recipient, amount)

    Returns both the encoded calldata and a small metadata wrapper.
    """
    owner_cs = Web3.to_checksum_address(owner)
    spender_cs = Web3.to_checksum_address(spender)
    recipient_cs = Web3.to_checksum_address(recipient)

    approve_data = contract.encode_abi("approve", [spender_cs, amount])
    transfer_from_data = contract.encode_abi("transferFrom", [owner_cs, recipient_cs, amount])

    return {
        "contract_address": contract.address,
        "owner": owner_cs,
        "spender": spender_cs,
        "recipient": recipient_cs,
        "amount": amount,
        "calldata": {
            "approve": approve_data,
            "transferFrom": transfer_from_data,
        },
    }


# ============================================================
# 4) Example orchestrator for n8n
# ============================================================

def run_full_analysis(
    address: str,
    etherscan_api_key: str,
    owner: str,
    spender: str,
    recipient: str,
    amount: int,
) -> Dict[str, Any]:
    """
    High-level helper that:
      1. Runs Slither analysis
      2. Fetches ABI
      3. Builds contract object
      4. Builds approve & transferFrom calldata

    Returns everything as a single dict, suitable for n8n JSON.
    """
    slither_data = analyze_contract_with_slither(address, etherscan_api_key)
    abi_list = fetch_contract_abi(address, etherscan_api_key)
    contract = build_web3_contract(address, abi_list)
    calldata_info = build_erc20_calldata(contract, owner, spender, recipient, amount)

    return {
        "address": Web3.to_checksum_address(address),
        "slither_analysis": slither_data,
        "abi": abi_list,
        "erc20_calldata": calldata_info,
    }


# ============================================================
# 5) Example usage (can be removed in n8n)
# ============================================================

if __name__ == "__main__":
    # Example hard-coded values – replace with n8n inputs
    ETHERSCAN_API_KEY = get_etherscan_api_key("2XSNMU792GA79J2RWF36FF1P87FZUTDWV4")
    ADDRESS = main()  # Tether and ca 0xdAC17F958D2ee523a2206206994597C13D831ec7
    owner = "0x1111111111111111111111111111111111111111"
    spender = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    recip = "0xcccccccccccccccccccccccccccccccccccccccc"
    amount = 10 * 10**6  # 10 USDT (6 decimals)

    result = run_full_analysis(
        address=ADDRESS,
        etherscan_api_key=ETHERSCAN_API_KEY,
        owner=owner,
        spender=spender,
        recipient=recip,
        amount=amount,
    )

    # For manual testing you can print; in n8n you just return `result` from the Function node
    print(json.dumps(result, indent=2))
