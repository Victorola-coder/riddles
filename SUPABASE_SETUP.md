# Supabase Setup Instructions

## 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to initialize (~2 minutes)

## 2. Get Your Credentials
From your Supabase project settings:
- **Project URL**: `https://[YOUR-PROJECT-REF].supabase.co`
- **Anon Key**: Found in Settings → API
- **Database URL**: Found in Settings → Database → Connection String (URI)

## 3. Create `.env.local` File
Create a file named `.env.local` in the root directory with:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
```

## 4. Run Database Migration
```bash
npx prisma migrate dev --name init
npx prisma generate
```

## 5. Seed Initial Data (Optional)
```bash
npm run db:seed
```

## 6. Start Development Server
```bash
npm run dev
```

Your app will now be connected to Supabase PostgreSQL!
