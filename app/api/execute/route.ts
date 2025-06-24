import { NextRequest, NextResponse } from 'next/server';
import { shellExecutor } from '@/services/shell-executor';

// Force dynamic for API functionality  
export const dynamic = 'force-dynamic'

// Check if request is coming from Electron app
function isElectronRequest(req: NextRequest): boolean {
  const userAgent = req.headers.get('user-agent') || '';
  const origin = req.headers.get('origin') || '';
  const referer = req.headers.get('referer') || '';
  
  // Check for Electron user agent
  if (userAgent.includes('Electron')) {
    return true;
  }
  
  // Check if origin is localhost (Electron app connecting to Vercel)
  if (origin.includes('localhost') || referer.includes('localhost')) {
    return false; // This is local development, not Electron production
  }
  
  // Check for custom header that Electron app can send
  if (req.headers.get('x-electron-app') === 'true') {
    return true;
  }
  
  // Check for query parameter (as fallback)
  const url = new URL(req.url);
  if (url.searchParams.get('electron') === 'true') {
    return true;
  }
  
  return false;
}

// Simulate command execution for web users
function simulateCommand(command: string): any {
  const cmd = command.trim().toLowerCase();
  
  if (cmd.startsWith('ls')) {
    return {
      stdout: 'README.md\npackage.json\nnode_modules\nsrc\npublic\n.gitignore',
      stderr: '',
      exitCode: 0,
      success: true
    };
  }
  
  if (cmd.startsWith('pwd')) {
    return {
      stdout: '/var/task\n',
      stderr: '',
      exitCode: 0,
      success: true
    };
  }
  
  if (cmd.startsWith('cat') && cmd.includes('readme')) {
    return {
      stdout: '# Berto AI Terminal\n\nWelcome to Berto! This is a simulated read-only environment.\nTo get full terminal access, download the desktop app.\n',
      stderr: '',
      exitCode: 0,
      success: true
    };
  }
  
  if (cmd.startsWith('echo')) {
    const text = command.substring(4).trim();
    return {
      stdout: text + '\n',
      stderr: '',
      exitCode: 0,
      success: true
    };
  }
  
  if (cmd.startsWith('whoami')) {
    return {
      stdout: 'vibe-user\n',
      stderr: '',
      exitCode: 0,
      success: true
    };
  }
  
  if (cmd.startsWith('date')) {
    return {
      stdout: new Date().toString() + '\n',
      stderr: '',
      exitCode: 0,
      success: true
    };
  }
  
  // Default response for unsupported commands
  return {
    stdout: '',
    stderr: `bash: ${command.split(' ')[0]}: command not found\nNote: This is a read-only demo environment. Download the desktop app for full terminal access.`,
    exitCode: 127,
    success: false
  };
}

export async function POST(req: NextRequest) {
  try {
    const { command, workingDirectory } = await req.json();

    if (!command || typeof command !== 'string') {
      return NextResponse.json({ 
        error: 'Command is required and must be a string' 
      }, { status: 400 });
    }

    // Check if this is an Electron app request
    const isElectron = isElectronRequest(req);
    
    if (isElectron) {
      // Full terminal execution for Electron app
      console.log('Executing real command for Electron app:', command);
      
      // Set working directory if provided
      if (workingDirectory && typeof workingDirectory === 'string') {
        shellExecutor.setCurrentWorkingDirectory(workingDirectory);
      }

      // Execute the command safely
      const result = await shellExecutor.safeExecuteCommand(command);
      
      // Get the current working directory after execution
      const currentCwd = shellExecutor.getCurrentWorkingDirectory();

      return NextResponse.json({
        ...result,
        currentWorkingDirectory: currentCwd,
        isSimulated: false
      });
    } else {
      // Simulated execution for web users
      console.log('Simulating command for web user:', command);
      
      const result = simulateCommand(command);
      
      return NextResponse.json({
        ...result,
        currentWorkingDirectory: '/var/task',
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
      isSimulated: false
    }, { status: 500 });
  }
} 