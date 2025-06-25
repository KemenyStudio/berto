# Contributing to Berto Terminal

Thank you for your interest in contributing to Berto Terminal! We welcome contributions from everyone.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/kemenystudio/berto.git
   cd berto
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Add your OPENAI_API_KEY to .env.local
   ```

5. **Start the development server**:
   ```bash
   pnpm dev
   ```

## Development Guidelines

### Code Style
- We use TypeScript for type safety
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add comments for complex logic

### Commit Messages
- Use clear, descriptive commit messages
- Start with a verb in the present tense (e.g., "Add", "Fix", "Update")
- Keep the first line under 50 characters
- Add more details in the body if needed

### Testing
- Test your changes thoroughly in both local and deployed environments
- Ensure both natural language and traditional commands work
- Test on different devices/screen sizes

## Types of Contributions

### 🐛 Bug Reports
- Use the GitHub issue template
- Include steps to reproduce
- Provide screenshots if applicable
- Mention your environment (OS, browser, etc.)

### ✨ Feature Requests
- Check if the feature already exists or is planned
- Explain the use case and benefits
- Consider the scope and complexity

### 🔧 Code Contributions
- Start with smaller changes to get familiar with the codebase
- Create a new branch for your feature/fix:
  ```bash
  git checkout -b feature/your-feature-name
  ```
- Make your changes
- Test thoroughly
- Submit a pull request with a clear description

### 📖 Documentation
- Help improve the README, comments, or documentation
- Fix typos and grammar errors
- Add examples and clarifications

## Pull Request Process

1. **Create a descriptive PR title**
2. **Fill out the PR template** (if available)
3. **Link any relevant issues**
4. **Ensure your code passes all checks**
5. **Be responsive to feedback** during the review process

## Project Structure

```
berto/
├── app/                    # Next.js app router
│   ├── api/               # API routes (AI processing, command execution)
│   └── ...
├── src/                   # Source code
│   ├── components/        # React components (including terminal.tsx)
│   ├── services/          # Core services (AI, shell execution, filesystem)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities
│   ├── types/             # TypeScript definitions
│   ├── commands/          # Command definitions
│   └── styles/            # CSS styles
├── config/                # Configuration files
└── public/                # Static assets
```

## Key Areas for Contribution

- **AI Commands**: Improve natural language processing in `src/commands/`
- **Terminal Features**: Enhance the terminal experience in `src/components/terminal.tsx`
- **Shell Execution**: Improve command execution in `src/services/shell-executor.ts`
- **UI/UX**: Enhance the interface in `src/components/`
- **Documentation**: Improve guides and examples

## Questions?

- Open an issue for questions about contributing
- Join discussions in existing issues
- Check the README for general project information

Thank you for contributing to Berto Terminal! 🚀 