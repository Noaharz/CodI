# Supabase Configuration

Diese Ordnerstruktur definiert die gesamte Supabase-Infrastruktur für das Projekt.

## Struktur

```
supabase/
├── config.toml          # Supabase Projekt-Konfiguration
├── migrations/          # SQL-Migrations (versioniert in Git)
│   └── 20260518000000_init.sql
└── README.md           # Diese Datei
```

## Lokal Setup

### 1. Supabase CLI installieren
```bash
npm install -g supabase
# oder: brew install supabase/tap/supabase
```

### 2. Supabase Projekt mit GitHub verbinden
```bash
supabase link --project-ref <PROJECT_REF>
```

Deine `PROJECT_REF` findest du in: https://app.supabase.com → Settings → General

### 3. Lokale Entwicklung starten
```bash
supabase start
# Startet einen lokalen Supabase-Server auf Port 54321
```

### 4. Lokale Datenbank-Änderungen
```bash
# Nach Schema-Änderungen:
supabase db pull
# Erstellt eine neue Migration in ./migrations/
```

### 5. Migrations zu Supabase pushen
```bash
supabase db push
```

## Automatisches Deployment (GitHub Actions)

Sobald Migrations gepusht werden → GitHub Actions deployt automatisch zu Supabase!

**Erforderliche GitHub Secrets:**
1. `SUPABASE_ACCESS_TOKEN` – [Generieren](https://app.supabase.com/account/tokens)
2. `SUPABASE_PROJECT_REF` – Deine Projekt-ID (z.B. `abcdefghijklmnop`)
3. `SUPABASE_DB_PASSWORD` – Dein Supabase DB Password

### Secrets in GitHub hinzufügen:
```
Repo → Settings → Secrets and variables → Actions → New repository secret
```

## Migrations erstellen

### Option 1: Via CLI (lokal)
```bash
supabase migration new add_reviews_table
# Editiere die generierte Datei in ./migrations/
supabase db push
```

### Option 2: Direktes Editieren
1. Neue Datei in `supabase/migrations/` erstellen
2. SQL-Schema schreiben
3. Committen & pushen
4. GitHub Actions deployt automatisch ✅

## Beispiel-Migration

```sql
-- supabase/migrations/20260518_add_feature.sql

-- Create new table
create table if not exists my_table (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table my_table enable row level security;

-- Create policy
create policy "Users can view their own data"
  on my_table
  for select
  using (auth.uid() = user_id);
```

## Useful Commands

```bash
# Status überprüfen
supabase status

# Logs ansehen
supabase functions serve

# Lokale DB zurücksetzen
supabase db reset

# Push zu Production
supabase db push --linked

# Pull von Production
supabase db pull
```

## Docs

- [Supabase Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
