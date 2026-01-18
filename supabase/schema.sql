-- Riddle Quest Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game Profiles table
CREATE TABLE IF NOT EXISTS public.game_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_gems INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_played_date TIMESTAMP WITH TIME ZONE,
  total_riddles_solved INTEGER DEFAULT 0,
  fastest_solve_time REAL,
  no_hint_solves INTEGER DEFAULT 0,
  perfect_streak_count INTEGER DEFAULT 0,
  total_gems_earned INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Solved Riddles table
CREATE TABLE IF NOT EXISTS public.solved_riddles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  riddle_id TEXT NOT NULL,
  solved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  gems_earned INTEGER NOT NULL,
  hints_used INTEGER[] DEFAULT '{}',
  solve_time_seconds REAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, riddle_id)
);

-- Achievements Unlocked table
CREATE TABLE IF NOT EXISTS public.achievements_unlocked (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Admin Riddles table (for dynamic riddle management)
CREATE TABLE IF NOT EXISTS public.admin_riddles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question TEXT NOT NULL,
  answer JSONB NOT NULL, -- Can be string or array of strings
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category TEXT,
  hint1 TEXT,
  hint2 TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_profiles_user_id ON public.game_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_solved_riddles_user_id ON public.solved_riddles(user_id);
CREATE INDEX IF NOT EXISTS idx_solved_riddles_riddle_id ON public.solved_riddles(riddle_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements_unlocked(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_riddles_difficulty ON public.admin_riddles(difficulty);
CREATE INDEX IF NOT EXISTS idx_admin_riddles_active ON public.admin_riddles(is_active);

-- Create leaderboard view
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  u.id as user_id,
  u.username,
  u.avatar_url,
  gp.total_gems,
  gp.total_riddles_solved,
  gp.current_streak,
  RANK() OVER (ORDER BY gp.total_gems DESC, gp.total_riddles_solved DESC) as rank
FROM public.users u
JOIN public.game_profiles gp ON u.id = gp.user_id
WHERE u.role = 'user'
ORDER BY rank
LIMIT 100;

-- Function for weekly leaderboard
CREATE OR REPLACE FUNCTION public.get_weekly_leaderboard()
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  riddles_this_week BIGINT,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.username,
    u.avatar_url,
    COUNT(sr.id) as riddles_this_week,
    RANK() OVER (ORDER BY COUNT(sr.id) DESC) as rank
  FROM public.users u
  JOIN public.solved_riddles sr ON u.id = sr.user_id
  WHERE sr.solved_at >= NOW() - INTERVAL '7 days'
  GROUP BY u.id, u.username, u.avatar_url
  ORDER BY riddles_this_week DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solved_riddles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements_unlocked ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_riddles ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Game profiles policies
CREATE POLICY "Users can view all game profiles" ON public.game_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.game_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.game_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Solved riddles policies
CREATE POLICY "Users can view own solved riddles" ON public.solved_riddles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own solved riddles" ON public.solved_riddles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Users can view own achievements" ON public.achievements_unlocked FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON public.achievements_unlocked FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin riddles policies
CREATE POLICY "Anyone can view active riddles" ON public.admin_riddles FOR SELECT USING (is_active = true OR auth.uid() = created_by);
CREATE POLICY "Admins can insert riddles" ON public.admin_riddles FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update riddles" ON public.admin_riddles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete riddles" ON public.admin_riddles FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_game_profiles
  BEFORE UPDATE ON public.game_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_admin_riddles
  BEFORE UPDATE ON public.admin_riddles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO public.game_profiles (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on auth signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
