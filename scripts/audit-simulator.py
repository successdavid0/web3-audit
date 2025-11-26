#explores all the functions of the contrats and prints what state variables are read or written
#Tether CA [0xdAC17F958D2ee523a2206206994597C13D831ec7]
import os 
import requests 
import json
from web3 import Web3
from slither import Slither

#replace with the real tenderly creds GO MAKE THEM 
accountSlug = "prs" # the acc org or slug
projectSlug = "project" # the specific project
ACCESS_KEY = "1TnOjeI2WgMiBG2qjvZQYmlpv6PAQ6nd" #put in the accesss key
ETHERSCAN_API_KEY="2XSNMU792GA79J2RWF36FF1P87FZUTDWV4"


ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7"

w3=Web3()


#getting the acc url 
tenderlyUrl = f"https://api.tenderly.co/api/v1/account/{accountSlug}/project/{projectSlug}/simulate-bundle"



#this is the slither portion of the audit/automation
slither = Slither(ADDRESS, etherscan_api_key=ETHERSCAN_API_KEY)

for contract in slither.contracts:
    print( 'Contract '+ contract.name)
    
    for function in contract.functions:
        print('Function: {}'.format(function.name)) #This is what's acc printing the contracts 

        print('\tRead: {}'.format([v.name for v in function.state_variables_read]))
        print('\tWritten {}'.format([v.name for v in function.state_variables_written]))
        for node in function.nodes:
            print(node)
        


ether_url = f"https://api.etherscan.io/v2/api?apikey={ETHERSCAN_API_KEY}&chainid=1&module=contract&action=getabi&address={ADDRESS}"
#getting the abi
abi_response = requests.get(ether_url, timeout=10).json()

res = abi_response.get("result")
#v1, v2 handling
if isinstance(res, list):
    abi_list = res      # v2 is alr a python list
elif isinstance(res, str):
    abi_list = json.loads(res)       #v1 returns a json string
elif isinstance(res, dict):
    for k in ("abi", "Abi", "ContractAbi"):
        if k in res:
            v = res[k]
            abi_list = json.loads(v) if isinstance(v,str) else v
            break
    else:
        raise RuntimeError(f"Unrecognized ABI dict: {res}")
else:
    raise RuntimeError(f"Bad ABI Schema: {type(res)} {res}")



if abi_response.get("status") !="1":
    print(f"Etherscan ABI fetch failed: {abi_response}")

abi = json.loads(abi_response["result"])


contract = w3.eth.contract(address=Web3.to_checksum_address(ADDRESS), abi=abi_list) # get contract
owner = Web3.to_checksum_address("0x1111111111111111111111111111111111111111")

spender = Web3.to_checksum_address("0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
recip   = Web3.to_checksum_address("0xcccccccccccccccccccccccccccccccccccccccc")
amount = 10 * 10**6 #10 USDT
approve_data = contract.encode_abi("approve", [spender, amount])
transfer_from_data = contract.encode_abi("transferFrom", [owner, recip, amount])
print(approve_data)



print(abi) #prints abi
#request payload

payload = {
  
    "simulations": [
        {
            "network_id": "1",
            "save": True,
            "save_if_fails": False,
            "simulation_type": "full",
            "from": spender,
            "to": ADDRESS,
            "input": approve_data

            # "network_id": "1",
            # "block_number": "latest",
            # "simulation_type": "full",
            # "save": False,
            # "save_if_fails": False,
            # "from": owner,          # HOLDER (EOA)
            # "to":   Web3.to_checksum_address(ADDRESS),
            # "input": approve_data,
            # "gas": 8000000,
            # "gas_price": "0",
            # "value": "0"
            # make sure to put acc input approve(spender, amount)
        },
        {
            "network_id": "1",
            "save": True,
            "save_if_fails": False,
            "simulation_type": "full",
            "from": spender,
            "to": ADDRESS,
            "input": transfer_from_data

        #    "network_id": "1",
        #     "block_number": "latest",
        #     "simulation_type": "full",
        #     "save": False,
        #     "save_if_fails": False,
        #     "from": spender,        # SPENDER (EOA)
        #     "to":   Web3.to_checksum_address(ADDRESS),
        #     "input": transfer_from_data,
        #     "gas": 8000000,
        #     "gas_price": "0",
        #     "value": "0" # make sure to put acc input approve(spender, amount)
        }
    ],
    "simulation_type": "full"
}

#get the headers
headers = {
    "Content-Type": "application/json",
    "X-Access-Key": ACCESS_KEY
}

# send the post request
print(r"Sent request..\n")
response = requests.post(tenderlyUrl, headers=headers, data=json.dumps(payload))

    # need to get sim id for this. 

#parse and print the results

if response.status_code == 200:
    data = response.json()
    print("good")
    print(json.dumps(data, indent=2))
else:
    print("Error: ", response.status_code, response.text)
