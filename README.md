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

- User authentication with Supabase
- Personalized welcome back experience
- Dynamic quiz questions from database
- Analytics tracking
- A/B testing framework
- Feature flags support

## Paywall Variant Selection

The paywall dynamically selects from three variants based on user behavior and preferences:

### Motivation Variant (A)
For users who need encouragement to start or maintain habits:
- Biggest challenge: motivation, cravings, or tracking difficulties
- Goal: improve-health or maintain-weight (from goal page)
- Dietary preference: flexible or no-preference (from goal page)

### Structure Variant (B)
For users who benefit from clear guidance and organization:
- Biggest challenge: busy schedule
- Goal: build-muscle, lose-weight, or gain-weight (from goal page)
- Dietary preference: specific preferences (not flexible/no-preference)

### Default Variant (C)
For all other users - balanced approach with general benefits

## Personalized Payment Experience

The payment page includes intelligent personalization that adapts based on user data:

### Goal-Based Messages
- **Weight Loss**: "Every successful weight loss journey starts with consistency over perfection"
- **Muscle Building**: "Fueling your body right is the foundation of building strength"
- **Weight Maintenance**: "Healthy maintenance is about balance and enjoying the foods you love"

### Discipline Level Support
For users who indicated lower discipline in morning routines:
- "Remember: progress happens one positive choice at a time"

### Challenge-Specific Content
- **Busy Schedule**: Complete 15-minute Chicken Stir-Fry recipe with collapsible details
- **Cravings**: Dark Chocolate Avocado Mousse recipe as a healthy alternative

### Time Commitment Acknowledgment
- **15 minutes**: "Perfect - our 15-minute meal ideas will fit seamlessly into your routine"
- **30 minutes**: "Our 30-minute recipes balance nutrition with your available time"

Recipes are presented in collapsible format to keep the page focused while providing immediate value.