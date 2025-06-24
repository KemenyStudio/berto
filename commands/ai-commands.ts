import type { CommandFunction } from "./index"
import { interpretCommand, explainCommand, suggestCommands, testAIConnection } from "../services/ai-interpreter"

export const aiCommands: { [key: string]: CommandFunction } = {
  ai: async (args, state, updateState) => {
    if (args.length === 0) {
      return [
        { type: "output", content: "AI Terminal Assistant", timestamp: new Date() },
        { type: "output", content: "", timestamp: new Date() },
        { type: "output", content: "Usage:", timestamp: new Date() },
        {
          type: "output",
          content: "  ai <natural language request>  - Convert natural language to command",
          timestamp: new Date(),
        },
        {
          type: "output",
          content: "  explain <command>               - Explain what a command does",
          timestamp: new Date(),
        },
        {
          type: "output",
          content: "  suggest                         - Get command suggestions",
          timestamp: new Date(),
        },
        { type: "output", content: "", timestamp: new Date() },
        { type: "output", content: "Examples:", timestamp: new Date() },
        { type: "output", content: '  ai "list all files in this directory"', timestamp: new Date() },
        { type: "output", content: '  ai "find all python files"', timestamp: new Date() },
        { type: "output", content: '  ai "create a new folder called projects"', timestamp: new Date() },
        { type: "output", content: "", timestamp: new Date() },
      ]
    }

    const naturalLanguage = args.join(" ")

    try {
      const interpretation = await interpretCommand(naturalLanguage)

      if (interpretation.confidence === 0) {
        return [
          { type: "error", content: interpretation.explanation, timestamp: new Date() },
          { type: "output", content: "", timestamp: new Date() },
        ]
      }

      const lines = [
        { type: "info", content: "🤖 AI Interpretation:", timestamp: new Date() },
        { type: "output", content: `Request: "${naturalLanguage}"`, timestamp: new Date() },
        { type: "output", content: `Command: ${interpretation.command}`, timestamp: new Date() },
        { type: "output", content: `Explanation: ${interpretation.explanation}`, timestamp: new Date() },
        {
          type: "output",
          content: `Confidence: ${Math.round(interpretation.confidence * 100)}%`,
          timestamp: new Date(),
        },
      ]

      if (interpretation.confidence < 0.7) {
        lines.push({
          type: "output",
          content: "⚠️  Low confidence - please review before executing",
          timestamp: new Date(),
        })
      }

      if (interpretation.isComplex) {
        lines.push({
          type: "output",
          content: "🔧 Complex command - please verify it's what you want",
          timestamp: new Date(),
        })
      }

      lines.push({ type: "output", content: "", timestamp: new Date() })
      lines.push({ type: "info", content: 'Type "yes" to execute, or copy the command above', timestamp: new Date() })
      lines.push({ type: "output", content: "", timestamp: new Date() })

      // Store the interpreted command for potential execution
      updateState({
        ...state,
        environment: {
          ...state.environment,
          _PENDING_AI_COMMAND: interpretation.command,
        },
      })

      return lines
    } catch (error) {
      return [
        { type: "error", content: "Failed to interpret command. Please try again.", timestamp: new Date() },
        { type: "output", content: "", timestamp: new Date() },
      ]
    }
  },

  explain: async (args, state) => {
    if (args.length === 0) {
      return [
        { type: "error", content: "Usage: explain <command>", timestamp: new Date() },
        { type: "output", content: 'Example: explain "ls -la"', timestamp: new Date() },
        { type: "output", content: "", timestamp: new Date() },
      ]
    }

    const command = args.join(" ")

    try {
      const explanation = await explainCommand(command)

      return [
        { type: "info", content: "🤖 Command Explanation:", timestamp: new Date() },
        { type: "output", content: `Command: ${command}`, timestamp: new Date() },
        { type: "output", content: "", timestamp: new Date() },
        { type: "output", content: explanation, timestamp: new Date() },
        { type: "output", content: "", timestamp: new Date() },
      ]
    } catch (error) {
      return [
        { type: "error", content: "Failed to explain command. Please try again.", timestamp: new Date() },
        { type: "output", content: "", timestamp: new Date() },
      ]
    }
  },

  suggest: async (args, state) => {
    const context = args.length > 0 ? args.join(" ") : `Current directory: /${state.currentPath.join("/")}`

    try {
      const suggestions = await suggestCommands(context)

      const lines = [
        { type: "info", content: "🤖 Command Suggestions:", timestamp: new Date() },
        { type: "output", content: `Context: ${context}`, timestamp: new Date() },
        { type: "output", content: "", timestamp: new Date() },
      ]

      suggestions.forEach((suggestion, index) => {
        lines.push({ type: "output", content: `${index + 1}. ${suggestion}`, timestamp: new Date() })
      })

      lines.push({ type: "output", content: "", timestamp: new Date() })
      lines.push({
        type: "info",
        content: 'Use "explain <command>" to learn more about any command',
        timestamp: new Date(),
      })
      lines.push({ type: "output", content: "", timestamp: new Date() })

      return lines
    } catch (error) {
      return [
        { type: "error", content: "Failed to generate suggestions. Please try again.", timestamp: new Date() },
        { type: "output", content: "", timestamp: new Date() },
      ]
    }
  },

  yes: (args, state, updateState) => {
    const pendingCommand = state.environment._PENDING_AI_COMMAND

    if (!pendingCommand) {
      return [
        { type: "error", content: "No pending AI command to execute.", timestamp: new Date() },
        { type: "output", content: 'Use "ai <request>" first to interpret a command.', timestamp: new Date() },
        { type: "output", content: "", timestamp: new Date() },
      ]
    }

    // Clean up the pending command
    const newEnv = { ...state.environment }
    delete newEnv._PENDING_AI_COMMAND
    updateState({ ...state, environment: newEnv })

    // Return the command to be executed
    return [
      { type: "info", content: `🤖 Executing: ${pendingCommand}`, timestamp: new Date() },
      { type: "output", content: "", timestamp: new Date() },
      { type: "command", content: pendingCommand, timestamp: new Date() },
    ]
  },

  no: (args, state, updateState) => {
    const pendingCommand = state.environment._PENDING_AI_COMMAND

    if (!pendingCommand) {
      return [
        { type: "info", content: "No pending AI command to cancel.", timestamp: new Date() },
        { type: "output", content: "", timestamp: new Date() },
      ]
    }

    // Clean up the pending command
    const newEnv = { ...state.environment }
    delete newEnv._PENDING_AI_COMMAND
    updateState({ ...state, environment: newEnv })

    return [
      { type: "info", content: "🤖 AI command cancelled.", timestamp: new Date() },
      { type: "output", content: "", timestamp: new Date() },
    ]
  },

  test: async (args, state, updateState) => {
    try {
      const result = await testAIConnection()

      if (result.success) {
        return [
          { type: "info", content: "✅ OpenAI API connection is working!", timestamp: new Date() },
          { type: "output", content: result.message, timestamp: new Date() },
          { type: "output", content: "AI commands are ready to use.", timestamp: new Date() },
          { type: "output", content: "", timestamp: new Date() },
        ]
      } else {
        return [
          { type: "error", content: "❌ OpenAI API connection failed", timestamp: new Date() },
          { type: "output", content: result.message, timestamp: new Date() },
          { type: "output", content: "", timestamp: new Date() },
          { type: "info", content: "To fix this:", timestamp: new Date() },
          { type: "output", content: "1. Make sure OPENAI_API_KEY is set in your environment", timestamp: new Date() },
          { type: "output", content: "2. Restart your development server", timestamp: new Date() },
          { type: "output", content: "3. Check that your API key is valid", timestamp: new Date() },
          { type: "output", content: "", timestamp: new Date() },
        ]
      }
    } catch (error) {
      return [
        { type: "error", content: "❌ Failed to test OpenAI connection", timestamp: new Date() },
        {
          type: "output",
          content: "Error: " + (error instanceof Error ? error.message : "Unknown error"),
          timestamp: new Date(),
        },
        { type: "output", content: "", timestamp: new Date() },
      ]
    }
  },
}
