# 🎮 Numberight

A fast-paced, addictive number comparison game that tests your quick decision-making skills.

**🚀 Live Demo:** https://ghmeurer04.github.io/Numberight/

## 🎯 Game Overview

Choose which option has the **highest number** from real-world data categories:
- 📊 Population statistics
- 🏪 Restaurant & retail chains
- 📱 Social media users
- 🚗 Transportation counts
- 🌍 Geographic & natural phenomena
- 💰 Economic data
- And many more engaging categories!

Each correct choice extends your streak. One wrong pick and it's game over. How high can you go?

## 🎓 How to Play

1. **Read the Category** - See what data is being compared
2. **Compare Values** - Two options appear
3. **Pick the Highest** - Click the option with the larger number
4. **Build Your Streak** - Keep answering correctly to increase your score
5. **Challenge Yourself** - Beat your personal record!

**⚡ Pro Tips:**
- Trust your instincts!
- Numbers range from thousands to billions
- Different categories test different number sense
- Track your best scores and compete with friends

## 🎮 Controls
- 🖱️ **Mouse** - Click to select an option
- 👆 **Touch** - Tap to select an option
- ⌨️ **Keyboard** (upcoming feature)

## 🛠️ Tech Stack
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling

## 📦 Development

### 📋 Prerequisites
- Node.js 18+
- npm or yarn

### 📥 Installation
```bash
npm install
```

### 🏃 Run Development Server

> **Note:** make sure you’ve installed dependencies first (`npm install`).

By default `dev` spins up both the API and the client using **concurrently**:
```bash
npm run dev          # starts server + vite in parallel
npm run dev:server   # only the Express API
npm run dev:client   # only the Vite client
```

### 🔨 Build for Production
```bash
npm run build
```

## 🚀 Deployment

This project is deployed to GitHub Pages using the `gh-pages` package.

> **Routing:** the app uses React Router's `HashRouter` so URLs work correctly on GitHub Pages without any additional configuration. You can navigate to `#/play` or `#/play/challenge`.

### 📤 Deploy to GitHub Pages
```bash
npm run deploy
```

## 📁 Project Structure
```
src/
├── components/       # Reusable components
├── pages/           # Page components
├── types/           # TypeScript types
├── App.tsx          # Main app component
└── main.tsx         # Entry point
database/            # Data files (CSV datasets)
```

## 🎪 Features

- ⚡ **Lightning Fast** - Instant feedback on your answers
- 🌍 **Global Data** - Compare statistics from around the world
- 📈 **Progressive Difficulty** - Categories get more challenging
- 🏆 **Score Tracking** - Keep track of your best performances
- 📱 **Responsive Design** - Play on desktop, tablet, or mobile
- 🎨 **Beautiful UI** - Clean, modern interface with Tailwind CSS

## 📄 License
MIT
