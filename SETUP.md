# GitHub Code Reviewer - Setup Guide

Eine React-App mit GitHub OAuth, Repo-Browsing und AI-gestütztem Code Review via Featherless API.

## Features

✅ GitHub OAuth Login via Supabase  
✅ Browse public & private repositories  
✅ AI-powered code review mit Featherless API  
✅ Terminal-style output (dark theme)  
✅ Real-time code analysis  

## Prerequisites

- Node.js 16+
- npm oder yarn
- GitHub account
- Supabase account
- Featherless API account

## Setup Steps

### 1. Supabase Project erstellen & mit GitHub verbinden

1. Gehe zu https://supabase.com und erstelle ein neues Projekt
2. Kopiere Project-Informationen:
   - `VITE_SUPABASE_URL` = Project URL
   - `VITE_SUPABASE_ANON_KEY` = Anon Key
   - `PROJECT_REF` = Project ID (für GitHub-Sync)

3. **GitHub-Sync aktivieren** (Infrastructure as Code):
   ```bash
   # Supabase CLI installieren
   npm install -g supabase
   
   # Mit Projekt verlinken
   supabase link --project-ref YOUR_PROJECT_REF
   
   # Lokal testen
   supabase start
   ```

4. **GitHub Actions Secrets hinzufügen** (für Auto-Deploy):
   - Repo → Settings → Secrets → `SUPABASE_ACCESS_TOKEN` 
     - Generiere auf https://app.supabase.com/account/tokens
   - Repo → Settings → Secrets → `SUPABASE_PROJECT_REF`
   - Repo → Settings → Secrets → `SUPABASE_DB_PASSWORD`

   → Migrations werden jetzt automatisch zu Supabase deployt! ✅

Siehe [supabase/README.md](supabase/README.md) für Details.

### 2. GitHub OAuth App registrieren

1. Gehe zu https://github.com/settings/developers
2. Klick auf "New OAuth App"
3. Fülle aus:
   - **Application name**: Code Reviewer
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:5173/auth/callback`
4. Kopiere Client ID & Client Secret

### 3. Supabase GitHub Provider konfigurieren

1. In Supabase Dashboard → Authentication → Providers
2. Suche "GitHub" und klick enable
3. Trage Client ID & Client Secret ein von Step 2
4. Save

### 4. Featherless API einrichten

1. Gehe zu https://featherless.ai und erstelle Account
2. Generiere API Key
3. Notiere dir die API URL (meist `https://api.featherless.ai/v1/messages`)

### 5. Environment Variables

Erstelle `.env.local` im Root-Verzeichnis:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_FEATHERLESS_API_URL=https://api.featherless.ai/v1/messages
VITE_FEATHERLESS_API_KEY=your-featherless-api-key
```

### 6. Dependencies installieren & starten

```bash
npm install
npm run dev
```

App lädt unter `http://localhost:5173`

## Verwendung

1. Klick auf "Sign in with GitHub"
2. Autorisiere die App auf GitHub
3. Dashboard lädt deine Repos
4. Wähle ein Repo aus
5. Klick "🚀 Start Code Review"
6. Warte auf AI-Analyse im Terminal-Style Output

## Troubleshooting

**"Featherless API credentials not configured"**
- Überprüfe `.env.local` und ENV-Variablen

**"GitHub API error"**
- Prüfe ob GitHub Token gültig ist
- Überprüfe Supabase GitHub Provider Config

**Repos werden nicht geladen**
- Überprüfe ob du auf GitHub logged in bist
- Überprüfe GitHub Scope in AuthContext (sollte `repo` sein)

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
