# 🤖 Berto - Vibe Terminal

**Terminal for humans. No commands, just vibes.**

Berto is an AI-powered terminal assistant that makes the command line accessible to everyone. Instead of memorizing complex commands, just tell Berto what you want to do in plain English, and it will generate the proper terminal commands for you.

![Berto Terminal Interface](https://via.placeholder.com/800x400/1a1a1a/00ff00?text=Berto+AI+Terminal)

## ✨ Features

- 🧠 **Natural Language Processing**: Just tell Berto what you want to do
- 🔧 **Command Generation**: Get proper terminal commands you can copy and use
- 📚 **Educational**: Learn terminal commands with clear explanations
- 🎯 **Beginner Friendly**: No need to memorize command syntax
- 🚀 **Multi-step Operations**: Break down complex tasks into simple steps
- 💡 **Smart Suggestions**: Get helpful command recommendations
- 🌙 **Beautiful Dark Theme**: [Cursor IDE-inspired color palette][[memory:8490515909716920229]]

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- OpenAI API key (get one at [platform.openai.com](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd berto-ai-terminal
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up your OpenAI API key**
   ```bash
   # Copy the environment template
   cp .env.local.example .env.local
   
   # Edit .env.local and add your OpenAI API key
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Go to [http://localhost:3000](http://localhost:3000)

## 🖥️ Electron Desktop App

Build a standalone desktop version that only relies on your OpenAI API key:

```bash
# Build the static web app and package Electron
pnpm run build-electron

# macOS example output is in the `dist` folder
open dist
```

Run the resulting `.dmg` on macOS or share it with others. The app works
offline and communicates only with OpenAI for AI features.

## 🎯 How to Use Berto

### Natural Language Commands

Instead of memorizing terminal syntax, just tell Berto what you want to do:

- **"show me the files in this folder"** → `ls -la`
- **"make a new folder called projects"** → `mkdir projects`
- **"create a readme file with welcome message"** → `echo 'Welcome!' > README.md`
- **"help me find all the python files"** → `find . -name '*.py' -type f`
- **"I want to see what's in that file"** → `cat filename.txt`

### Traditional Commands

Berto also supports all standard terminal commands:
- `ls` - List files and directories
- `cd` - Change directory
- `pwd` - Show current directory
- `cat` - Display file contents
- `mkdir` - Create directories
- `touch` - Create files
- `rm` - Delete files/directories
- `echo` - Display text or write to files

### Special Berto Commands

- **`help`** - Show comprehensive help and examples
- **`vibe`** - Display Berto's status and capabilities
- **`explain [command]`** - Get detailed explanation of any command
- **`suggest [context]`** - Get command suggestions based on context

## 🛠️ Technical Details

### Built With

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenAI GPT-4.1** - Latest AI language model with advanced reasoning
- **Radix UI** - Accessible components

### Architecture

- **Frontend**: React-based terminal interface with real-time interaction
- **Backend**: Next.js API routes handling OpenAI integration
- **AI Service**: GPT-4 Turbo for natural language interpretation
- **File System**: Simulated file system for educational purposes

### API Integration

Berto uses OpenAI's GPT-4.1 model with enhanced reasoning capabilities and carefully crafted prompts to:
- Interpret natural language requests with advanced understanding
- Generate appropriate terminal commands with high accuracy
- Provide educational explanations with improved clarity
- Suggest relevant commands based on context and user intent

## 📖 Learning with Berto

### For Beginners

1. **Start with natural language**: Don't worry about command syntax
2. **Use the `explain` command**: Learn what each command does
3. **Copy commands**: Use Berto's output in your real terminal
4. **Try `suggest`**: Get helpful command recommendations
5. **Practice gradually**: Mix natural language with direct commands

### Educational Features

- **Clear explanations**: Every command comes with a plain English explanation
- **Step-by-step breakdown**: Complex tasks are broken into simple steps
- **Copy-paste ready**: All commands work in real terminals
- **Context-aware**: Suggestions based on your current situation

## 🎨 Customization

### Themes

Berto uses a [dark theme inspired by Cursor IDE's color palette][[memory:8490515909716920229]] with:
- Matrix-green terminal text
- Cyan for information
- Red for errors
- Yellow for warnings

### Configuration

You can customize Berto by modifying:
- `app/api/ai/route.ts` - AI prompts and behavior
- `terminal.tsx` - Terminal interface and styling
- `commands/index.ts` - Available commands and responses

## 🔧 Development

### Project Structure

```
berto-ai-terminal/
├── app/
│   ├── api/ai/route.ts          # OpenAI integration
│   ├── layout.tsx               # App layout
│   └── page.tsx                 # Main page
├── commands/
│   ├── index.ts                 # Command definitions
│   └── ai-commands.ts           # AI-specific commands
├── components/ui/               # Reusable UI components
├── hooks/
│   └── useTerminalState.ts      # Terminal state management
├── services/
│   └── ai-interpreter.ts        # AI service layer
├── types/
│   └── filesystem.ts            # Type definitions
├── utils/
│   └── filesystem.ts            # File system utilities
└── terminal.tsx                 # Main terminal component
```

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add your `OPENAI_API_KEY` environment variable
4. Deploy!

### Other Platforms

Berto works on any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- Docker

## 📝 Environment Variables

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional (with defaults)
NODE_ENV=development
```

## 🤝 Support

- **Documentation**: This README and inline help
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Email**: [Your contact email]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** - For the incredible GPT-4 Turbo model
- **Vercel** - For the amazing Next.js framework
- **The Terminal Community** - For inspiration and feedback

---

**Ready to vibe with some terminal magic? Start Berto and let's go! 🚀**

*"Making the terminal accessible to everyone, from beginners to pros."* 