import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  success: boolean;
}

export interface ShellExecutorOptions {
  workingDirectory?: string;
  timeout?: number;
  maxBuffer?: number;
}

export class ShellExecutor {
  private currentWorkingDirectory: string;

  constructor(initialCwd: string = process.cwd()) {
    this.currentWorkingDirectory = initialCwd;
  }

  getCurrentWorkingDirectory(): string {
    return this.currentWorkingDirectory;
  }

  setCurrentWorkingDirectory(newCwd: string): void {
    try {
      // Resolve the path to make it absolute
      const resolvedPath = path.resolve(this.currentWorkingDirectory, newCwd);
      this.currentWorkingDirectory = resolvedPath;
    } catch (error) {
      console.error('Failed to set working directory:', error);
    }
  }

  async executeCommand(command: string, options: ShellExecutorOptions = {}): Promise<CommandResult> {
    const {
      workingDirectory = this.currentWorkingDirectory,
      timeout = 30000, // 30 seconds default timeout
      maxBuffer = 1024 * 1024 // 1MB default buffer
    } = options;

    try {
      // Handle cd command specially
      if (command.trim().startsWith('cd ')) {
        const cdPath = command.trim().substring(3).trim() || process.env.HOME || '.';
        try {
          const newPath = path.resolve(workingDirectory, cdPath);
          // Check if directory exists
          const { execSync } = await import('child_process');
          execSync(`test -d "${newPath}"`, { stdio: 'ignore' });
          this.setCurrentWorkingDirectory(newPath);
          return {
            stdout: '',
            stderr: '',
            exitCode: 0,
            success: true
          };
        } catch (error) {
          return {
            stdout: '',
            stderr: `cd: ${cdPath}: No such file or directory`,
            exitCode: 1,
            success: false
          };
        }
      }

      // Execute other commands
      const result = await execAsync(command, {
        cwd: workingDirectory,
        timeout,
        maxBuffer,
        encoding: 'utf8'
      });

      return {
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        exitCode: 0,
        success: true
      };

    } catch (error: any) {
      // Handle timeout
      if (error.killed && error.signal === 'SIGTERM') {
        return {
          stdout: error.stdout || '',
          stderr: `Command timed out after ${timeout}ms`,
          exitCode: 124,
          success: false
        };
      }

      // Handle other execution errors
      return {
        stdout: error.stdout || '',
        stderr: error.stderr || error.message || 'Command execution failed',
        exitCode: error.code || 1,
        success: false
      };
    }
  }

  // Sanitize commands to prevent dangerous operations
  sanitizeCommand(command: string): { safe: boolean; reason?: string } {
    const dangerous = [
      'rm -rf /',
      'mkfs',
      'dd if=',
      'fdisk',
      ':(){ :|:& };:',  // fork bomb
      'sudo rm',
      'sudo dd',
      'sudo mkfs',
      'sudo fdisk',
      'shutdown',
      'reboot',
      'halt',
      'init 0',
      'init 6',
    ];

    const cmd = command.toLowerCase().trim();
    
    for (const danger of dangerous) {
      if (cmd.includes(danger.toLowerCase())) {
        return {
          safe: false,
          reason: `Dangerous command detected: "${danger}". This command is blocked for safety.`
        };
      }
    }

    // Block commands that try to access sensitive system files
    if (cmd.includes('/etc/passwd') || 
        cmd.includes('/etc/shadow') || 
        cmd.includes('/etc/sudoers')) {
      return {
        safe: false,
        reason: 'Access to sensitive system files is restricted.'
      };
    }

    return { safe: true };
  }

  // Execute command with safety checks
  async safeExecuteCommand(command: string, options: ShellExecutorOptions = {}): Promise<CommandResult> {
    const safetyCheck = this.sanitizeCommand(command);
    
    if (!safetyCheck.safe) {
      return {
        stdout: '',
        stderr: safetyCheck.reason || 'Command blocked for safety reasons',
        exitCode: 126,
        success: false
      };
    }

    return this.executeCommand(command, options);
  }
}

// Create a global instance
export const shellExecutor = new ShellExecutor(); 