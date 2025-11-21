# YAZIO - Welcome Back Experience

A personalized meal planning and fitness onboarding experience built with Nuxt 3, Vue 3, and Tailwind CSS.

## 🚀 Features

- **Personalized Onboarding**: Goal-based meal planning recommendations
- **Interactive Quiz**: Dietary preference and time commitment assessment
- **Dynamic Paywall**: Behavioral science-driven conversion optimization
- **Responsive Design**: Mobile-first approach with modern UI
- **Analytics Integration**: Comprehensive user flow tracking

## 🛠️ Tech Stack

- **Framework**: Nuxt 3
- **UI**: Vue 3 + Tailwind CSS
- **Components**: PrimeVue
- **Validation**: Zod schemas
- **State Management**: Vue Composition API
- **Analytics**: Custom composables

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run generate
```

## 🚀 Deployment to GitHub Pages

### Prerequisites
- GitHub repository created
- Repository name should match the base URL (e.g., `yazio`)

### Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to Pages section
   - Select "GitHub Actions" as source
   - Wait for automatic deployment

3. **Access your site**
   Your app will be available at: `https://YOUR_USERNAME.github.io/yazio/`

### Manual Deployment
```bash
# Generate static files
npm run generate

# Files will be in the `dist/` directory
# Upload contents of dist/ to GitHub Pages manually
```

## 🎯 Project Structure

```
yazio/
├── assets/           # Static assets (CSS, images)
├── components/       # Vue components
├── composables/      # Vue composables
├── pages/           # Nuxt pages (file-based routing)
├── schemas/         # Zod validation schemas
├── styles/          # Page-specific styles
└── middleware/      # Route protection
```

## 📊 Analytics & Personalization

- **Behavioral Science**: Loss aversion, social proof, reciprocity
- **Dynamic Variants**: Goal-based paywall optimization
- **User Flow Tracking**: Comprehensive analytics system
- **A/B Testing Ready**: Modular variant system

## 🔧 Configuration

Key configuration files:
- `nuxt.config.ts` - Nuxt configuration
- `tailwind.config.js` - Tailwind CSS setup
- `.github/workflows/deploy.yml` - GitHub Actions CI/CD

## 📝 License

This project is for demonstration purposes.