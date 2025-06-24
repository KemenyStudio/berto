import { interpretCommand, type ContextInfo } from "../services/ai-interpreter"

// Known terminal commands that should not be interpreted by AI
const KNOWN_COMMANDS = [
  "ls",
  "ll",
  "la",
  "dir",
  "cd",
  "pwd",
  "pushd",
  "popd",
  "cat",
  "less",
  "more",
  "head",
  "tail",
  "touch",
  "mkdir",
  "rmdir",
  "rm",
  "cp",
  "mv",
  "echo",
  "printf",
  "clear",
  "reset",
  "whoami",
  "id",
  "groups",
  "ps",
  "top",
  "htop",
  "jobs",
  "env",
  "printenv",
  "export",
  "set",
  "unset",
  "date",
  "cal",
  "uptime",
  "uname",
  "hostname",
  "arch",
  "history",
  "fc",
  "help",
  "man",
  "info",
  "exit",
  "logout",
  "quit",
  "explain",
  "suggest",
  "test",
  "yes",
  "no",
  "debug",
  "vibe",
  "find",
  "locate",
  "which",
  "whereis",
  "grep",
  "egrep",
  "fgrep",
  "sort",
  "uniq",
  "wc",
  "cut",
  "awk",
  "sed",
  "tar",
  "gzip",
  "gunzip",
  "zip",
  "unzip",
  "chmod",
  "chown",
  "chgrp",
  "df",
  "du",
  "free",
  "ping",
  "wget",
  "curl",
  "ssh",
  "scp",
  "rsync",
  "git",
  "npm",
  "node",
  "python",
  "pip",
  "make",
  "gcc",
  "g++",
  "javac",
  "java",
  "docker",
  "kubectl",
  "vim",
  "nano",
  "emacs",
  "code",
]

// Function to check if input should be interpreted by AI
export function shouldInterpretWithAI(input: string): boolean {
  const trimmedInput = input.trim().toLowerCase()
  
  // Empty input - no interpretation needed
  if (!trimmedInput) return false
  
  // Check for greetings and casual conversation patterns
  const conversationalPatterns = [
    /^(hi|hello|hey|yo|sup|what's up|whats up|good morning|good afternoon|good evening|howdy|greetings)/,
    /^(bye|goodbye|see you|later|farewell|peace|peace out|cya|see ya)/,
    /^(thanks|thank you|thx|ty|appreciate|great|awesome|cool|nice|sweet)/,
    /^(how are you|how's it going|hows it going|what's new|whats new|how you doing)/,
    /^(sorry|my bad|oops|whoops|damn|dammit)/,
    /^(yes|yep|yeah|yup|no|nope|nah|maybe|perhaps|sure|okay|ok|alright)/,
    /^(i'm|im|i am).*(good|fine|okay|ok|great|awesome|tired|busy|stressed)/,
    /^(test|testing|hello world|just testing)/,
  ]
  
  // Check for conversational patterns first
  for (const pattern of conversationalPatterns) {
    if (pattern.test(trimmedInput)) {
      return true
    }
  }
  
  // Check for natural language command patterns
  const naturalLanguagePatterns = [
    /^(show|list|display|find|search|get|tell|what|where|how|can you|please|i want|i need)/,
    /^(create|make|build|generate|add|new)/,
    /^(delete|remove|rm|del|erase|destroy)/,
    /^(help|explain|what does|what is|how to)/,
    /\b(all|every|everything|nothing|anything|something)\b/,
    /\b(files?|folders?|directories|dir|directory|file)\b/,
    /\b(in|from|inside|within|containing|with|that have)\b/,
    /\?$/,  // Questions ending with ?
  ]
  
  // Check if it matches natural language patterns
  for (const pattern of naturalLanguagePatterns) {
    if (pattern.test(trimmedInput)) {
      return true
    }
  }
  
  // Check if it's a known command
  const firstWord = trimmedInput.split(/\s+/)[0]
  const isKnownCommand = KNOWN_COMMANDS.includes(firstWord)
  
  // If it's a known command, don't interpret unless it has natural language elements
  if (isKnownCommand) {
    // Check if it has natural language mixed in
    const hasNaturalLanguage = /\b(all|every|everything|files?|folders?|that|which|where|containing|with|in|from)\b/.test(trimmedInput)
    return hasNaturalLanguage
  }
  
  // If it's not a known command and looks like natural language, interpret it
  const hasSpaces = trimmedInput.includes(' ')
  const hasArticles = /\b(the|a|an|this|that|these|those|my|your|our|their)\b/.test(trimmedInput)
  const hasPrepositions = /\b(in|on|at|by|for|with|from|to|of|about|under|over)\b/.test(trimmedInput)
  
  return hasSpaces && (hasArticles || hasPrepositions)
}

// AI interpretation function with context support
export async function interpretNaturalLanguage(input: string, context?: ContextInfo): Promise<{
  commands: string[]
  aiThinking: string
  isComplex: boolean
}> {
  try {
    const result = await interpretCommand(input, context)
    
    // Filter out empty commands
    const commands = result.commands.filter(cmd => cmd && cmd.trim() !== '')
    
    // For conversational responses, return the explanation directly
    // For command responses, format with confidence
    const isConversational = commands.length === 0
    const aiThinking = isConversational 
      ? `🤖 ${result.explanation}` 
      : `🤖 ${result.explanation || 'Interpreting your request...'} (${Math.round((result.confidence || 0) * 100)}% confidence)`
    
    return {
      commands,
      aiThinking,
      isComplex: result.isComplex || commands.length > 1
    }
  } catch (error) {
    console.error('AI interpretation failed:', error)
    return {
      commands: [input],
      aiThinking: "🤖 AI interpretation failed - executing as direct command",
      isComplex: false
    }
  }
}
