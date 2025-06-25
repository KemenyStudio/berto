export interface FileSystemNode {
  name: string
  type: "file" | "directory"
  content?: string
  permissions: string
  owner: string
  group: string
  size: number
  modified: Date
  children?: { [key: string]: FileSystemNode }
}

export interface TerminalState {
  currentPath: string[]
  fileSystem: FileSystemNode
  environment: { [key: string]: string }
  user: string
  hostname: string
  processes: Process[]
}

export interface Process {
  pid: number
  name: string
  status: "running" | "stopped" | "zombie"
  cpu: number
  memory: number
}

export interface TerminalLine {
  type: "command" | "output" | "error" | "info"
  content: string
  timestamp: Date
}
