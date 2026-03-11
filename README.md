# World Monitor (Bio-Colab Edition) 🌍

A high-performance monitoring platform powered by Vercel Edge Functions and Vanilla TypeScript. Optimized for local development on Windows environments.

## ⬇️ Download

You can download prebuilt desktop binaries directly:

- **Windows (.exe)**: `https://worldmonitor.app/api/download?platform=windows-exe`
- **macOS (Apple Silicon)**: `https://worldmonitor.app/api/download?platform=macos-arm64`
- **macOS (Intel)**: `https://worldmonitor.app/api/download?platform=macos-x64`
- **Linux (AppImage)**: `https://worldmonitor.app/api/download?platform=linux-appimage`

If you prefer browser usage, open: `https://worldmonitor.app`.

## 🚀 Installation & Run (Windows-first)

### 1. Prerequisites

- **Node.js** (v18.x or 20.x)
- **npm** (comes with Node)
- **Vercel CLI**: `npm i -g vercel`

### 2. Clone the repository

```cmd
git clone https://github.com/bio-colab/worldmonitor.git
cd worldmonitor
```

### 3. Install dependencies

To avoid common Windows file-locking (`EPERM`) issues, use:

```cmd
npm run setup:win
```

Alternative (standard install):

```cmd
npm install
```

### 4. Environment setup

Copy the environment template and fill required keys:

```cmd
copy .env.example .env
```

### 5. Run locally

Start frontend + edge functions locally:

```cmd
npm run dev
```

Optional frontend-only mode (Vite):

```cmd
npm run dev:vite
```

## 🛠 Project Structure

- **/api**: TypeScript Edge Functions (Vercel Runtime).
- **/src**: Frontend logic and UI components.
- **/docs**: Technical documentation and architecture maps.

## 🛡 Privacy & Security

This repository has been sanitized. All personal developer information and contact details have been removed. Use environment variables (`.env`) for all sensitive configurations.

## 🤝 Contribution

Contributions are welcome via Pull Requests. Please ensure all new Edge functions follow the `runtime: 'edge'` configuration.
