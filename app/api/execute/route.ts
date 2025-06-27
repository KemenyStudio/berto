import { NextRequest, NextResponse } from 'next/server';
import { shellExecutor } from '@/services/shell-executor';
import { hybridFileSystem } from '@/services/hybrid-filesystem';
import { environmentDetector } from '@/services/environment-detector';
import { getApiHeaders, getApiUrl } from '@/lib/utils';

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
      
      // Special handling for hack challenge files
      const currentDir = shellExecutor.getCurrentWorkingDirectory();
      
      if (currentDir === '/var/games' && filePath === 'README_HACK') {
        try {
          const aiResponse = await fetch(getApiUrl("/api/ai"), {
            method: "POST",
            headers: getApiHeaders(),
            body: JSON.stringify({
              action: "hack_readme",
              input: "Generate dynamic README_HACK content",
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            return NextResponse.json({
              stdout: aiData.content || 'Instructions loading failed...',
              stderr: '',
              exitCode: 0,
              success: true,
              currentWorkingDirectory: shellExecutor.getCurrentWorkingDirectory(),
              isSimulated: true
            });
          }
        } catch (error) {
          console.error('AI README_HACK generation failed:', error);
        }
        
        // Fallback to static content if AI fails
        return NextResponse.json({
          stdout: `🕵️ HACKER CHALLENGE INSTRUCTIONS

1. INTEL GATHERING:
   - Navigate to 'intel' directory
   - Read all intelligence files
   - Find CODE_1

2. MATRIX DECODING:
   - Check 'matrix.dat' file
   - Decode the pattern to find CODE_2

3. VAULT CRACKING:
   - Enter the vault with the secret password
   - Complete the puzzle for CODE_3

▶ BONUS LEVEL:
   - Explore 'level2' for an optional side quest
   - Add your alias to 'scoreboard.txt'

Once you have all 3 codes, check 'victory.txt'!

💡 HINTS:
- Use 'ls -la' to see hidden files
- Some files need special commands
- The password was mentioned somewhere...`,
          stderr: '',
          exitCode: 0,
          success: true,
          currentWorkingDirectory: shellExecutor.getCurrentWorkingDirectory(),
          isSimulated: true
        });
      }
      
      // Special handlers for intel directory files
      if (currentDir === '/var/games/intel') {
        if (filePath === 'mission_brief.txt') {
          return NextResponse.json({
            stdout: `🕵️ CLASSIFIED MISSION BRIEFING\n\n` +
                   `OPERATION: DIGITAL INFILTRATION\n` +
                   `OBJECTIVE: Locate and extract 3 access codes\n\n` +
                   `INTEL REPORT:\n` +
                   `- Primary target: Mainframe database\n` +
                   `- Security level: MAXIMUM\n` +
                   `- Time constraint: CRITICAL\n\n` +
                   `AGENT INSTRUCTIONS:\n` +
                   `1. Decode matrix pattern (../matrix.dat)\n` +
                   `2. Crack vault security (../vault/)\n` +
                   `3. Compile all access codes\n\n` +
                   `STATUS: ACTIVE\n` +
                   `CLEARANCE LEVEL: NEED-TO-KNOW\n\n` +
                   `💡 Check CODE_1.dat for your first access code!`,
            stderr: '',
            exitCode: 0,
            success: true,
            currentWorkingDirectory: currentDir,
            isSimulated: true
          });
        } else if (filePath === 'CODE_1.dat') {
          return NextResponse.json({
            stdout: `🔐 ACCESS CODE 1 LOCATED\n\n` +
                   `DECRYPTION SUCCESSFUL...\n` +
                   `PARSING DIGITAL SIGNATURE...\n\n` +
                   `┌─────────────────────────────┐\n` +
                   `│    ACCESS CODE 1: ALPHA     │\n` +
                   `│    VALIDATION: ✓ CONFIRMED  │\n` +
                   `└─────────────────────────────┘\n\n` +
                   `🎯 PROGRESS: 1/3 codes found\n` +
                   `📋 NEXT STEPS:\n` +
                   `   • Decode matrix.dat for CODE_2\n` +
                   `   • Crack vault for CODE_3\n\n` +
                   `💡 Use 'cat ../matrix.dat' to continue!`,
            stderr: '',
            exitCode: 0,
            success: true,
            currentWorkingDirectory: currentDir,
            isSimulated: true
          });
        } else if (filePath === 'targets.list') {
          return NextResponse.json({
            stdout: `🎯 TARGET ACQUISITION LIST\n\n` +
                   `PRIMARY TARGETS:\n` +
                   `• Database Server: 192.168.1.100\n` +
                   `• Backup System: 192.168.1.101\n` +
                   `• Security Node: 192.168.1.102\n\n` +
                   `SECONDARY TARGETS:\n` +
                   `• Admin Workstation: 192.168.1.50\n` +
                   `• Network Gateway: 192.168.1.1\n\n` +
                   `ENCRYPTION PROTOCOLS:\n` +
                   `• RSA-2048 (Primary)\n` +
                   `• AES-256 (Backup)\n\n` +
                   `⚠️  SECURITY NOTICE: All targets under surveillance`,
            stderr: '',
            exitCode: 0,
            success: true,
            currentWorkingDirectory: currentDir,
            isSimulated: true
          });
        } else if (filePath === '.classified' || filePath === './.classified') {
          return NextResponse.json({
            stdout: `🔒 CLASSIFIED DOCUMENT - EYES ONLY\n\n` +
                   `OPERATION CODENAME: DIGITAL GHOST\n` +
                   `AUTHORIZATION LEVEL: OMEGA\n\n` +
                   `VAULT PASSWORD HINT:\n` +
                   `"The answer lies in the question itself"\n` +
                   `"Look for what was written in the beginning"\n\n` +
                   `EMERGENCY PROTOCOLS:\n` +
                   `• Code word: FIREWALL\n` +
                   `• Extraction point: /home/user\n\n` +
                   `⚠️  DESTROY AFTER READING ⚠️`,
            stderr: '',
            exitCode: 0,
            success: true,
            currentWorkingDirectory: currentDir,
            isSimulated: true
          });
        }
      }
      
      // Special handler for matrix.dat file
      if ((currentDir === '/var/games' || currentDir === '/var/games/intel') && (filePath === 'matrix.dat' || filePath === '../matrix.dat')) {
        return NextResponse.json({
          stdout: `🔢 MATRIX DECRYPTION PROTOCOL\n\n` +
                 `ENCRYPTED DATA STREAM:\n` +
                 `01000010 01100101 01110010 01110100 01101111\n` +
                 `11000010 10100000 01000010 01100101 01110100\n` +
                 `01000001 00100000 01000010 01100101 01110100\n` +
                 `01000001 00100000 01000010 01100101 01110100\n\n` +
                 `DECODING MATRIX...\n` +
                 `BINARY TO ASCII CONVERSION...\n\n` +
                 `┌─────────────────────────────┐\n` +
                 `│    ACCESS CODE 2: BETA      │\n` +
                 `│    VALIDATION: ✓ CONFIRMED  │\n` +
                 `└─────────────────────────────┘\n\n` +
                 `🎯 PROGRESS: 2/3 codes found\n` +
                 `📋 FINAL STEP: Access vault for CODE_3\n\n` +
                 `💡 Try 'cd vault' to enter the final challenge!`,
          stderr: '',
          exitCode: 0,
          success: true,
          currentWorkingDirectory: shellExecutor.getCurrentWorkingDirectory(),
          isSimulated: true
        });
      }
      
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
      
      // Special handling for hack challenge directories
      const currentDir = shellExecutor.getCurrentWorkingDirectory();
      
      if (currentDir === '/var/games' && (dirPath === '.' || dirPath === '/var/games')) {
        const hackFiles = [
          'drwxr-xr-x 1 games games 4096 Dec 25 12:00 .',
          'drwxr-xr-x 1 root  root  4096 Dec 25 12:00 ..',
          '-rw-r--r-- 1 games games  445 Dec 25 12:00 README_HACK',
          '-rwxr-xr-x 1 games games  512 Dec 25 12:00 start_hack.sh',
          'drwxr-xr-x 1 games games 4096 Dec 25 12:00 intel',
          '-rw-r--r-- 1 games games  334 Dec 25 12:00 matrix.dat',
          'drwxr-xr-x 1 games games 4096 Dec 25 12:00 level2',
          'drwx------ 1 games games 4096 Dec 25 12:00 vault',
          '-rw-r--r-- 1 games games  138 Dec 25 12:00 scoreboard.txt',
          '-rw-r--r-- 1 games games  445 Dec 25 12:00 victory.txt'
        ];
        
        return NextResponse.json({
          stdout: `total 10\n${hackFiles.join('\n')}`,
          stderr: '',
          exitCode: 0,
          success: true,
          currentWorkingDirectory: shellExecutor.getCurrentWorkingDirectory(),
          isSimulated: true
        });
      } else if (currentDir === '/var/games/intel' && (dirPath === '.' || dirPath === 'intel')) {
        const intelFiles = [
          'drwxr-xr-x 1 games games 4096 Dec 25 12:00 .',
          'drwxr-xr-x 1 games games 4096 Dec 25 12:00 ..',
          '-rw-r--r-- 1 agent agent  256 Dec 25 12:00 mission_brief.txt',
          '-rw-r--r-- 1 agent agent  180 Dec 25 12:00 targets.list',
          '-rw------- 1 agent agent   42 Dec 25 12:00 .classified',
          '-rwxr-xr-x 1 agent agent  512 Dec 25 12:00 decode.sh',
          '-rw-r--r-- 1 agent agent  128 Dec 25 12:00 CODE_1.dat'
        ];
        
        return NextResponse.json({
          stdout: `🕵️ INTEL DIRECTORY - CLASSIFIED FILES\n\ntotal 12\n${intelFiles.join('\n')}\n\n💡 Try: cat mission_brief.txt, cat CODE_1.dat`,
          stderr: '',
          exitCode: 0,
          success: true,
          currentWorkingDirectory: currentDir,
          isSimulated: true
        });
      } else if (currentDir === '/var/games/level2' && (dirPath === '.' || dirPath === 'level2')) {
        const level2Files = [
          'drwxr-xr-x 1 games games 4096 Dec 25 12:00 .',
          'drwxr-xr-x 1 games games 4096 Dec 25 12:00 ..',
          '-rw-r--r-- 1 games games  210 Dec 25 12:00 network.log',
          '-rw-r--r-- 1 games games  178 Dec 25 12:00 puzzle.txt'
        ];

        return NextResponse.json({
          stdout: `📡 SIDE QUEST FILES\n\ntotal 8\n${level2Files.join('\n')}\n\n💡 Try: cat puzzle.txt`,
          stderr: '',
          exitCode: 0,
          success: true,
          currentWorkingDirectory: currentDir,
          isSimulated: true
        });
      } else if (currentDir === '/var/games/vault' && (dirPath === '.' || dirPath === 'vault')) {
        return NextResponse.json({
          stdout: '🔐 VAULT ACCESS DENIED\n\nAccess to vault contents requires authentication.\nPassword hint: It was mentioned in the README...\n\n💡 Try: cat ../README_HACK for clues',
          stderr: '',
          exitCode: 0,
          success: true,
          currentWorkingDirectory: currentDir,
          isSimulated: true
        });
      }
      
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

    // Handle cd command for hack challenge and simulated environments
    if (trimmedCommand.startsWith('cd ')) {
      const targetPath = command.trim().substring(3).trim() || '~';
      
      // Special handling for hack challenge directories
      const currentDir = shellExecutor.getCurrentWorkingDirectory();
      
      if (currentDir === '/var/games') {
        // Handle cd commands within the hack challenge
        if (targetPath === 'intel' || targetPath === './intel') {
          // Simulate entering intel directory
          shellExecutor.setCurrentWorkingDirectory('/var/games/intel');
          return NextResponse.json({
            stdout: '',
            stderr: '',
            exitCode: 0,
            success: true,
            currentWorkingDirectory: '/var/games/intel',
            isSimulated: true
          });
        } else if (targetPath === 'level2' || targetPath === './level2') {
          // Side quest directory
          shellExecutor.setCurrentWorkingDirectory('/var/games/level2');
          return NextResponse.json({
            stdout: '',
            stderr: '',
            exitCode: 0,
            success: true,
            currentWorkingDirectory: '/var/games/level2',
            isSimulated: true
          });
        } else if (targetPath === 'vault' || targetPath === './vault') {
          // Simulate entering vault directory (but require password later)
          shellExecutor.setCurrentWorkingDirectory('/var/games/vault');
          return NextResponse.json({
            stdout: '',
            stderr: '',
            exitCode: 0,
            success: true,
            currentWorkingDirectory: '/var/games/vault',
            isSimulated: true
          });
        } else if (targetPath === '..' || targetPath === '../') {
          // Go back to parent directory
          shellExecutor.setCurrentWorkingDirectory('/var');
          return NextResponse.json({
            stdout: '',
            stderr: '',
            exitCode: 0,
            success: true,
            currentWorkingDirectory: '/var',
            isSimulated: true
          });
        } else if (targetPath === '~' || targetPath === '/home/user') {
          // Go to home directory
          shellExecutor.setCurrentWorkingDirectory('/home/user');
          return NextResponse.json({
            stdout: '',
            stderr: '',
            exitCode: 0,
            success: true,
            currentWorkingDirectory: '/home/user',
            isSimulated: true
          });
        }
      } else if (currentDir === '/var/games/intel' && (targetPath === '..' || targetPath === '../')) {
        // Go back to /var/games from intel
        shellExecutor.setCurrentWorkingDirectory('/var/games');
        return NextResponse.json({
          stdout: '',
          stderr: '',
          exitCode: 0,
          success: true,
          currentWorkingDirectory: '/var/games',
          isSimulated: true
        });
      } else if (currentDir === '/var/games/level2' && (targetPath === '..' || targetPath === '../')) {
        // Go back to /var/games from level2
        shellExecutor.setCurrentWorkingDirectory('/var/games');
        return NextResponse.json({
          stdout: '',
          stderr: '',
          exitCode: 0,
          success: true,
          currentWorkingDirectory: '/var/games',
          isSimulated: true
        });
      } else if (currentDir === '/var/games/vault' && (targetPath === '..' || targetPath === '../')) {
        // Go back to /var/games from vault
        shellExecutor.setCurrentWorkingDirectory('/var/games');
        return NextResponse.json({
          stdout: '',
          stderr: '',
          exitCode: 0,
          success: true,
          currentWorkingDirectory: '/var/games',
          isSimulated: true
        });
      } else if (targetPath === '/var/games') {
        // Direct navigation to hack challenge
        shellExecutor.setCurrentWorkingDirectory('/var/games');
        return NextResponse.json({
          stdout: '',
          stderr: '',
          exitCode: 0,
          success: true,
          currentWorkingDirectory: '/var/games',
          isSimulated: true
        });
      }
      
      // For other cd commands in remote mode, try to handle them gracefully
      if (!environmentDetector.canAccessLocalFiles()) {
        // Basic simulated directory navigation
        let newPath = targetPath;
        if (targetPath === '~' || targetPath === '$HOME') {
          newPath = '/home/user';
        } else if (targetPath === '..') {
          const parts = currentDir.split('/').filter(p => p);
          parts.pop();
          newPath = '/' + parts.join('/');
          if (newPath === '/') newPath = '/home/user';
        } else if (!targetPath.startsWith('/')) {
          // Relative path
          newPath = currentDir + '/' + targetPath;
        }
        
        shellExecutor.setCurrentWorkingDirectory(newPath);
        return NextResponse.json({
          stdout: '',
          stderr: '',
          exitCode: 0,
          success: true,
          currentWorkingDirectory: newPath,
          isSimulated: true
        });
      }
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

    // Handle hint command for hack challenge
    if (trimmedCommand === 'hint' && shellExecutor.getCurrentWorkingDirectory() === '/var/games') {
      try {
        const aiResponse = await fetch(getApiUrl("/api/ai"), {
          method: "POST",
          headers: getApiHeaders(),
          body: JSON.stringify({
            action: "hack_hint",
            input: "Generate a personalized hint for hack challenge",
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          return NextResponse.json({
            stdout: `🤖 AI HACKER ASSISTANT\n\n${aiData.content}\n\n💡 Try: ls, cat README_HACK, or ask for another hint!`,
            stderr: '',
            exitCode: 0,
            success: true,
            currentWorkingDirectory: shellExecutor.getCurrentWorkingDirectory(),
            isSimulated: true
          });
        }
      } catch (error) {
        console.error('AI hint generation failed:', error);
      }
      
      return NextResponse.json({
        stdout: `🤖 AI HACKER ASSISTANT\n\n💡 You're in the /var/games directory now. Try these commands:\n\n• ls - see all available files\n• cat README_HACK - read the mission briefing\n• ls intel - check the intel directory\n• cat matrix.dat - examine the encrypted data\n\nStuck? Type 'hint' again for more help!`,
        stderr: '',
        exitCode: 0,
        success: true,
        currentWorkingDirectory: shellExecutor.getCurrentWorkingDirectory(),
        isSimulated: true
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
               '• hack              - Start AI-powered cyber hacker challenge\n' +
               '• hint              - Get AI hints (when in hack challenge)\n' +
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
      // Generate dynamic, personalized hack challenge using AI
      try {
        const aiResponse = await fetch(getApiUrl("/api/ai"), {
          method: "POST",
          headers: getApiHeaders(),
          body: JSON.stringify({
            action: "hack_challenge_intro",
            input: "Generate a personalized cyber hack challenge intro",
          }),
        });

        let dynamicIntro = '';
        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          dynamicIntro = aiData.content || '';
        }

        return NextResponse.json({
          stdout: '🎮 Starting AI-powered hack challenge...\nNavigating to /var/games...\n\n' +
                 '#!/bin/bash\n\n🎮 WELCOME TO CYBER HACK CHALLENGE 🎮\n\n' +
                 '======================================\n' +
                 '    UNAUTHORIZED ACCESS DETECTED\n' +
                 '======================================\n\n' +
                 (dynamicIntro || 'You\'ve stumbled into the mainframe...') + '\n\n' +
                 'MISSION: Find the 3 hidden access codes\n' +
                 '1. Check the \'intel\' directory\n' +
                 '2. Decode the matrix file\n' +
                 '3. Crack the vault\n\n' +
                 'Type \'cat README_HACK\' for AI-generated instructions!\n\n' +
                 'Good luck, hacker! 😎\n\n' +
                 '💡 New: AI will adapt challenges based on your progress!',
          stderr: '',
          exitCode: 0,
          success: true,
          currentWorkingDirectory: '/var/games',
          isSimulated: true
        });
      } catch (error) {
        // Fallback to original if AI fails
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