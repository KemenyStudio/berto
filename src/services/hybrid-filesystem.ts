import { environmentDetector } from './environment-detector';
import { shellExecutor } from './shell-executor';
import { createInitialFileSystem, getNodeAtPath, createFile, createDirectory } from '../utils/filesystem';
import type { FileSystemNode } from '../types/filesystem';

export interface FileUpload {
  name: string;
  content: string;
  path: string;
  size: number;
  type: string;
}

export interface HybridFileSystemResult {
  success: boolean;
  content?: string;
  error?: string;
  isSimulated: boolean;
}

export class HybridFileSystem {
  private uploadedFiles: Map<string, FileUpload> = new Map();
  private virtualFileSystem: FileSystemNode;

  constructor() {
    this.virtualFileSystem = createInitialFileSystem();
  }

  // Upload file for remote deployment
  public uploadFile(file: FileUpload): boolean {
    try {
      const fullPath = `${file.path}/${file.name}`;
      this.uploadedFiles.set(fullPath, file);
      
      // Also add to virtual filesystem
      const pathParts = file.path.split('/').filter(p => p !== '');
      createFile(this.virtualFileSystem, pathParts, file.name, file.content);
      
      return true;
    } catch (error) {
      console.error('Failed to upload file:', error);
      return false;
    }
  }

  // Read file - works for both local and uploaded files
  public async readFile(filePath: string): Promise<HybridFileSystemResult> {
    if (environmentDetector.canAccessLocalFiles()) {
      // Local environment - use real filesystem
      try {
        const result = await shellExecutor.safeExecuteCommand(`cat "${filePath}"`);
        return {
          success: result.success,
          content: result.stdout,
          error: result.stderr,
          isSimulated: false
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to read file',
          isSimulated: false
        };
      }
    } else {
      // Remote environment - check uploaded files or virtual filesystem
      const normalizedPath = this.normalizePath(filePath);
      
      // Check uploaded files first
      if (this.uploadedFiles.has(normalizedPath)) {
        const file = this.uploadedFiles.get(normalizedPath)!;
        return {
          success: true,
          content: file.content,
          isSimulated: true
        };
      }

      // Check virtual filesystem
      const pathParts = normalizedPath.split('/').filter(p => p !== '');
      const fileName = pathParts.pop();
      if (fileName) {
        const node = getNodeAtPath(this.virtualFileSystem, pathParts);
        if (node && node.children && node.children[fileName]) {
          const fileNode = node.children[fileName];
          if (fileNode.type === 'file' && fileNode.content) {
            return {
              success: true,
              content: fileNode.content,
              isSimulated: true
            };
          }
        }
      }

      return {
        success: false,
        error: `File not found: ${filePath}`,
        isSimulated: true
      };
    }
  }

  // List directory contents
  public async listDirectory(dirPath: string = '.'): Promise<HybridFileSystemResult> {
    if (environmentDetector.canAccessLocalFiles()) {
      // Local environment - use real filesystem
      try {
        const result = await shellExecutor.safeExecuteCommand(`ls -la "${dirPath}"`);
        return {
          success: result.success,
          content: result.stdout,
          error: result.stderr,
          isSimulated: false
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to list directory',
          isSimulated: false
        };
      }
    } else {
      // Remote environment - use virtual filesystem and uploaded files
      const normalizedPath = this.normalizePath(dirPath);
      const pathParts = normalizedPath === '/' ? [] : normalizedPath.split('/').filter(p => p !== '');
      
      const node = getNodeAtPath(this.virtualFileSystem, pathParts);
      if (node && node.type === 'directory' && node.children) {
        let output = `total ${Object.keys(node.children).length}\n`;
        
        for (const [name, child] of Object.entries(node.children)) {
          const date = child.modified.toLocaleDateString();
          const time = child.modified.toLocaleTimeString().slice(0, 5);
          output += `${child.permissions} 1 ${child.owner} ${child.group} ${child.size} ${date} ${time} ${name}\n`;
        }

        // Add uploaded files in this directory
        const currentPath = normalizedPath === '/' ? '' : normalizedPath;
        for (const [path, file] of this.uploadedFiles.entries()) {
          const fileDir = path.substring(0, path.lastIndexOf('/'));
          if (fileDir === currentPath) {
            output += `-rw-r--r-- 1 user user ${file.size} ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().slice(0, 5)} ${file.name}\n`;
          }
        }

        return {
          success: true,
          content: output,
          isSimulated: true
        };
      }

      return {
        success: false,
        error: `Directory not found: ${dirPath}`,
        isSimulated: true
      };
    }
  }

  // Create a new file
  public async createFileContent(filePath: string, content: string): Promise<HybridFileSystemResult> {
    if (environmentDetector.canAccessLocalFiles()) {
      // Local environment - use real filesystem
      try {
        const result = await shellExecutor.safeExecuteCommand(`echo "${content.replace(/"/g, '\\"')}" > "${filePath}"`);
        return {
          success: result.success,
          content: result.stdout,
          error: result.stderr,
          isSimulated: false
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to create file',
          isSimulated: false
        };
      }
    } else {
      // Remote environment - add to virtual filesystem
      const normalizedPath = this.normalizePath(filePath);
      const pathParts = normalizedPath.split('/').filter(p => p !== '');
      const fileName = pathParts.pop();
      
      if (fileName) {
        const success = createFile(this.virtualFileSystem, pathParts, fileName, content);
        return {
          success,
          error: success ? undefined : 'Failed to create file in virtual filesystem',
          isSimulated: true
        };
      }

      return {
        success: false,
        error: 'Invalid file path',
        isSimulated: true
      };
    }
  }

  // Get uploaded files list
  public getUploadedFiles(): FileUpload[] {
    return Array.from(this.uploadedFiles.values());
  }

  // Clear uploaded files
  public clearUploadedFiles(): void {
    this.uploadedFiles.clear();
  }

  private normalizePath(path: string): string {
    if (path === '.' || path === '') return '/home/user';
    if (path.startsWith('./')) return `/home/user/${path.slice(2)}`;
    if (!path.startsWith('/')) return `/home/user/${path}`;
    return path;
  }
}

export const hybridFileSystem = new HybridFileSystem(); 