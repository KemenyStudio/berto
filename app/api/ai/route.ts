import { generateText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export const dynamic = 'force-dynamic'

// Define the response schema for structured output
const CommandInterpretationSchema = z.object({
  commands: z.array(z.string()).describe("Array of terminal commands to execute"),
  explanation: z.string().describe("Clear explanation of what the commands will do"),
  confidence: z.number().min(0).max(1).describe("Confidence level in the interpretation (0-1)"),
  isComplex: z.boolean().describe("Whether this requires multiple commands or is complex"),
})

const SYSTEM_PROMPT = `
You are Berto, a friendly AI terminal assistant that helps humans use the terminal through natural language.

Your personality:
- Friendly, helpful, and encouraging
- Patient with beginners
- Enthusiastic about teaching terminal skills
- Use emojis occasionally but not excessively
- Always educational and supportive

Core responsibilities:
1. Convert natural language requests into proper terminal commands
2. Handle greetings and casual conversation warmly
3. Provide clear explanations of what commands do
4. Encourage learning and exploration
5. **Use context to make accurate, specific commands with intelligent file matching**

## Context Usage:
You will receive context about the user's current environment:
- **Current Directory**: Where they are in the file system
- **Directory Contents**: What files and folders exist in current directory
- **Recent Commands**: What they've done recently

**CRITICAL FILE MATCHING RULES:**
1. **Always use EXACT file and folder names from directory contents**
2. **Smart fuzzy matching**: When user mentions a file/folder that doesn't exist exactly, find the closest match:
   - "smily" → "smiley.txt" (missing letter)
   - "readmee" → "README.md" (typo)
   - "config" → "tsconfig.json" (partial match)
   - "package" → "package.json" (extension implied)
3. **Case insensitive matching**: "README" matches "readme.md"
4. **Partial name matching**: "tsconf" matches "tsconfig.json"
5. **Extension-aware**: If user says "show config file" and you see both "package.json" and "tsconfig.json", prefer the most relevant one

**Examples of Smart Matching:**
- User: "show me the readme" + Directory has "README.md" → Use "README.md"
- User: "delete the smily file" + Directory has "smiley.txt" → Use "smiley.txt"  
- User: "open the config" + Directory has "tsconfig.json" → Use "tsconfig.json"
- User: "cat packag" + Directory has "package.json" → Use "package.json"

## Handling Different Input Types:

### Greetings & Casual Conversation:
For inputs like "hi", "hello", "thanks", "how are you", etc.:
- Respond warmly and redirect to terminal assistance
- Don't generate actual commands, use empty array []
- Set confidence to 1.0 for perfect conversational understanding
- Examples:
  * "Hi there!" → [], "Hey! 👋 I'm Berto, ready to help you with terminal commands! Try asking me to 'show files' or 'create a folder'."
  * "Thanks" → [], "You're welcome! 😊 Happy to help. What would you like to do next?"
  * "How are you?" → [], "I'm doing great! Ready to help you navigate the terminal. What can I do for you?"

### Terminal Commands:
For actual requests like "show files", "create folder", etc.:
- Generate appropriate terminal commands using EXACT file/folder names from context
- Apply intelligent fuzzy matching for file/folder references
- Provide educational explanations
- Set appropriate confidence based on clarity
- **Always prefer actual names over generic ones**
- **When file name is close but not exact, use the closest match from directory contents**

### Important Rules:
- For greetings/casual conversation: Use empty commands array [] and friendly explanations
- For terminal requests: Provide actual command arrays with REAL file/folder names
- **ALWAYS scan directory contents for fuzzy matches before using generic names**
- Always be encouraging and helpful
- Confidence should be 1.0 for clear conversational inputs
- Confidence should be 0.8-0.95 for clear terminal commands with good context
- Confidence should be lower (0.3-0.7) for ambiguous requests
- **When referencing files/folders, use the exact names from directory contents with fuzzy matching**
- If multiple matches exist, prefer the most likely one based on context

Remember: You're helping humans feel comfortable with the terminal, so always be warm and supportive!
`

export async function POST(req: NextRequest) {
  try {
    const { action, input, context } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file." 
      }, { status: 500 })
    }

    switch (action) {
      case "interpret": {
        try {
          // Build context string for the AI
          let contextString = ""
          if (context) {
            if (context.currentDirectory) {
              contextString += `Current Directory: ${context.currentDirectory}\n`
            }
            if (context.directoryContents && context.directoryContents.length > 0) {
              contextString += `Directory Contents: ${context.directoryContents.join(", ")}\n`
              contextString += `Available Files/Folders for Fuzzy Matching: ${context.directoryContents.join(", ")}\n`
            }
            if (context.recentCommands && context.recentCommands.length > 0) {
              contextString += `Recent Commands: ${context.recentCommands.slice(-3).join(" → ")}\n`
            }
            contextString += `\nIMPORTANT: When user mentions files/folders, match them to the closest name from Directory Contents using fuzzy matching.\n`
          }

          const promptWithContext = contextString 
            ? `${contextString}\nUser Request: "${input}"`
            : `Interpret this input and respond appropriately: "${input}"`

          // Use GPT-4.1 with structured output for more reliable JSON responses
          const result = await generateObject({
            model: openai("gpt-4.1-2025-04-14"), // Latest GPT-4.1 model
            schema: CommandInterpretationSchema,
            system: SYSTEM_PROMPT,
            prompt: promptWithContext,
            temperature: 0.2, // Lower temperature for more consistent responses
            maxTokens: 1000,
          })

          console.log("Berto AI GPT-4.1 Structured Response:", result.object)

          return NextResponse.json(result.object)
        } catch (error) {
          console.error("Berto interpret error:", error)
          return NextResponse.json({
            commands: [],
            explanation: "Hey there! I'm Berto, your friendly terminal assistant. I'm temporarily having some issues, but you can still try direct terminal commands or ask me for help! 😊",
            confidence: 0.8,
            isComplex: false,
          })
        }
      }

      case "explain": {
        try {
          const { text } = await generateText({
            model: openai("gpt-4.1-2025-04-14"),
            system: `You are Berto, a friendly terminal command explainer. Explain commands in simple, clear language that beginners can understand. 
            
Focus on:
- What the command does in plain English
- When you might use it
- Any important flags or options
- Safety considerations if relevant
            
Be concise but thorough, and always educational.`,
            prompt: `Explain this terminal command: "${input}"`,
            temperature: 0.2,
            maxTokens: 500,
          })

          return NextResponse.json({ explanation: text })
        } catch (error) {
          console.error("Berto explain error:", error)
          return NextResponse.json({ 
            explanation: "I couldn't explain that command right now. Try searching online or using 'man <command>' in your terminal." 
          })
        }
      }

      case "suggest": {
        try {
          const { text } = await generateText({
            model: openai("gpt-4.1-2025-04-14"),
            system: `You are Berto, a terminal assistant. Based on the context provided, suggest 3-5 relevant and useful terminal commands that would be helpful for someone learning to use the terminal. 
            
Focus on practical, commonly-used commands. Return only the commands, one per line, without explanations.`,
            prompt: `Based on this context, suggest useful terminal commands: "${input}"`,
            temperature: 0.3,
            maxTokens: 200,
          })

          const suggestions = text
            .split("\n")
            .filter((line) => line.trim().length > 0)
            .map(line => line.replace(/^\d+\.\s*/, '').trim()) // Remove numbering if present
            .slice(0, 5)

          return NextResponse.json({ suggestions })
        } catch (error) {
          console.error("Berto suggest error:", error)
          return NextResponse.json({ 
            suggestions: ["ls -la", "pwd", "mkdir new-folder", "touch new-file.txt", "cat filename"] 
          })
        }
      }

      case "test": {
        try {
          const { text } = await generateText({
            model: openai("gpt-4.1-2025-04-14"),
            system: "You are Berto, an AI terminal assistant powered by GPT-4.1. Respond with exactly: 'Berto is online with GPT-4.1 and ready to help! 🤖✨'",
            prompt: "Test the connection",
            maxTokens: 50,
          })

          return NextResponse.json({ status: "success", message: text })
        } catch (error) {
          console.error("Berto test error:", error)
          return NextResponse.json({ 
            status: "error", 
            message: "Berto is offline. Check your OpenAI API key configuration." 
          })
        }
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ 
      error: "Something went wrong",
      commands: [],
      explanation: "Oops! Something went wrong on my end. Try again or use direct terminal commands.",
      confidence: 0.1,
      isComplex: false,
    }, { status: 500 })
  }
}
