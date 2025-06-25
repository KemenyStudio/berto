import { NextRequest, NextResponse } from 'next/server';
import { shellExecutor } from '@/services/shell-executor';
import { hybridFileSystem } from '@/services/hybrid-filesystem';
import { environmentDetector } from '@/services/environment-detector';

// Force dynamic for API functionality  
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { command, workingDirectory } = await req.json();

    if (!command || typeof command !== 'string') {
      return NextResponse.json({ 
        error: 'Command is required and must be a string' 
      }, { status: 400 });
    }

    // Set working directory if provided
    if (workingDirectory && typeof workingDirectory === 'string') {
      shellExecutor.setCurrentWorkingDirectory(workingDirectory);
    }

    // Handle common file operations with hybrid filesystem
    const trimmedCommand = command.trim().toLowerCase();
    
    // Handle cat command for file reading
    if (trimmedCommand.startsWith('cat ')) {
      const filePath = command.trim().substring(4);
      const result = await hybridFileSystem.readFile(filePath);
      return NextResponse.json({
        stdout: result.content || '',
        stderr: result.error || '',
        exitCode: result.success ? 0 : 1,
        success: result.success,
        currentWorkingDirectory: shellExecutor.getCurrentWorkingDirectory(),
        isSimulated: result.isSimulated
      });
    }

    // Handle ls command for directory listing
    if (trimmedCommand.startsWith('ls') || trimmedCommand === 'ls') {
      const pathMatch = command.match(/ls\s+(.+)/);
      const dirPath = pathMatch ? pathMatch[1].replace(/^-\w+\s+/, '') : '.';
      const result = await hybridFileSystem.listDirectory(dirPath);
      return NextResponse.json({
        stdout: result.content || '',
        stderr: result.error || '',
        exitCode: result.success ? 0 : 1,
        success: result.success,
        currentWorkingDirectory: shellExecutor.getCurrentWorkingDirectory(),
        isSimulated: result.isSimulated
      });
    }

    // Handle echo to file creation
    const echoMatch = command.match(/^echo\s+"([^"]*?)"\s*>\s*(.+)$/);
    if (echoMatch) {
      const [, content, filePath] = echoMatch;
      const result = await hybridFileSystem.createFileContent(filePath, content);
      return NextResponse.json({
        stdout: result.content || '',
        stderr: result.error || '',
        exitCode: result.success ? 0 : 1,
        success: result.success,
        currentWorkingDirectory: shellExecutor.getCurrentWorkingDirectory(),
        isSimulated: result.isSimulated
      });
    }

    // Handle help commands
    if (trimmedCommand === 'help' || trimmedCommand === 'list all commands' || trimmedCommand.includes('what commands') || trimmedCommand.includes('show commands')) {
      return NextResponse.json({
        stdout: '🤖 BERTO COMMAND HELP\n\n' +
               '📁 FILE OPERATIONS:\n' +
               '• ls / ls -la       - List files (including hidden)\n' +
               '• cat filename      - Read file contents\n' +
               '• mkdir foldername  - Create directory\n' +
               '• touch filename    - Create empty file\n' +
               '• echo "text" > file - Write text to file\n' +
               '• pwd               - Show current directory\n' +
               '• cd directory      - Change directory\n\n' +
               '🎮 FUN COMMANDS:\n' +
               '• hack              - Start cyber hacker challenge\n' +
               '• joke              - Random programming joke\n' +
               '• fortune           - Get a random fortune\n' +
               '• cat /etc/motd     - See ASCII art banner\n\n' +
               '🕵️ EASTER EGGS:\n' +
               '• ls -la            - Find hidden files (.secret, .bashrc)\n' +
               '• cd /var/games     - Explore the games directory\n' +
               '• cd /opt/retro     - Visit retro zone\n\n' +
               '💡 NATURAL LANGUAGE:\n' +
               'Just ask me naturally! Examples:\n' +
               '• "show me all files"    → ls -la\n' +
               '• "create a folder"      → mkdir\n' +
               '• "what\'s in this file?" → cat\n' +
               '• "make a new file"      → touch\n\n' +
               '🚀 Try: hack, ls, cat welcome.txt, or just ask naturally!',
        stderr: '',
        exitCode: 0,
        success: true,
        currentWorkingDirectory: shellExecutor.getCurrentWorkingDirectory(),
        isSimulated: environmentDetector.isRemoteDeployment()
      });
    }

    // Handle fun easter egg commands
    if (trimmedCommand === 'hack') {
      return NextResponse.json({
        stdout: '🎮 Starting hack challenge...\nNavigating to /var/games...\n\n' +
               '#!/bin/bash\n\n🎮 WELCOME TO CYBER HACK CHALLENGE 🎮\n\n' +
               '======================================\n' +
               '    UNAUTHORIZED ACCESS DETECTED\n' +
               '======================================\n\n' +
               'You\'ve stumbled into the mainframe...\n\n' +
               'MISSION: Find the 3 hidden access codes\n' +
               '1. Check the \'intel\' directory\n' +
               '2. Decode the matrix file\n' +
               '3. Crack the vault\n\n' +
               'Type \'cat README_HACK\' for instructions!\n\n' +
               'Good luck, hacker! 😎',
        stderr: '',
        exitCode: 0,
        success: true,
        currentWorkingDirectory: '/var/games',
        isSimulated: true
      });
    }

    if (trimmedCommand === 'fortune') {
      const fortunes = [
        '🔮 The code you write today will compile on the first try.',
        '🔮 A bug you\'ve been hunting will reveal itself before lunch.',
        '🔮 Your pull request will be approved without any comments.',
        '🔮 You will discover a new easter egg in your favorite app.',
        '🔮 Today is a good day to refactor that messy function.',
        '🔮 The documentation you need actually exists and is helpful.',
        '🔮 Your tests will pass on the first run.',
        '🔮 Stack Overflow will have the exact answer you need.'
      ];
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      return NextResponse.json({
        stdout: `${randomFortune}\n\nLucky numbers: 42, 1337, 404, 200\nLucky color: Terminal Green 💚`,
        stderr: '',
        exitCode: 0,
        success: true,
        currentWorkingDirectory: shellExecutor.getCurrentWorkingDirectory(),
        isSimulated: true
      });
    }

    if (trimmedCommand === 'joke') {
      const jokes = [
        'Q: Why do programmers prefer dark mode?\nA: Because light attracts bugs! 🐛',
        'Q: How many programmers does it take to change a light bulb?\nA: None. That\'s a hardware problem! 💡',
        'Q: Why did the programmer quit his job?\nA: He didn\'t get arrays! 📊',
        'Q: What\'s a programmer\'s favorite hangout place?\nA: Foo Bar! 🍺',
        'Q: Why do Java developers wear glasses?\nA: Because they can\'t C#! 👓',
        'Q: What do you call a programmer from Finland?\nA: Nerdic! 🇫🇮'
      ];
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      return NextResponse.json({
        stdout: `😂 ${randomJoke}`,
        stderr: '',
        exitCode: 0,
        success: true,
        currentWorkingDirectory: shellExecutor.getCurrentWorkingDirectory(),
        isSimulated: true
      });
    }

    // For other commands, use the shell executor if local, or show helpful message if remote
    if (environmentDetector.canAccessLocalFiles()) {
      const result = await shellExecutor.safeExecuteCommand(command);
      return NextResponse.json({
        ...result,
        currentWorkingDirectory: shellExecutor.getCurrentWorkingDirectory(),
        isSimulated: false
      });
    } else {
      // Remote deployment - show helpful message for unsupported commands
      return NextResponse.json({
        stdout: '',
        stderr: `Command "${command}" is not supported in remote mode. Supported commands: cat, ls, echo > file. Use the file upload feature to work with your local files.`,
        exitCode: 127,
        success: false,
        currentWorkingDirectory: '/home/user',
        isSimulated: true
      });
    }

  } catch (error) {
    console.error('Shell execution error:', error);
    return NextResponse.json({ 
      error: 'Failed to execute command',
      stdout: '',
      stderr: 'Internal server error',
      exitCode: 1,
      success: false,
      isSimulated: environmentDetector.isRemoteDeployment()
    }, { status: 500 });
  }
} 