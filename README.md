# CodI - AI Coding Agent

An **Online Vibe Coding Agent** powered by AI, enabling autonomous code creation and real-time collaboration with GitHub repositories. CodI is a browser-based IDE with an intelligent chat interface that can autonomously create, update, and commit code directly to your GitHub repos.

## 🎯 Features

- **GitHub Integration**: Connect your repos via Personal Access Token, browse files, and explore code structure
- **AI-Powered Chat**: Real-time conversation with AI (Mistral-7B via Featherless API) for code assistance
- **Autonomous Code Creation**: AI can automatically create and update files in your repo via special syntax patterns
- **Code Editor**: View and edit files with syntax highlighting for 30+ languages
- **Auto-Commit**: Changes are automatically committed to GitHub with descriptive messages
- **Google AI Studio Design**: Minimal, professional interface with clean aesthetics
- **Real-time File Management**: File explorer with folder expansion and file selection

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- A GitHub Personal Access Token (with `repo` scope)
- Featherless API key (free tier available at https://featherless.ai)

### Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/Noaharz/CodI.git
   cd CodI
   npm install
   ```

2. **Environment Variables** (`.env.local`)
   ```
   VITE_FEATHERLESS_API_URL=https://api.featherless.ai/v1/messages
   VITE_FEATHERLESS_API_KEY=your_api_key_here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173`

4. **Login**
   - Paste your GitHub Personal Access Token
   - Select a repository to start coding

## 🤖 How to Use

### Chat with AI
- Type requests in the chat sidebar
- AI responds with code suggestions
- Current file context is automatically included

### Autonomous Code Creation
Instruct the AI to create files using patterns:

```
Create a new utility function file
```

AI responds with:
```
```create:src/utils/helpers.js
export function calculateSum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}
```
```

The file is **automatically created** in your GitHub repo with a commit!

### Edit Files
- Select files from the file explorer
- Edit code in the editor
- Press `Ctrl+S` (or `Cmd+S`) to save and commit

## 🏗️ Architecture

### Frontend Stack
- **React 19** with Vite
- **React Router** for navigation
- **CSS Modules** for scoped styling
- **Context API** for state management

### API Integration
- **GitHub API**: Repository browsing, file content, commits
- **Featherless API**: AI chat with Mistral-7B model
- **Custom Code Action Parser**: Detects and executes code creation patterns

### Key Components
- `Chat.jsx` - AI chat interface with message history
- `CodeEditor.jsx` - File editing with syntax highlighting
- `FileExplorer.jsx` - Repository file browser
- `Header.jsx` - Repo selector and user menu
- `Dashboard.jsx` - Main layout orchestrating all components

## 🔐 Security

- GitHub token input is manual (never auto-filled)
- Tokens stored in localStorage for session persistence
- API keys configured via environment variables
- No sensitive data in commits or logs

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel
```

Set environment variables in Vercel dashboard:
- `VITE_FEATHERLESS_API_URL`
- `VITE_FEATHERLESS_API_KEY`

## 📄 License

MIT

---

**Built for the AI Agent Olympics Hackathon** 🏆
