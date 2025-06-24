import { NextRequest, NextResponse } from 'next/server';
import { shellExecutor } from '@/services/shell-executor';

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

    // Execute the command safely
    const result = await shellExecutor.safeExecuteCommand(command);
    
    // Get the current working directory after execution
    const currentCwd = shellExecutor.getCurrentWorkingDirectory();

    return NextResponse.json({
      ...result,
      currentWorkingDirectory: currentCwd
    });

  } catch (error) {
    console.error('Shell execution error:', error);
    return NextResponse.json({ 
      error: 'Failed to execute command',
      stdout: '',
      stderr: 'Internal server error',
      exitCode: 1,
      success: false
    }, { status: 500 });
  }
} 