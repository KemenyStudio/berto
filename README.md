# 🤖 Berto Terminal

> **AI-powered terminal that speaks human**

A revolutionary terminal experience where you can type commands OR ask in natural language. Berto is your AI assistant that understands both traditional shell commands and conversational requests.

---

## ✨ Key Features

- 🧠 **AI-Powered**: Ask naturally - "show me files", "create a folder", "help me find something"
- ⚡ **Real Commands**: Execute actual shell commands on your machine (local) or simulated environment (remote)
- 🌐 **Hybrid Mode**: Works seamlessly both locally and on remote deployments (Vercel)
- 🎨 **Beautiful UI**: Modern, responsive terminal interface with proper theming
- 📱 **Mobile Friendly**: Optimized touch experience for mobile devices
- 🔍 **Smart Context**: AI understands your current directory and available files
- 🎯 **Inline Input**: Clean, authentic terminal feel with proper prompt alignment

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/kemenystudio/berto.git
cd berto

# Install dependencies (use pnpm for best results)
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your OPENAI_API_KEY to .env.local

# Start development server
pnpm dev
```

### Environment Variables

Create a `.env.local` file with:

```env
OPENAI_API_KEY=your-openai-api-key-here
```

---

## 💬 How to Use Berto

### Natural Language Commands
Ask Berto anything in plain English:

- **"show me the files in this folder"** → runs `ls`
- **"create a project folder and call it 'bananas'"** → runs `mkdir bananas`
- **"help me find all text files"** → runs `find . -name "*.txt"`
- **"what's in my home directory?"** → runs `ls ~`

### Traditional Commands
All standard shell commands work perfectly:

```bash
ls -la                    # List files with details
cat filename.txt          # Read file contents
mkdir new-folder          # Create directory
cd Documents              # Change directory
pwd                       # Show current directory
grep "text" *.txt         # Search in files
```

### Special Commands
Try these built-in commands:

- **`help`** - See all available commands and tips
- **`hack`** - Start an immersive AI-powered cyber hacker challenge
- **`clear`** - Clear the terminal screen

### 🎮 Hack Challenge
Experience Berto's interactive cyber security challenge:

```bash
hack                      # Start the challenge
cd intel                  # Navigate to intel directory  
cat CODE_1.dat           # Find your first access code
cat ../matrix.dat        # Decode the matrix for CODE_2
cd ../vault              # Enter the final vault challenge
```

**Features:**
- 🕵️ **Immersive Story**: Realistic hacker scenario with classified files
- 🔐 **Progressive Puzzles**: Find 3 access codes through different challenges
- 🧭 **Full Navigation**: Complete `cd` support for directory exploration
- 🤖 **AI-Generated Content**: Dynamic hints and responses
- 🎯 **Educational**: Learn real terminal commands while playing

---

## 🏗️ Architecture

### Local Mode (Development)
- 🖥️ **Native Performance**: Direct access to your local filesystem
- ⚡ **Real Commands**: Execute actual shell commands on your machine
- 🔄 **Instant Feedback**: No network delays, immediate responses

### Remote Mode (Vercel Deployment)  
- 🌐 **Simulated Environment**: Virtual filesystem for safe command execution
- 🤖 **AI-Enhanced**: Intelligent command interpretation and responses
- 🛡️ **Secure**: Sandboxed environment prevents system access

### AI Integration
- **GPT-4 Powered**: Natural language understanding and command generation
- **Context Aware**: Understands your current directory and available files
- **Smart Suggestions**: Provides helpful tips and alternative commands

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key
3. **Deploy** - Vercel will automatically build and deploy

The project is configured with:
- ✅ `vercel.json` with proper pnpm configuration
- ✅ Optimized build settings
- ✅ API routes with appropriate timeouts
- ✅ Edge runtime compatibility

### Other Platforms

For other deployment platforms, ensure:
- Node.js 18+ runtime
- Environment variables are set
- Build command: `pnpm build`
- Start command: `pnpm start`

---

## 🛠️ Development

### Project Structure

```
berto/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── ai/            # AI command processing
│   │   └── execute/       # Command execution
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── ui/           # Shadcn/ui components
│   │   └── terminal.tsx  # Main terminal component
│   ├── services/         # Core services
│   │   ├── ai-interpreter.ts
│   │   ├── shell-executor.ts
│   │   ├── hybrid-filesystem.ts
│   │   └── environment-detector.ts
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities
│   ├── types/            # TypeScript definitions
│   ├── commands/         # Command definitions
│   └── styles/           # CSS styles
├── config/               # Configuration files
├── public/               # Static assets
└── [config files]       # Next.js, TypeScript, etc.
```

### Key Services

- **AI Interpreter**: Processes natural language and converts to commands
- **Shell Executor**: Executes commands safely in both environments
- **Hybrid Filesystem**: Manages files in local/remote contexts
- **Environment Detector**: Determines runtime environment

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **AI**: OpenAI GPT-4, Vercel AI SDK
- **Icons**: Lucide React
- **Package Manager**: pnpm (recommended)

---

## 🎯 Roadmap

- [ ] **File Operations**: Enhanced file manipulation commands
- [ ] **Git Integration**: Direct git command support
- [ ] **Theme Customization**: Multiple terminal themes
- [ ] **Command History**: Persistent command history
- [ ] **Tab Completion**: Smart command completion
- [ ] **Session Management**: Multiple terminal sessions

---

## 📈 Recent Updates

### v1.2.0 - Enhanced Hack Challenge (December 2024)
- ✅ **Full Directory Navigation**: Fixed `cd` command support in remote/simulated environments
- 🕵️ **Intel Directory**: Added interactive intel files with mission briefings and classified documents
- 🔐 **Progressive Puzzle System**: Complete 3-stage access code discovery
- 🎯 **Improved UX**: Better error handling and helpful guidance for players
- 🤖 **AI Integration**: Dynamic content generation for hints and responses

### Previous Releases
- **v1.1.0**: Added natural language processing and AI command interpretation
- **v1.0.0**: Initial release with basic terminal functionality

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with Next.js, React, and OpenAI
- UI components powered by Radix UI and Tailwind CSS
- Terminal experience inspired by modern CLI tools

---

**Made with 🤖 by Kemeny Studio** • [Website](https://kemeny.studio) • [Contact](hello@kemeny.studio) 