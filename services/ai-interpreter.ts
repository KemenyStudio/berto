import { getApiHeaders, getApiUrl } from "@/lib/utils"

export interface CommandInterpretation {
  commands: string[]
  explanation: string
  confidence: number
  isComplex: boolean
}

export interface ContextInfo {
  currentDirectory?: string
  directoryContents?: string[]
  recentCommands?: string[]
}

export async function interpretCommand(naturalLanguage: string, context?: ContextInfo): Promise<CommandInterpretation> {
  try {
    const response = await fetch(getApiUrl("/api/ai"), {
      method: "POST",
      headers: getApiHeaders(),
      body: JSON.stringify({
        action: "interpret",
        input: naturalLanguage,
        context: context || null,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to interpret command")
    }

    const data = await response.json()
    return {
      commands: data.commands || [naturalLanguage],
      explanation: data.explanation || "Direct command execution",
      confidence: data.confidence || 0.5,
      isComplex: data.isComplex || false,
    }
  } catch (error) {
    console.error("AI interpretation error:", error)
    return {
      commands: [naturalLanguage],
      explanation: "AI unavailable - using direct command",
      confidence: 0,
      isComplex: false,
    }
  }
}

export async function explainCommand(command: string): Promise<string> {
  try {
    const response = await fetch(getApiUrl("/api/ai"), {
      method: "POST",
      headers: getApiHeaders(),
      body: JSON.stringify({
        action: "explain",
        input: command,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to explain command")
    }

    const data = await response.json()
    return data.explanation || "Sorry, I could not explain that command."
  } catch (error) {
    console.error("AI explanation error:", error)
    return "AI explanation unavailable"
  }
}

export async function suggestCommands(context: string): Promise<string[]> {
  try {
    const response = await fetch(getApiUrl("/api/ai"), {
      method: "POST",
      headers: getApiHeaders(),
      body: JSON.stringify({
        action: "suggest",
        input: context,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to get suggestions")
    }

    const data = await response.json()
    return data.suggestions || []
  } catch (error) {
    console.error("AI suggestion error:", error)
    return []
  }
}

export async function testAIConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(getApiUrl("/api/ai"), {
      method: "POST",
      headers: getApiHeaders(),
      body: JSON.stringify({
        action: "test",
        input: "test",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        message: errorData.error || "Failed to test connection",
      }
    }

    const data = await response.json()
    return {
      success: true,
      message: data.message || "Connection successful",
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
