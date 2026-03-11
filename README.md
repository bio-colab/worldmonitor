# World Monitor (Bio-Colab Edition) 🌍

A high-performance monitoring platform powered by Vercel Edge Functions and Vanilla TypeScript. Optimized for local development on Windows environments.

## 🚀 Quick Start for Windows

### 1. Prerequisites

- **Node.js** (v18.x or 20.x)
- **Vercel CLI**: `npm i -g vercel`

### 2. Installation

To avoid common Windows file-locking (EPERM) issues, use the optimized setup command:

```cmd
npm run setup:win
```

### 3. Environment Setup

Copy the example environment file and fill in your keys:

```cmd
copy .env.example .env
```

### 4. Local Development

Start the frontend and 60+ Edge functions locally:

```cmd
npm run dev
```

## 🛠 Project Structure

- **/api**: TypeScript Edge Functions (Vercel Runtime).
- **/src**: Frontend logic and UI components.
- **/docs**: Technical documentation and architecture maps.

## 🛡 Privacy & Security

This repository has been sanitized. All personal developer information and contact details have been removed. Use environment variables (`.env`) for all sensitive configurations.

## 🤝 Contribution

Contributions are welcome via Pull Requests. Please ensure all new Edge functions follow the `runtime: 'edge'` configuration.
