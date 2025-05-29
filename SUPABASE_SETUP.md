# Supabase Setup Instructions

## Quick Setup Steps

### 1. Create .env.local file
Create a file called `.env.local` in your project root with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Get Your Supabase Values
1. Go to [supabase.com](https://supabase.com) and sign in
2. Open your project dashboard
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Database Schema (Already Done)
The SQL to create your table is already provided in the main instructions.

### 4. Test It
Run `npm run dev` and try submitting a launch. You should see:
- `📡 Fetching launches from Supabase...` in console
- `✅ Successfully created launch in Supabase:` when submitting

### 5. Netlify Environment Variables
In your Netlify dashboard:
1. Go to **Site Settings → Environment Variables**
2. Add the same two variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Troubleshooting

- **Missing environment variables error**: Make sure `.env.local` exists and has the correct values
- **Database connection error**: Check your Supabase project is active and keys are correct
- **Build errors**: Make sure you ran `npm install @supabase/supabase-js` 