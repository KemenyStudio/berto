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
              size: 256,
              modified: new Date(),
              content:
                "🤖 Welcome to Berto's Vibe Terminal!\n\nAI-powered terminal that speaks human!\nJust tell me what you want to do!\n\nQuick starts:\n• 'ls' - list files\n• 'hack' - start the game!\n• 'joke' - hear a joke\n• 'fortune' - get a fortune\n\n🕵️ Secret: try 'ls -la' to see hidden files!\n\nHave fun! Surprises await... ✨",
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
                  size: 145,
                  modified: new Date(),
                  content:
                    "# My Notes\n\n- Learn natural language commands\n- Build awesome projects with Berto\n- No more memorizing command syntax! 🎉\n- Found some weird directories... 🤔\n- Need to investigate further...",
                },
                "diary.txt": {
                  name: "diary.txt",
                  type: "file",
                  permissions: "-rw-------",
                  owner: "user",
                  group: "user",
                  size: 234,
                  modified: new Date(),
                  content:
                    "Dear Diary,\n\nToday I discovered this amazing terminal called Berto.\nI think there might be hidden games somewhere...\nI heard rumors about a hacker challenge in a secret directory.\n\nThe system admin mentioned something about '/var/games'...\nBut when I check, it's not there. Very suspicious! 🕵️\n\n- User",
                },
              },
            },
            ".bashrc": {
              name: ".bashrc",
              type: "file",
              permissions: "-rw-r--r--",
              owner: "user",
              group: "user",
              size: 89,
              modified: new Date(),
              content: "# User's bashrc\nalias ll='ls -la'\nalias hack='cd /var/games && ./start_hack.sh'\necho 'Type hack to begin the adventure...'\n",
            },
            ".secret": {
              name: ".secret",
              type: "file",
              permissions: "-rw-------",
              owner: "user",
              group: "user",
              size: 67,
              modified: new Date(),
              content: "🔐 Ultra secret note:\nThe password to the vault is: C0D3R5_0NLY\nBut which vault? 🤔",
            },
          },
        },
      },
    },
    var: {
      name: "var",
      type: "directory",
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      size: 4096,
      modified: new Date(),
      children: {
        games: {
          name: "games",
          type: "directory",
          permissions: "drwxr-xr-x",
          owner: "games",
          group: "games",
          size: 4096,
          modified: new Date(),
          children: {
            "start_hack.sh": {
              name: "start_hack.sh",
              type: "file",
              permissions: "-rwxr-xr-x",
              owner: "games",
              group: "games",
              size: 512,
              modified: new Date(),
              content:
                "#!/bin/bash\n\n🎮 WELCOME TO CYBER HACK CHALLENGE 🎮\n\n======================================\n    UNAUTHORIZED ACCESS DETECTED\n======================================\n\nYou've stumbled into the mainframe...\n\nMISSION: Find the 3 hidden access codes\n1. Check the 'intel' directory\n2. Decode the matrix file  \n3. Crack the vault\n\nType 'cat README_HACK' for instructions!\n\nGood luck, hacker! 😎",
            },
            "README_HACK": {
              name: "README_HACK",
              type: "file",
              permissions: "-rw-r--r--",
              owner: "games",
              group: "games",
              size: 445,
              modified: new Date(),
              content:
                "🕵️ HACKER CHALLENGE INSTRUCTIONS\n\n1. INTEL GATHERING:\n   - Navigate to 'intel' directory\n   - Read all intelligence files\n   - Find CODE_1\n\n2. MATRIX DECODING:\n   - Check 'matrix.dat' file\n   - Decode the pattern to find CODE_2\n\n3. VAULT CRACKING:\n   - Enter the vault with the secret password\n   - Complete the puzzle for CODE_3\n\nOnce you have all 3 codes, check 'victory.txt'!\n\n💡 HINTS:\n- Use 'ls -la' to see hidden files\n- Some files need special commands\n- The password was mentioned somewhere...",
            },
            intel: {
              name: "intel",
              type: "directory",
              permissions: "drwxr-xr-x",
              owner: "games",
              group: "games",
              size: 4096,
              modified: new Date(),
              children: {
                "mission1.txt": {
                  name: "mission1.txt",
                  type: "file",
                  permissions: "-rw-r--r--",
                  owner: "games",
                  group: "games",
                  size: 187,
                  modified: new Date(),
                  content:
                    "📋 CLASSIFIED INTEL - MISSION 1\n\nAgent 007 reporting:\nInfiltration successful. Found evidence of...\n\n[REDACTED]\n\nCODE_1: ALPHA_SEVEN_NINE\n\n🔒 This intelligence is classified.\nProceed to next phase immediately.",
                },
                "security_log.txt": {
                  name: "security_log.txt",
                  type: "file",
                  permissions: "-rw-r--r--",
                  owner: "games",
                  group: "games",
                  size: 234,
                  modified: new Date(),
                  content:
                    "🚨 SECURITY BREACH LOG\n\n2024-01-15 23:42:01 - Unauthorized access attempt\n2024-01-15 23:42:15 - Firewall bypassed\n2024-01-15 23:42:33 - Someone's getting close...\n2024-01-15 23:42:45 - They're in the system!\n\n⚠️  WARNING: Hacker still active in network",
                },
                ".classified": {
                  name: ".classified",
                  type: "file",
                  permissions: "-rw-------",
                  owner: "games",
                  group: "games",
                  size: 123,
                  modified: new Date(),
                  content: "🕵️ TOP SECRET CLASSIFIED DATA\n\nProject Codename: VIBE_TERMINAL\nStatus: ACTIVE\nAgent: Berto\nMission: Make terminals fun again!\n\n😄",
                },
              },
            },
            "matrix.dat": {
              name: "matrix.dat",
              type: "file",
              permissions: "-rw-r--r--",
              owner: "games",
              group: "games",
              size: 334,
              modified: new Date(),
              content:
                "🔢 MATRIX DECODING CHALLENGE\n\n01000010 01000101 01010100 01000001\n01011000 01011001 01011010 01000101 \n01000101 01001001 01000111 01001000\n01010100 01011111 01000110 01001111\n01010101 01010010 01000101 01011000\n\n💡 HINT: This is binary code!\n💡 Each group of 8 bits = 1 letter\n💡 Convert to ASCII to reveal CODE_2\n\n🔍 Answer format: CODE_2: [YOUR_DECODED_MESSAGE]",
            },
            vault: {
              name: "vault",
              type: "directory",
              permissions: "drwx------",
              owner: "games",
              group: "games",
              size: 4096,
              modified: new Date(),
              children: {
                "access.txt": {
                  name: "access.txt",
                  type: "file",
                  permissions: "-rw-------",
                  owner: "games",
                  group: "games",
                  size: 267,
                  modified: new Date(),
                  content:
                    "🔐 VAULT ACCESS GRANTED\n\nWelcome, authorized user!\n\nYou've successfully entered the vault using password: C0D3R5_0NLY\n\nFINAL CHALLENGE:\nSolve this riddle for CODE_3:\n\n'I am not alive, but I grow;\nI don't have lungs, but I need air;\nI don't have a mouth, but water kills me.\nWhat am I?'\n\nAnswer: ____",
                },
                "treasure.txt": {
                  name: "treasure.txt",
                  type: "file",
                  permissions: "-rw-r--r--",
                  owner: "games",
                  group: "games",
                  size: 145,
                  modified: new Date(),
                  content: "💎 VAULT TREASURE\n\nCongratulations! You found the treasure!\n\n🏆 CODE_3: FIRE_MASTER\n\n(The answer to the riddle was 'fire')\n\nNow you have all 3 codes. Check victory.txt!",
                },
              },
            },
            "victory.txt": {
              name: "victory.txt",
              type: "file",
              permissions: "-rw-r--r--",
              owner: "games",
              group: "games",
              size: 445,
              modified: new Date(),
              content:
                "🎉 CONGRATULATIONS HACKER! 🎉\n\nYou've successfully completed the Cyber Hack Challenge!\n\n✅ CODE_1: ALPHA_SEVEN_NINE (from intel)\n✅ CODE_2: BETAXYZE EIGHTFOUREX (from matrix)\n✅ CODE_3: FIRE_MASTER (from vault)\n\n🏆 ACHIEVEMENT UNLOCKED: Master Hacker\n\nYou've proven yourself worthy!\nWelcome to the elite hackers club! 😎\n\n🎮 Want more challenges? Check out /opt/retro for classic games!\n\nThank you for playing!\n- The Berto Game Master",
            },
          },
        },
      },
    },
    opt: {
      name: "opt",
      type: "directory",
      permissions: "drwxr-xr-x",
      owner: "root",
      group: "root",
      size: 4096,
      modified: new Date(),
      children: {
        retro: {
          name: "retro",
          type: "directory",
          permissions: "drwxr-xr-x",
          owner: "games",
          group: "games",
          size: 4096,
          modified: new Date(),
          children: {
            "ascii_art.txt": {
              name: "ascii_art.txt",
              type: "file",
              permissions: "-rw-r--r--",
              owner: "games",
              group: "games",
              size: 567,
              modified: new Date(),
              content:
                "🎨 RETRO ASCII ART COLLECTION\n\n" +
                "    ____            __      \n" +
                "   / __ )___  _____/ /_____  \n" +
                "  / __  / _ \\/ ___/ __/ __ \\ \n" +
                " / /_/ /  __/ /  / /_/ /_/ / \n" +
                "/_____/\\___/_/   \\__/\\____/  \n" +
                "\n" +
                "🕹️  RETRO COMPUTER VIBES  🕹️\n\n" +
                "   [###]     {o,o}    \n" +
                "   |---|     \\ _ /    \n" +
                "   |[O]|      ) (     \n" +
                "   |---|     _|_|_    \n" +
                "   |___|    /\\_|_/\\   \n\n" +
                "Welcome to the retro zone! 🚀",
            },
            "jokes.txt": {
              name: "jokes.txt",
              type: "file",
              permissions: "-rw-r--r--",
              owner: "games",
              group: "games",
              size: 456,
              modified: new Date(),
              content:
                "😂 PROGRAMMER JOKES COLLECTION\n\n" +
                "1. Why do programmers prefer dark mode?\n   Because light attracts bugs! 🐛\n\n" +
                "2. How many programmers does it take to change a light bulb?\n   None. That's a hardware problem! 💡\n\n" +
                "3. Why did the programmer quit his job?\n   He didn't get arrays! 📊\n\n" +
                "4. What's a programmer's favorite hangout place?\n   Foo Bar! 🍺\n\n" +
                "5. Why do Java developers wear glasses?\n   Because they can't C#! 👓",
            },
            "fortune.txt": {
              name: "fortune.txt",
              type: "file",
              permissions: "-rw-r--r--",
              owner: "games",
              group: "games",
              size: 234,
              modified: new Date(),
              content:
                "🔮 YOUR FORTUNE TODAY\n\n" +
                "The code you write today will compile on the first try.\n" +
                "A bug you've been hunting will reveal itself before lunch.\n" +
                "Your pull request will be approved without any comments.\n" +
                "You will discover a new easter egg in your favorite app.\n\n" +
                "Lucky numbers: 42, 1337, 404, 200\n" +
                "Lucky color: Terminal Green 💚",
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
          size: 189,
          modified: new Date(),
          content: "root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:User:/home/user:/bin/bash\ngames:x:1001:1001:Game Master:/var/games:/bin/bash\nhacker:x:1337:1337:Elite Hacker:/opt/hacker:/bin/zsh",
        },
        "motd": {
          name: "motd",
          type: "file",
          permissions: "-rw-r--r--",
          owner: "root",
          group: "root",
          size: 234,
          modified: new Date(),
          content:
            "🌟 Welcome to Berto's Virtual System! 🌟\n\n" +
            "  ██████╗ ███████╗██████╗ ████████╗ ██████╗ \n" +
            "  ██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔═══██╗\n" +
            "  ██████╔╝█████╗  ██████╔╝   ██║   ██║   ██║\n" +
            "  ██╔══██╗██╔══╝  ██╔══██╗   ██║   ██║   ██║\n" +
            "  ██████╔╝███████╗██║  ██║   ██║   ╚██████╔╝\n" +
            "  ╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ \n\n" +
            "🎮 Hidden games and secrets await!\n" +
            "🕵️ Type 'hack' to start your adventure!",
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
      children: {
        ".mystery": {
          name: ".mystery",
          type: "file",
          permissions: "-rw-rw-rw-",
          owner: "user",
          group: "user",
          size: 123,
          modified: new Date(),
          content: "🔍 MYSTERY FILE\n\nThis file appears and disappears randomly...\nYou found it at the right time!\n\n🎁 Secret: The real treasure was the commands we learned along the way! 💝",
        },
      },
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
