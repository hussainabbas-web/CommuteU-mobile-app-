<div align="center">

# 🚇 CommuteU

**A smart commuter companion for university students navigating the Greater Toronto Area.**

CommuteU combines live transit tracking, academic scheduling, and wellness-focused tools into one mobile experience — helping students commute smarter, stay productive, and reduce burnout.

[![React Native](https://img.shields.io/badge/React_Native-Expo-black?style=flat-square&logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## 📖 Overview

Toronto Metropolitan University is one of Canada's most commuter-heavy universities. Thousands of students travel from cities across the GTA every day — often spending multiple hours in transit.

### The Problem

| Challenge | Impact |
|-----------|--------|
| TTC & GO Transit delays | Missed classes and added stress |
| Long, exhausting commute schedules | Fatigue and reduced academic performance |
| Wasted time between lectures | Lost productivity |
| Difficulty balancing academics & wellness | Higher risk of burnout |
| No personalized commute planning | Inefficient daily routines |

### The Solution

CommuteU acts as a **personalized student commute assistant**. By combining live transit data with class schedules and campus resources, the app helps students plan their day more efficiently and make better use of their time.

---

## ✨ Features

### 🗺️ Smart Route Planning
Input your classes and commute preferences to receive optimized routes and departure recommendations using real-time TTC and GO Transit updates.

### ⏰ Dynamic Leave Alerts
Get notified exactly when it's time to leave — accounting for traffic, transit delays, and weather disruptions before they happen.

### 📍 Gap Optimizer
Time between classes? CommuteU recommends nearby options like study spaces, cafés, gyms, libraries, or campus events based on your available window.

### 🔥 Burnout Prevention
CommuteU analyzes your commute intensity and weekly workload patterns to help you build healthier, more sustainable routines.

### 📅 Integrated Student Scheduling
Manage classes, study sessions, commute plans, and campus activities all in one centralized mobile experience.

### 📱 Mobile-First Experience
Designed specifically for mobile — supporting students while commuting, walking between buildings, or planning on the go.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile App | React Native + Expo |
| Language | TypeScript |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Styling | NativeWind / Tailwind CSS |
| Maps & Navigation | Google Maps Platform |
| Transit Data | TTC GTFS Realtime + GO Transit APIs |
| Notifications | Expo Push Notifications |
| Deployment | Vercel (web) + Expo EAS (mobile) |

---

## 🏗️ Architecture

```
commuteu/
├── app/                 # Expo Router screens
├── components/          # Reusable UI components
├── services/            # API and backend services
├── hooks/               # Custom React hooks
├── lib/                 # Supabase client and utilities
├── assets/              # Images, icons, maps
├── types/               # Shared TypeScript types
└── README.md
```

### Core Technologies

- **React Native + Expo** — Cross-platform mobile development
- **Supabase** — Authentication, database, and backend services
- **Google Maps APIs** — Route planning and navigation
- **TTC & GO Transit APIs** — Real-time transit tracking
- **TypeScript** — Scalable and maintainable codebase
- **Vercel & Expo EAS** — Deployment and distribution

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18`
- Expo CLI
- Supabase account
- Google Maps API key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/commuteu.git
cd commuteu

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys to .env

# Start the development server
npx expo start
```

---

## 🗺️ Development Roadmap

- [x] Initial project planning
- [x] UI/UX wireframing
- [ ] Authentication system
- [ ] Schedule management
- [ ] Transit API integration
- [ ] Smart route engine
- [ ] Push notification system
- [ ] Burnout analytics
- [ ] Campus map support
- [ ] Beta launch

---

## 🔮 Future Plans

- 🤖 AI-powered commute predictions
- 📊 Smart schedule balancing recommendations
- 👥 Social commuting and friend tracking
- 🏫 Campus crowd density insights
- 💳 Apple Wallet / PRESTO card integration
- ♿ Accessibility-focused commute customization
- 🗺️ TMU campus map integration
- 📶 Offline commute support

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ for TMU students navigating the GTA

</div>
