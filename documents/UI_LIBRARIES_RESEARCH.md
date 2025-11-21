# Niche UI Component Libraries Research

## Overview

This document outlines niche UI component libraries that are clear, well-designed, and functional for building the YAZIO Welcome Back Funnel. These libraries are less mainstream but offer excellent developer experience and modern design.

---

## 🎯 Top Recommendations for Vue 3 / Nuxt 3

### 1. **Radix Vue** ⭐ **TOP PICK**
**Type**: Headless/Unstyled Components  
**Website**: https://www.radix-vue.com/  
**GitHub**: https://github.com/unovue/radix-vue

**Why It's Perfect**:
- ✅ **Vue 3 & Nuxt compatible** - Built specifically for Vue ecosystem
- ✅ **Accessibility-first** - WAI-ARIA compliant, keyboard navigation out of the box
- ✅ **Unstyled** - Complete control over styling (perfect for custom design)
- ✅ **TypeScript** - Full TypeScript support
- ✅ **40+ components** - Dialog, Select, Radio Group, Checkbox, Progress, Stepper, Toast, etc.
- ✅ **Active development** - Well-maintained with active community

**Components Relevant to Our Flow**:
- `RadioGroup` - Perfect for quiz questions
- `Dialog` - For modals/overlays
- `Progress` - Progress indicators
- `Stepper` - Multi-step flow indicator
- `Select` - Dropdown selections
- `Toast` - Success/error notifications
- `Checkbox` - Form inputs

**Installation**:
```bash
npm install radix-vue
```

**Best For**: Building accessible, custom-styled components with full control

---

### 2. **Naive UI**
**Type**: Complete Component Library  
**Website**: https://www.naiveui.com/  
**GitHub**: https://github.com/tusen-ai/naive-ui

**Why It's Great**:
- ✅ **Vue 3 native** - Built solely for Vue 3 (no legacy baggage)
- ✅ **90+ components** - Comprehensive component set
- ✅ **TypeScript-first** - Advanced type-safe theme system
- ✅ **Clean & modern** - Minimal, professional design
- ✅ **Theme customizable** - Advanced theming system
- ✅ **Fast** - Optimized performance

**Components Relevant to Our Flow**:
- `NForm` / `NFormItem` - Form handling
- `NRadio` / `NRadioGroup` - Quiz options
- `NButton` - CTAs
- `NProgress` - Progress indicators
- `NSteps` - Multi-step indicator
- `NCard` - Content cards
- `NMessage` / `NNotification` - Feedback

**Installation**:
```bash
npm install naive-ui
```

**Best For**: Quick development with beautiful, ready-to-use components

---

### 3. **Ark UI (Vue)**
**Type**: Headless Components  
**Website**: https://v3.ark-ui.com/  
**GitHub**: https://github.com/chakra-ui/ark

**Why It's Interesting**:
- ✅ **Framework agnostic** - Works with Vue, React, Solid, etc.
- ✅ **45+ components** - Comprehensive headless library
- ✅ **Accessible** - Built with accessibility in mind
- ✅ **Composable** - Highly composable architecture
- ✅ **TypeScript** - Full type safety

**Components Relevant to Our Flow**:
- Radio group, checkbox, select, dialog, progress, etc.

**Installation**:
```bash
npm install @ark-ui/vue
```

**Best For**: Cross-framework consistency if you need Vue + React support

---

### 4. **FormKit**
**Type**: Form-Focused Library  
**Website**: https://formkit.com/  
**GitHub**: https://github.com/formkit/formkit

**Why It's Special**:
- ✅ **Form-first** - Built specifically for complex forms
- ✅ **Vue 3 native** - Designed for Vue ecosystem
- ✅ **Validation built-in** - Powerful validation system
- ✅ **TypeScript** - Full type support
- ✅ **Accessible** - WCAG compliant
- ✅ **Themable** - Customizable styling

**Perfect For**: Quiz steps and form-heavy screens

**Installation**:
```bash
npm install @formkit/vue
```

**Best For**: Complex form handling with validation

---

### 5. **TinyVue**
**Type**: Renderless Components  
**Website**: https://opentiny.design/tiny-vue  
**GitHub**: https://github.com/opentiny/tiny-vue

**Why It's Unique**:
- ✅ **Renderless design** - No default styles, pure logic
- ✅ **Enterprise-grade** - Built for large-scale applications
- ✅ **Cross-framework** - Works with Vue, React, Angular
- ✅ **TypeScript** - Full type safety
- ✅ **Composable** - Highly flexible architecture

**Best For**: Maximum flexibility with renderless approach

---

### 6. **Vuestic UI**
**Type**: Complete Component Library  
**Website**: https://ui.vuestic.dev/  
**GitHub**: https://github.com/epicmaxco/vuestic-ui

**Why It's Good**:
- ✅ **Vue 3** - Modern Vue support
- ✅ **Simple API** - Easy to use
- ✅ **Customizable** - Theme system
- ✅ **Documentation** - Good docs

**Best For**: Quick prototyping with styled components

---

## 🎨 Supporting Libraries (Specialized)

### **Sonner** (Toast Notifications)
**Type**: Toast/Notification Library  
**Website**: https://sonner.emilkowal.ski/  
**GitHub**: https://github.com/emilkowalski/sonner

