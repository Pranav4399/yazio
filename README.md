# Yazio Welcome Back Funnel

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new Supabase project
   - Run the SQL from `schema.sql` in your Supabase SQL Editor
   - Get your project URL and anon key from Settings → API

3. **Environment variables:**
   Create a `.env` file in the root directory:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Available Test Users

- **pranav** / **abc123**
- **shreya** / **abc123**
- **jc** / **abc123**
- **sriram** / **abc123**
- **john** / **abc123**
- **rock** / **abc123**
- **alice** / **abc123**
- **bob** / **abc123**
- **charlie** / **abc123**
- **david** / **abc123**

## Features

- ✅ User authentication with Supabase
- ✅ Personalized welcome back experience
- ✅ Dynamic quiz questions from database
- ✅ Analytics tracking
- ✅ A/B testing framework
- ✅ Feature flags support