import type { FileSystemNode } from "../types/filesystem"

export const createInitialFileSystem = (): FileSystemNode => ({
  name: "/",
  type: "directory",
  permissions: "drwxr-xr-x",
  owner: "root",
  group: "root",
  size: 4096,
  modified: new Date(),
  children: {
    home: {
      name: "home",
      type: "directory",
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      size: 4096,
      modified: new Date(),
      children: {
        user: {
          name: "user",
          type: "directory",
          permissions: "drwxr-xr-x",
          owner: "user",
          group: "user",
          size: 4096,
          modified: new Date(),
          children: {
            "welcome.txt": {
              name: "welcome.txt",
              type: "file",
              permissions: "-rw-r--r--",
              owner: "user",
              group: "user",
              size: 156,
              modified: new Date(),
              content:
                "Welcome to Vibe Terminal!\n\nThis is a fully interactive AI-powered terminal.\nJust tell me what you want to do in natural language!\n\nTry saying things like:\n- 'list all files'\n- 'make a new folder'\n- 'show me what's in this file'\n\nHave fun exploring! ✨",
            },
            documents: {
              name: "documents",
              type: "directory",
              permissions: "drwxr-xr-x",
              owner: "user",
              group: "user",
              size: 4096,
              modified: new Date(),
              children: {
                "notes.md": {
                  name: "notes.md",
                  type: "file",
                  permissions: "-rw-r--r--",
                  owner: "user",
                  group: "user",
                  size: 45,
                  modified: new Date(),
                  content:
                    "# My Notes\n\n- Learn natural language commands\n- Build awesome projects with Vibe Terminal\n- No more memorizing command syntax! 🎉",
                },
              },
            },
          },
        },
      },
    },
    etc: {
      name: "etc",
      type: "directory",
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      size: 4096,
      modified: new Date(),
      children: {
        passwd: {
          name: "passwd",
          type: "file",
          permissions: "-rw-r--r--",
          owner: "root",
          group: "root",
          size: 89,
          modified: new Date(),
          content: "root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:User:/home/user:/bin/bash",
        },
      },
    },
    tmp: {
      name: "tmp",
      type: "directory",
      permissions: "drwxrwxrwt",
      owner: "root",
      group: "root",
      size: 4096,
      modified: new Date(),
      children: {},
    },
  },
})

export const resolvePath = (currentPath: string[], targetPath: string): string[] => {
  if (targetPath.startsWith("/")) {
    // Absolute path
    return targetPath.split("/").filter((p) => p !== "")
  } else {
    // Relative path
    const newPath = [...currentPath]
    const parts = targetPath.split("/").filter((p) => p !== "")

    for (const part of parts) {
      if (part === "..") {
        if (newPath.length > 0) {
          newPath.pop()
        }
      } else if (part !== ".") {
        newPath.push(part)
      }
    }

    return newPath
  }
}

export const getNodeAtPath = (fileSystem: FileSystemNode, path: string[]): FileSystemNode | null => {
  let current = fileSystem

  for (const segment of path) {
    if (!current.children || !current.children[segment]) {
      return null
    }
    current = current.children[segment]
  }

  return current
}

export const formatPermissions = (permissions: string): string => {
  return permissions
}

export const formatSize = (size: number): string => {
  if (size < 1024) return `${size}B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)}K`
  if (size < 1024 * 1024 * 1024) return `${Math.round(size / (1024 * 1024))}M`
  return `${Math.round(size / (1024 * 1024 * 1024))}G`
}

export const createFile = (fileSystem: FileSystemNode, path: string[], name: string, content = ""): boolean => {
  const parentNode = getNodeAtPath(fileSystem, path)
  if (!parentNode || parentNode.type !== "directory" || !parentNode.children) {
    return false
  }

  // If file exists, update it. Otherwise, create it.
  const existingFile = parentNode.children[name]
  if (existingFile && existingFile.type === "file") {
    existingFile.content = content
    existingFile.size = content.length
    existingFile.modified = new Date()
  } else if (existingFile && existingFile.type === "directory") {
    return false // Cannot overwrite a directory with a file
  } else {
    parentNode.children[name] = {
      name,
      type: "file",
      permissions: "-rw-r--r--",
      owner: "user",
      group: "user",
      size: content.length,
      modified: new Date(),
      content,
    }
  }

  return true
}

export const createDirectory = (fileSystem: FileSystemNode, path: string[], name: string): boolean => {
  const parentNode = getNodeAtPath(fileSystem, path)
  if (!parentNode || parentNode.type !== "directory" || !parentNode.children) {
    return false
  }

  parentNode.children[name] = {
    name,
    type: "directory",
    permissions: "drwxr-xr-x",
    owner: "user",
    group: "user",
    size: 4096,
    modified: new Date(),
    children: {},
  }

  return true
}

export const deleteNode = (fileSystem: FileSystemNode, path: string[], name: string): boolean => {
  const parentNode = getNodeAtPath(fileSystem, path)
  if (!parentNode || parentNode.type !== "directory" || !parentNode.children) {
    return false
  }

  if (parentNode.children[name]) {
    delete parentNode.children[name]
    return true
  }

  return false
}