**Why It's Perfect**:
- ✅ **Tiny** - Minimal bundle size
- ✅ **Beautiful** - Clean, modern design
- ✅ **Framework agnostic** - Works with Vue, React, etc.
- ✅ **Accessible** - Built-in accessibility
- ✅ **Customizable** - Highly customizable

**Perfect For**: Success/error notifications during flow

**Installation**:
```bash
npm install sonner
```

---

### **Magic UI** (Animated Components)
**Type**: Copy-Paste Animated Components  
**Website**: https://magicui.design/  
**GitHub**: https://github.com/magicuidesign/magicui

**Why It's Cool**:
- ✅ **50+ animated components** - Beautiful animations
- ✅ **Copy-paste** - No npm install needed
- ✅ **Tailwind CSS** - Built on Tailwind
- ✅ **Framer Motion** - Smooth animations
- ✅ **Modern** - Latest design trends

**Perfect For**: Adding polish and animations to key interactions

---

### **Aceternity UI** (Animated Components)
**Type**: Animated Component Library  
**Website**: https://ui.aceternity.com/

**Why It's Interesting**:
- ✅ **Animated components** - Framer Motion integration
- ✅ **Modern design** - Latest UI trends
- ✅ **Copy-paste** - Easy integration
- ✅ **Tailwind CSS** - Styled with Tailwind

**Perfect For**: Adding visual flair to onboarding flow

---

## 🎯 Recommendation Matrix

| Library | Type | Best For | Complexity | Bundle Size |
|---------|------|----------|------------|-------------|
| **Radix Vue** | Headless | Custom design + Accessibility | Medium | Small |
| **Naive UI** | Complete | Quick development | Low | Medium |
| **Ark UI** | Headless | Cross-framework | Medium | Small |
| **FormKit** | Forms | Complex forms | Medium | Medium |
| **TinyVue** | Renderless | Maximum flexibility | High | Small |
| **Vuestic UI** | Complete | Quick prototyping | Low | Medium |

---

## 💡 Recommended Stack for YAZIO Project

### **Primary Choice: Radix Vue + Tailwind CSS**

**Why This Combination**:
1. **Radix Vue** provides accessible, unstyled components
2. **Tailwind CSS** gives you complete styling control
3. **Perfect balance** of functionality and customization
4. **Accessibility built-in** - No need to worry about WCAG compliance
5. **TypeScript support** - Type-safe development
6. **Small bundle** - Only includes what you need

### **Supporting Libraries**:
- **Sonner** - For toast notifications
- **Magic UI** (optional) - For animated progress indicators or transitions

### **Example Stack**:
```json
{
  "dependencies": {
    "radix-vue": "^1.x",
    "tailwindcss": "^3.x",
    "sonner": "^1.x"
  }
}
```

---

## 🚀 Implementation Example

### Using Radix Vue for Quiz Step

```vue
<template>
  <RadioGroupRoot
    v-model="selectedAnswer"
    class="space-y-4"
    @update:model-value="handleAnswer"
  >
    <RadioGroupItem
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      class="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50"
    >
      <RadioGroupIndicator />
      <label class="flex-1 cursor-pointer">
        {{ option.label }}
      </label>
    </RadioGroupItem>
  </RadioGroupRoot>
</template>

<script setup lang="ts">
import { RadioGroupRoot, RadioGroupItem, RadioGroupIndicator } from 'radix-vue'

const selectedAnswer = ref('')
const options = [
  { value: 'balanced', label: 'Balanced meals' },
  { value: 'quick', label: 'Quick recipes' },
  { value: 'meal-prep', label: 'Meal prep friendly' }
]

const handleAnswer = (value: string) => {
  // Track answer selection
  trackEvent('quiz_answer_selected', { answer: value })
}
</script>
```

---

## 📊 Comparison: Radix Vue vs Naive UI

| Feature | Radix Vue | Naive UI |
|---------|-----------|----------|
| **Styling** | Unstyled (you style) | Pre-styled (customizable) |
| **Bundle Size** | Smaller (only logic) | Larger (includes styles) |
| **Customization** | Complete control | Theme-based |
| **Accessibility** | Excellent | Good |
| **Learning Curve** | Medium | Low |
| **Best For** | Custom design systems | Quick development |

---

## ✅ Final Recommendation

### **Go with Radix Vue + Tailwind CSS**

**Reasons**:
1. ✅ **Perfect for case study** - Shows you can build custom, accessible components
2. ✅ **Accessibility built-in** - Meets the accessibility requirement
3. ✅ **Flexible styling** - Complete control over design
4. ✅ **Small bundle** - Performance-conscious
5. ✅ **TypeScript** - Type-safe development
6. ✅ **Vue 3 native** - Perfect for Nuxt 3

**Add Sonner for notifications** - Tiny, beautiful, accessible toast library

**Optional: Magic UI** - For animated progress indicators or transitions (copy-paste, no npm install)

---

## 🔗 Quick Links

- [Radix Vue Documentation](https://www.radix-vue.com/)
- [Naive UI Documentation](https://www.naiveui.com/)
- [FormKit Documentation](https://formkit.com/)
- [Sonner Documentation](https://sonner.emilkowal.ski/)
- [Magic UI Components](https://magicui.design/)

---

## 📝 Notes

- All recommended libraries are actively maintained
- All support TypeScript
- All are accessible (WCAG compliant)
- All work with Vue 3 / Nuxt 3
- Consider bundle size for performance
- Choose based on your preference for styled vs unstyled components

