import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contractAddress, owner, spender, recipient, amount } = body

    if (!contractAddress) {
      return NextResponse.json({ error: "Contract address is required" }, { status: 400 })
    }

    console.log("[v0] Starting audit analysis for contract:", contractAddress)

    // Run the audit analyzer script
    const scriptPath = path.join(process.cwd(), "scripts", "audit-analyzer.py")
    const command = `python3 ${scriptPath} --ca ${contractAddress}`

    const { stdout, stderr } = await execAsync(command, {
      timeout: 120000, // 2 minutes timeout
    })

    if (stderr) {
      console.error("[v0] Audit script stderr:", stderr)
    }

    console.log("[v0] Audit analysis completed")

    // Parse the JSON output from the script
    const result = JSON.parse(stdout)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error("[v0] Audit analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze contract",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
