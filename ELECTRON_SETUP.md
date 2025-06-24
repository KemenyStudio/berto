# Berto AI Terminal - Electron App Setup

## Overview
Berto is now wrapped as an Electron desktop application with automatic builds and downloads.

## Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Mode
```bash
# Start Next.js development server
npm run dev

# In another terminal, start Electron in development mode
npm run electron-dev
```

### 3. Build for Production
```bash
# Build the web app for Electron
ELECTRON_BUILD=true npm run build

# Build Electron distributables
npm run build-electron

# Build for specific platforms
npm run build-electron -- --mac    # macOS
npm run build-electron -- --win    # Windows
npm run build-electron -- --linux  # Linux
```

## Deployment

### Vercel Configuration
- The web app is deployed to Vercel with API routes for OpenAI integration
- Environment variable `OPENAI_API_KEY` must be set in Vercel dashboard
- Download links point to LFS-stored binaries

### GitHub Actions
- Automatically builds Electron apps on push to main branch
- Uploads binaries to Git LFS
- Creates releases on version tags

### Git LFS Setup
```bash
# Initialize LFS for the repository
git lfs install

# Track Electron binaries
git lfs track "public/downloads/*.exe"
git lfs track "public/downloads/*.dmg"  
git lfs track "public/downloads/*.AppImage"

# Commit the tracking configuration
git add .gitattributes
git commit -m "Add LFS tracking for Electron binaries"
```

## Features

### Web Version
- Responsive design with mobile fallback
- Navigation with OS-specific download detection
- Real-time terminal with AI assistance

### Desktop Version
- Native window controls
- Offline capability (once loaded)
- System integration
- Auto-updater ready (requires configuration)

## Manual Release Process

1. Update version in `package.json`
2. Create a git tag: `git tag v1.0.0`
3. Push tag: `git push origin v1.0.0`
4. GitHub Actions will automatically build and create a release 