"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles } from "lucide-react"
import { shouldInterpretWithAI, interpretNaturalLanguage } from "./commands"
import type { TerminalLine } from "./types/filesystem"
import { getApiHeaders, getApiUrl } from "@/lib/utils"


// Initial lines will be determined based on environment
const getInitialLines = (): TerminalLine[] => {
  return [
    { type: "info" as const, content: "🤖 Hi, I'm Berto, your AI terminal!", timestamp: new Date() },
    { type: "output" as const, content: "", timestamp: new Date() },
    { type: "output" as const, content: "Terminal for humans. No commands needed, just vibes! 😎", timestamp: new Date() },
    { type: "output" as const, content: "", timestamp: new Date() },
    { type: "info" as const, content: "🚀 Try these commands:", timestamp: new Date() },
    { type: "output" as const, content: "• 'help' - see all commands", timestamp: new Date() },
    { type: "output" as const, content: "• 'ls' - list files", timestamp: new Date() },
    { type: "output" as const, content: "• 'hack' - start cyber game!", timestamp: new Date() },
    { type: "output" as const, content: "• 'cat welcome.txt' - read welcome", timestamp: new Date() },
    { type: "output" as const, content: "", timestamp: new Date() },
    { type: "info" as const, content: "💡 Or ask naturally: 'show files', 'help me', 'what can you do?'", timestamp: new Date() },
    { type: "output" as const, content: "", timestamp: new Date() },
    { type: "info" as const, content: "⚡ This terminal executes REAL commands!", timestamp: new Date() },
    { type: "output" as const, content: "", timestamp: new Date() },
  ];
};

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>(getInitialLines())
  const [currentInput, setCurrentInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [fontSize, setFontSize] = useState(14)
  const [aiThinking, setAiThinking] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [pendingSteps, setPendingSteps] = useState<string[]>([])
  const [currentWorkingDirectory, setCurrentWorkingDirectory] = useState<string>("")
  const [user, setUser] = useState<string>("user")
  const [hostname, setHostname] = useState<string>("vibe-terminal")
  const [directoryContents, setDirectoryContents] = useState<string[]>([])
  const [isRemoteMode, setIsRemoteMode] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Function to get current directory contents for context
  const updateDirectoryContents = async () => {
    try {
      const result = await executeRealCommand('ls -1') // Use -1 for one file per line
      if (result.success && result.stdout.trim()) {
        const contents = result.stdout.trim().split('\n').filter(item => item.trim() !== '')
        setDirectoryContents(contents)
      } else {
        setDirectoryContents([])
      }
    } catch (error) {
      console.error('Failed to get directory contents:', error)
      setDirectoryContents([])
    }
  }

  // Add mobile tip after hydration to avoid hydration mismatch
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setLines(prevLines => {
        // Replace the last info line with mobile tip
        const newLines = [...prevLines];
        const lastInfoIndex = newLines.findLastIndex(line => line.content === "⚡ This terminal executes REAL commands!");
        if (lastInfoIndex !== -1) {
          newLines[lastInfoIndex] = {
            type: "info",
            content: "📱 Mobile tip: Tap anywhere to focus input!",
            timestamp: new Date()
          };
        }
        return newLines;
      });
    }
  }, []);

  // Get initial working directory and user info
  useEffect(() => {
    const initializeTerminal = async () => {
      try {
        // Get current working directory
        const pwdResponse = await fetch(getApiUrl('/api/execute'), {
          method: 'POST',
          headers: getApiHeaders(),
          body: JSON.stringify({ command: 'pwd' })
        });
        const pwdResult = await pwdResponse.json();
        
        // Check if we're in remote mode based on the response
        setIsRemoteMode(pwdResult.isSimulated || false);
        
        if (pwdResult.success) {
          setCurrentWorkingDirectory(pwdResult.stdout.trim() || '/home/user');
        } else {
          setCurrentWorkingDirectory('/home/user');
        }

        // Get username
        const whoamiResponse = await fetch(getApiUrl('/api/execute'), {
          method: 'POST',
          headers: getApiHeaders(),
          body: JSON.stringify({ command: 'whoami' })
        });
        const whoamiResult = await whoamiResponse.json();
        if (whoamiResult.success) {
          setUser(whoamiResult.stdout.trim());
        }

        // Get hostname
        const hostnameResponse = await fetch(getApiUrl('/api/execute'), {
          method: 'POST',
          headers: getApiHeaders(),
          body: JSON.stringify({ command: 'hostname' })
        });
        const hostnameResult = await hostnameResponse.json();
        if (hostnameResult.success) {
          setHostname(hostnameResult.stdout.trim());
        }

        // Get initial directory contents
        await updateDirectoryContents();
      } catch (error) {
        console.error('Failed to initialize terminal:', error);
        // Assume remote mode if initialization fails
        setIsRemoteMode(true);
        setCurrentWorkingDirectory('/home/user');
      }
    };

    initializeTerminal();
  }, []);

  // Update directory contents when working directory changes
  useEffect(() => {
    if (currentWorkingDirectory) {
      updateDirectoryContents();
    }
  }, [currentWorkingDirectory]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        const viewport = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight
        }
      }
    }
    // Immediate scroll and delayed scroll to ensure it works
    scrollToBottom()
    const timeoutId = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timeoutId)
  }, [lines])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Auto-execute pending steps (multi-step command logic)
  useEffect(() => {
    if (pendingSteps.length > 0 && !isProcessing) {
      const nextStep = pendingSteps[0]
      const remainingSteps = pendingSteps.slice(1)
      setPendingSteps(remainingSteps)
      setTimeout(() => {
        executeCommand(nextStep, true)
      }, 800)
    }
  }, [pendingSteps, isProcessing])

  const getPrompt = () => {
    const shortPath = currentWorkingDirectory.replace(process.env.HOME || '/home/' + user, '~');
    return `${user}@${hostname}:${shortPath}$`
  }

  const executeRealCommand = async (command: string): Promise<{
    stdout: string;
    stderr: string;
    success: boolean;
    currentWorkingDirectory?: string;
  }> => {
    try {
      const response = await fetch(getApiUrl('/api/execute'), {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({ 
          command,
          workingDirectory: currentWorkingDirectory 
        })
      });

      const result = await response.json();
      
      // Update current working directory if changed
      if (result.currentWorkingDirectory) {
        setCurrentWorkingDirectory(result.currentWorkingDirectory);
      }

      return result;
    } catch (error) {
      console.error('Command execution failed:', error);
      return {
        stdout: '',
        stderr: 'Failed to execute command',
        success: false
      };
    }
  };

  const executeCommand = async (input: string, isAutoStep = false) => {
    const trimmedInput = input.trim()
    if (!trimmedInput) return

    setIsProcessing(true)
    setAiThinking("")

    if (!isAutoStep) {
      setCommandHistory((prev) => [...prev, trimmedInput])
      setHistoryIndex(-1)
    }

    let commandList: string[] = [trimmedInput]
    const originalInput = trimmedInput

    // Check if we should interpret with AI
    const shouldUseAI = shouldInterpretWithAI(trimmedInput)
    console.log("Should use AI for:", trimmedInput, "->", shouldUseAI)

    if (shouldUseAI) {
      setAiThinking("🤖 Analyzing your request...")
      try {
        // Build context for AI
        const context = {
          currentDirectory: currentWorkingDirectory,
          directoryContents: directoryContents,
          recentCommands: commandHistory.slice(-5) // Last 5 commands
        }

        const interpretation = await interpretNaturalLanguage(trimmedInput, context)
        commandList = interpretation.commands.filter(cmd => cmd && cmd.trim() !== '') // Filter out empty/undefined commands
        
        // Extract just the reasoning and confidence for the thinking display
        const confidence = interpretation.aiThinking.match(/\((\d+)% confidence\)/)?.[1] || '0'
        setAiThinking(`🤖 Processing with context... (${confidence}% confidence)`)

        // Handle conversational responses (empty commands)
        if (commandList.length === 0) {
          const newLines: TerminalLine[] = []
          
          if (!isAutoStep) {
            newLines.push({ type: "command", content: `${getPrompt()} ${originalInput}`, timestamp: new Date() })
          }
          
          // Show Berto's conversational response - extract just the explanation without the confidence part
          const responseText = interpretation.aiThinking.replace(/🤖\s*/, '').replace(/\s*\(\d+% confidence\)/, '')
          newLines.push({
            type: "info",
            content: responseText,
            timestamp: new Date(),
          })
          newLines.push({ type: "output", content: "", timestamp: new Date() })
          
          setLines((prev) => [...prev, ...newLines])
          setIsProcessing(false)
          setAiThinking("") // Clear thinking indicator
          
          if (!isAutoStep) {
            setTimeout(() => inputRef.current?.focus(), 50)
          }
          return
        }

        if (interpretation.isComplex && commandList.length > 1 && !isAutoStep) {
          setPendingSteps(commandList.slice(1))
        }
      } catch (error) {
        console.error("AI interpretation failed:", error)
        setAiThinking("🤖 AI interpretation failed - using direct command")
      }
    }

    // Make sure we have a valid command to execute
    const actualCommand = commandList[0]
    if (!actualCommand || actualCommand.trim() === '') {
      // If we somehow get here with no command, just show a friendly message
      const newLines: TerminalLine[] = []
      if (!isAutoStep) {
        newLines.push({ type: "command", content: `${getPrompt()} ${originalInput}`, timestamp: new Date() })
      }
      newLines.push({
        type: "info",
        content: "🤖 I'm not sure what you'd like me to do. Try asking me something like 'show files' or 'create a folder'!",
        timestamp: new Date(),
      })
      newLines.push({ type: "output", content: "", timestamp: new Date() })
      
      setLines((prev) => [...prev, ...newLines])
      setIsProcessing(false)
      setAiThinking("") // Clear thinking indicator
      
      if (!isAutoStep) {
        setTimeout(() => inputRef.current?.focus(), 50)
      }
      return
    }

    const newLines: TerminalLine[] = []

    if (!isAutoStep) {
      newLines.push({ type: "command", content: `${getPrompt()} ${originalInput}`, timestamp: new Date() })
      
      // Show AI-generated command for educational purposes
      if (shouldUseAI && actualCommand !== originalInput) {
        newLines.push({
          type: "info",
          content: `🤖 Berto interpreted this as: ${actualCommand}`,
          timestamp: new Date(),
        })
        newLines.push({
          type: "output",
          content: `💡 Copy this command to use in your real terminal: ${actualCommand}`,
          timestamp: new Date(),
        })
        newLines.push({ type: "output", content: "", timestamp: new Date() })
      }
    } else {
      newLines.push({ type: "command", content: `${getPrompt()} ${actualCommand}`, timestamp: new Date() })
    }

    // Show multi-step execution feedback
    if (commandList.length > 1 && !isAutoStep) {
      newLines.push({
        type: "info",
        content: `🤖 Breaking down into ${commandList.length} steps...`,
        timestamp: new Date(),
      })
      newLines.push({
        type: "output",
        content: `Steps: ${commandList.join(" → ")}`,
        timestamp: new Date(),
      })
      newLines.push({ type: "output", content: "", timestamp: new Date() })
    }

    // Handle special built-in commands
    if (actualCommand === "clear") {
      setLines([])
      setAiThinking("")
      setPendingSteps([])
      setIsProcessing(false)
      return
    }

    // Execute the real command
    try {
      const result = await executeRealCommand(actualCommand)
      
      if (result.success) {
        // Add stdout if present
        if (result.stdout.trim()) {
          const outputLines = result.stdout.split('\n').filter(line => line.trim() !== '')
          outputLines.forEach(line => {
            newLines.push({
              type: "output",
              content: line,
              timestamp: new Date(),
            })
          })
        }
        
        // Add stderr as warnings if present
        if (result.stderr.trim()) {
          const errorLines = result.stderr.split('\n').filter(line => line.trim() !== '')
          errorLines.forEach(line => {
            newLines.push({
              type: "error",
              content: line,
              timestamp: new Date(),
            })
          })
        }

        // Update directory contents after successful commands that might change them
        const directoryChangingCommands = ['mkdir', 'rmdir', 'rm', 'mv', 'cp', 'touch', 'cd']
        if (directoryChangingCommands.some(cmd => actualCommand.startsWith(cmd))) {
          setTimeout(updateDirectoryContents, 100) // Small delay to ensure file system is updated
        }
      } else {
        // Command failed - check if it's a simple "command not found" case
        if (result.stderr.includes('command not found')) {
          // Provide a friendly Berto response for command not found
          const commandName = actualCommand.split(' ')[0]
          newLines.push({
            type: "info",
            content: `🤖 Hmm, "${commandName}" isn't a command I recognize.`,
            timestamp: new Date(),
          })
          newLines.push({
            type: "output",
            content: `💡 Try asking me in natural language like "show files" or "create a folder"`,
            timestamp: new Date(),
          })
          newLines.push({
            type: "output",
            content: `📚 Or use "help" to see what I can do!`,
            timestamp: new Date(),
          })
        } else {
          // Other errors - show them normally
          if (result.stderr.trim()) {
            const errorLines = result.stderr.split('\n').filter(line => line.trim() !== '')
            errorLines.forEach(line => {
              newLines.push({
                type: "error",
                content: line,
                timestamp: new Date(),
              })
            })
          } else {
            newLines.push({
              type: "error", 
              content: "Command execution failed",
              timestamp: new Date(),
            })
          }
        }
      }
    } catch (error) {
      console.error("Command execution error:", error)
      newLines.push({
        type: "error",
        content: "Failed to execute command. Please try again.",
        timestamp: new Date(),
      })
    }

    // Add empty line for spacing
    newLines.push({ type: "output", content: "", timestamp: new Date() })

    setLines((prev) => [...prev, ...newLines])
    setIsProcessing(false)
    setAiThinking("") // Clear thinking indicator when done

    if (!isAutoStep) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }



  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (isProcessing) {
      e.preventDefault()
      return
    }

    if (e.key === "Enter") {
      await executeCommand(currentInput)
      setCurrentInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCurrentInput("")
        } else {
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex])
        }
      }
    } else if (e.ctrlKey && e.key === "c") {
      e.preventDefault()
      const newLinesToAdd: TerminalLine[] = [
        { type: "command", content: `${getPrompt()} ${currentInput}^C`, timestamp: new Date() },
        { type: "output", content: "", timestamp: new Date() },
      ]
      setLines((prev) => [...prev, ...newLinesToAdd])
      setCurrentInput("")
      setAiThinking("")
      setIsProcessing(false)
      setPendingSteps([])
    }
  }

  const renderLine = (line: TerminalLine, index: number) => {
    let className = "whitespace-pre-wrap break-words font-mono text-sm sm:text-sm leading-relaxed py-1 sm:py-0"
    switch (line.type) {
      case "command":
        className += " text-green-400 font-medium"
        break
      case "error":
        className += " text-red-400"
        break
      case "info":
        className += " text-cyan-400"
        break
      default:
        className += " text-white"
    }
    
    return (
      <div key={index} className={className}>
        {line.content}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative h-full flex flex-col">
        {/* Clean Terminal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-4 border-b border-gray-800 bg-gray-900">
          <div className="flex items-center gap-3 sm:gap-3 min-w-0 flex-1">
            <Sparkles className="w-5 h-5 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
            <span className="text-lg sm:text-xl font-mono font-bold text-white tracking-wider">
              BERTO TERMINAL
            </span>
            {pendingSteps.length > 0 && (
              <div className="text-xs text-yellow-400 font-mono animate-pulse hidden lg:block">
                🤖 Auto-executing ({pendingSteps.length} steps remaining)
              </div>
            )}
          </div>
          <div className="text-xs sm:text-sm text-gray-400 font-mono ml-2">
            <div className="text-right">
              <div className="hidden sm:block">{isRemoteMode ? '🌐 Remote Mode' : '⚡ Local Mode'}</div>
              <div className="sm:hidden">{isRemoteMode ? '🌐' : '⚡'}</div>
            </div>
          </div>
        </div>



        {/* Terminal Content */}
        <div
          className="flex-1 px-3 sm:px-8 py-3 sm:py-6 cursor-text overflow-hidden relative z-10"
          onClick={() => inputRef.current?.focus()}
          style={{ fontSize: `${fontSize}px` }} // Keep normal font size
        >
          <ScrollArea className="h-full" ref={scrollRef}>
            <div className="space-y-2 sm:space-y-1 w-full max-w-none">
              {lines.map((line, index) => renderLine(line, index))}
              <div className="flex items-baseline mt-6 sm:mt-4">
                <span className="text-green-400 font-mono text-sm font-medium flex-shrink-0 mr-1">
                  {getPrompt()}
                </span>
                <input
                  ref={inputRef}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm placeholder:text-gray-500 min-w-0"
                  placeholder={isProcessing ? "Processing..." : "Type command or ask naturally..."}
                  autoComplete="off"
                  disabled={isProcessing}
                  style={{ height: 'auto', lineHeight: '1.2' }}
                />
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* AI Thinking Indicator */}
        {aiThinking && (
          <div className="px-4 sm:px-8 py-3 border-t border-gray-800 bg-gray-900/50">
            <div className="text-sm text-yellow-400 font-mono animate-pulse">
              {aiThinking}
            </div>
          </div>
        )}

        {/* Mobile-specific touch hint */}
        <div className="sm:hidden px-4 py-2 bg-gray-800/50 border-t border-gray-700">
          <div className="text-xs text-gray-400 font-mono text-center">
            💡 Tip: Tap anywhere to focus input • Try: "hack" or "ls"
          </div>
        </div>
      </div>
    </div>
  )
}

