# CodI - Autonomous AI Coding Agent Setup

Eine React-App mit GitHub-Integration und autonomer Code-Erstellung via Mistral-7B (Featherless API).

## Features

✅ GitHub Repo Browsing (Token-basiert)  
✅ AI-powered Autonomous Code Creation  
✅ Real-time File Editing & Commits  
✅ Mistral-7B Code Generation  
✅ Clean, Minimal UI (Google AI Studio Design)  

## Prerequisites

- Node.js 16+
- npm oder yarn
- GitHub Personal Access Token (mit `repo` scope)
- Featherless API account (free tier available)

## Setup Steps

### 1. GitHub Personal Access Token erstellen

1. Gehe zu https://github.com/settings/tokens
2. Klick "Generate new token"
3. Wähle Scopes: `repo` (full control of repos)
4. Kopiere den Token - du brauchst ihn später

### 2. Featherless API einrichten

1. Gehe zu https://featherless.ai und erstelle Account
2. Generiere API Key
3. Notiere dir die API URL: `https://api.featherless.ai/v1/messages`

### 3. Environment Variables

Erstelle `.env.local` im Root-Verzeichnis:

```bash
VITE_FEATHERLESS_API_URL=https://api.featherless.ai/v1/messages
VITE_FEATHERLESS_API_KEY=your-featherless-api-key
```

### 4. Dependencies installieren & starten

```bash
npm install
npm run dev
```

App lädt unter `http://localhost:5173`

## Verwendung

1. Öffne die App auf `http://localhost:5173`
2. Paste dein GitHub Personal Access Token
3. Wähle ein Repository
4. Chatte mit dem AI-Agent - schreib Anforderungen
5. Der Agent erstellt/editiert Code autonom
6. Changes werden automatisch committed

## Troubleshooting

**"Featherless API credentials not configured"**
- Überprüfe `.env.local` oder Vercel ENV-Variables
- Stelle sicher `VITE_FEATHERLESS_API_KEY` gesetzt ist

**"GitHub API error"**
- Prüfe ob dein GitHub Token gültig ist
- Token brauchst `repo` scope

## Dateistruktur

```
src/
├── api/
│   ├── github.js          # GitHub API Wrapper
│   └── featherless.js     # Featherless API Wrapper
├── components/
│   ├── RepoList.jsx       # Repo Listing
│   ├── CodeReview.jsx     # Code Review Handler
│   ├── TerminalOutput.jsx # Terminal UI
│   └── *.module.css       # Component Styles
├── contexts/
│   └── AuthContext.jsx    # Auth Management
├── pages/
│   ├── Login.jsx          # Login Page
│   ├── AuthCallback.jsx   # OAuth Callback
│   ├── Dashboard.jsx      # Main Dashboard
│   └── *.module.css       # Page Styles
├── App.jsx                # Router Setup
├── main.jsx               # Entry Point
└── index.css              # Global Styles
```

## API Integration

### GitHub API
- Fetcht User Repos mit `GET /user/repos`
- Fetcht Repo Contents mit `GET /repos/{owner}/{repo}/contents`
- Fetcht File Content mit `GET /repos/{owner}/{repo}/contents/{path}`

### Featherless API
- Sendet Code zum Review an `/v1/messages`
- Model: `claude-opus`
- Max Tokens: 2048

## Security Notes

- GitHub Token wird in Supabase Session gespeichert (secure)
- Featherless API Key sollte in `.env.local` gespeichert sein (nicht committen!)
- Token wird nicht in localStorage gespeichert

## Deployment

Production-Ready nach:
1. Environment Variables konfigurieren
2. `.env.local` zu `.env.production` migrieren
3. `npm run build`
4. Deploy auf Vercel/Netlify mit ENV-Secrets

## License

MIT
