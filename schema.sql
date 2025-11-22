-- Supabase Schema for Yazio Welcome Back Funnel
-- Execute this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (basic authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Note: Hash passwords in production
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT,
  goal TEXT,
  dietaryPreference TEXT,
  timeCommitment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz questions table (JSONB storage)
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz responses table
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  answer TEXT,
  skipped BOOLEAN DEFAULT false,
  time_spent INTEGER, -- seconds (converted from milliseconds)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id) -- Ensure one response per user per question
);

-- Feature flags table
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_quiz_responses_user_id ON quiz_responses(user_id);
CREATE INDEX idx_quiz_responses_question_id ON quiz_responses(question_id);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);
CREATE INDEX idx_feature_flags_key ON feature_flags(key);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust based on your auth needs)
CREATE POLICY "Users can read their own data" ON users FOR SELECT USING (true);

CREATE POLICY "User profiles are readable" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "User profiles are updatable" ON user_profiles FOR UPDATE USING (true);

CREATE POLICY "Quiz questions are readable" ON quiz_questions FOR SELECT USING (true);

CREATE POLICY "Quiz responses are insertable" ON quiz_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Quiz responses are readable" ON quiz_responses FOR SELECT USING (true);
CREATE POLICY "Quiz responses are updatable" ON quiz_responses FOR UPDATE USING (true);

CREATE POLICY "Analytics data is insertable" ON analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Analytics data is updatable" ON analytics FOR UPDATE USING (true);
CREATE POLICY "Analytics data is readable" ON analytics FOR SELECT USING (true);

CREATE POLICY "Feature flags are readable" ON feature_flags FOR SELECT USING (true);

-- Insert test users for development (same password for all)
INSERT INTO users (username, password) VALUES
  ('pranav', 'abc123'),
  ('shreya', 'abc123'),
  ('jc', 'abc123'),
  ('sriram', 'abc123'),
  ('john', 'abc123'),
  ('rock', 'abc123'),
  ('alice', 'abc123'),
  ('bob', 'abc123'),
  ('charlie', 'abc123'),
  ('david', 'abc123');

-- Insert dummy user profiles for testing
INSERT INTO user_profiles (user_id, name, goal, dietaryPreference, timeCommitment) VALUES
  ((SELECT id FROM users WHERE username = 'pranav'), 'Pranav Kumar', 'lose-weight', 'quick-recipes', '30min'),
  ((SELECT id FROM users WHERE username = 'shreya'), 'Shreya Patel', 'maintain-weight', 'balanced', '1hour'),
  ((SELECT id FROM users WHERE username = 'jc'), 'JC Johnson', 'build-muscle', 'meal-prep', '1hour'),
  ((SELECT id FROM users WHERE username = 'sriram'), 'Sriram Venkatesan', 'lose-weight', 'balanced', '30min'),
  ((SELECT id FROM users WHERE username = 'john'), 'John Smith', 'gain-weight', 'meal-prep', '1hour'),
  ((SELECT id FROM users WHERE username = 'rock'), 'Rock Johnson', 'improve-health', 'flexible', '30min'),
  ((SELECT id FROM users WHERE username = 'alice'), 'Alice Cooper', 'lose-weight', 'quick-recipes', '15min'),
  ((SELECT id FROM users WHERE username = 'bob'), 'Bob Wilson', 'maintain-weight', 'balanced', 'flexible'),
  ((SELECT id FROM users WHERE username = 'charlie'), 'Charlie Brown', 'build-muscle', 'meal-prep', '1hour'),
  ((SELECT id FROM users WHERE username = 'david'), 'David Chen', 'gain-weight', 'flexible', '30min');

-- Insert quiz questions from schemas/quiz.ts
INSERT INTO quiz_questions (questions) VALUES
('[
  {
    "id": "dietary-preference",
    "title": "What''s your preferred eating style?",
    "description": "This helps us personalize your meal recommendations",
    "options": [
      {"id": "balanced", "label": "Balanced meals", "value": "balanced", "description": "Nutritious variety every day"},
      {"id": "quick-recipes", "label": "Quick recipes", "value": "quick-recipes", "description": "Fast and easy to prepare"},
      {"id": "meal-prep", "label": "Meal prep friendly", "value": "meal-prep", "description": "Prepare ahead for the week"},
      {"id": "flexible", "label": "No preference", "value": "flexible", "description": "I''m open to anything"}
    ],
    "required": true,
    "type": "radio"
  },
  {
    "id": "time-commitment",
    "title": "How much time can you dedicate daily?",
    "description": "This helps us match you with realistic goals",
    "options": [
      {"id": "15min", "label": "15 minutes or less", "value": "15min", "description": "Quick and efficient approach"},
      {"id": "30min", "label": "30 minutes", "value": "30min", "description": "Moderate daily commitment"},
      {"id": "1hour", "label": "1 hour or more", "value": "1hour", "description": "Dedicated time for results"},
      {"id": "flexible", "label": "Flexible", "value": "flexible", "description": "Varies by day and situation"}
    ],
    "required": true,
    "type": "radio"
  },
  {
    "id": "motivation-style",
    "title": "What motivates you most?",
    "description": "Understanding your drive helps us keep you engaged",
    "required": false,
    "type": "input"
  }
]');

INSERT INTO feature_flags (key, value) VALUES ('show-branding', 'true');
