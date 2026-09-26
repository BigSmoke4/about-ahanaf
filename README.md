# about ahanaf

<div align="center">

![Portfolio Logo](browser%20logo.png)

**A stunning 3D interactive portfolio built with React Three Fiber**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.169.0-000000?logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## ✨ Features

- 🎨 **Immersive 3D Experience** - Interactive 3D character and environment using React Three Fiber
- 📜 **Scroll-Driven Timeline** - Smooth scroll animations with timeline-based navigation
- 🎯 **13 Project Showcase** - Detailed project cards with individual images and descriptions
- 📧 **Smart Contact Integration** - Direct Gmail compose integration for seamless communication
- 📄 **Document Downloads** - One-click access to CV, certificates, and research papers
- 🌐 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- ⚡ **Performance Optimized** - Efficient rendering with lazy loading and code splitting
- 🎭 **Dynamic Animations** - Framer Motion powered smooth transitions
- 🌙 **Dark Theme** - Elegant dark theme with high contrast for readability

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 5.4.10** - Build tool and dev server
- **Three.js 0.169.0** - 3D graphics library
- **React Three Fiber 8.17.10** - React renderer for Three.js
- **React Three Drei 9.114.0** - Useful helpers for R3F
- **React Three Postprocessing 2.16.3** - Post-processing effects
- **Framer Motion 11.18.2** - Animation library
- **Zustand 4.5.5** - State management
- **React Markdown 10.1.0** - Markdown rendering
- **Remark GFM 4.0.1** - GitHub Flavored Markdown support
- **Rehype Raw 7.0.0** - HTML in Markdown support

### Styling
- **CSS3** - Custom styling with CSS variables
- **Google Fonts** - Mansalva, Cormorant Upright, Chiron GoRound TC

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BigSmoke4/ahanaf-portfolio.git
   cd ahanaf-portfolio/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
web/
├── public/
│   ├── documents/          # Downloadable PDFs
│   │   ├── resume.pdf
│   │   ├── certificates.pdf
│   │   └── thesis.pdf
│   ├── models/             # 3D model files
│   │   └── me.glb
│   ├── works/              # Project images
│   │   ├── nexus/banner.jpg
│   │   ├── veritas/banner.jpg
│   │   └── ...
│   └── favicon.png        # Browser tab icon
├── src/
│   ├── content/
│   │   └── works/          # Project markdown files
│   │       ├── nexus.md
│   │       ├── veritas.md
│   │       └── ...
│   ├── data/
│   │   ├── focusPoints.ts # 3D camera focus points
│   │   ├── workDocs.ts    # Project documentation
│   │   └── works.ts       # Project data
│   ├── scene/
│   │   ├── Env.tsx        # 3D environment
│   │   └── Scene.tsx      # Main 3D scene
│   ├── store/
│   │   └── index.ts       # Zustand state store
│   ├── ui/
│   │   ├── Contact.tsx    # Contact section
│   │   ├── Documents.tsx  # Documents section
│   │   ├── LoadingScreen.tsx
│   │   ├── NoiseOverlay.tsx
│   │   ├── Resume.tsx     # Resume timeline
│   │   ├── SocialIcons.tsx
│   │   └── Works.tsx      # Projects showcase
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── styles.css         # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🎨 Project Sections

### 1. Hero Section
- Interactive 3D character
- Personal introduction
- Smooth scroll cue animation
- Dynamic year display

### 2. Resume Timeline
- Chronological education and experience
- 4 key entries from 2018 to present
- Staggered animation on scroll
- Timeline dot indicators

### 3. Contact Section
- LinkedIn profile link
- GitHub profile link
- Gmail compose integration
- Horizontal icon layout

### 4. Documents Section
- CV/Resume download
- Certificates download
- Research paper download
- One-click PDF access

### 5. Works Section
- 13 project showcases
- Individual project images
- GitHub repository links
- Detailed markdown descriptions
- Technology stack information

---

## 📝 Projects Featured

### Enterprise Platforms
1. **NEXUS** - Supply Chain Intelligence Command Center
2. **VERITAS** - Enterprise Identity & Access Governance
3. **NEURA** - Neural AI Agent Orchestration Platform
4. **FORGE** - AI Software Engineering Intelligence
5. **PULSE** - Distributed Job Processing Platform
6. **ATLAS** - Enterprise Intelligent API & Event Platform
7. **AURORA** - Organizational Resilience & Decision Intelligence
8. **SENTINEL** - Enterprise Operational Risk Simulator
9. **AEGIS** - Intelligent Incident Response Platform

### AI & Machine Learning
10. **NIRBHOR** - Bilingual AI Personal Administrative Agent
11. **Local Agent Platform** - Autonomous Coding Platform

### Web Applications
12. **BDPriceFinder** - Multi-Vendor E-Commerce Platform
13. **Responsive E-Commerce** - ASP.NET MVC Application

---

## 🎯 Key Technologies Highlighted

- **ASP.NET Core MVC** - Web framework
- **C#** - Primary programming language
- **PostgreSQL** - Database
- **Redis** - Caching and message broker
- **SignalR** - Real-time communication
- **Docker** - Containerization
- **OpenTelemetry** - Observability
- **RabbitMQ** - Message queue
- **SQL Server** - Database
- **Entity Framework Core** - ORM
- **OpenAI, Anthropic, Google AI** - AI providers

---

## 🌐 Contact

- **Email**: [ahanafmo@gmail.com](mailto:ahanafmo@gmail.com)
- **GitHub**: [BigSmoke4](https://github.com/BigSmoke4)
- **LinkedIn**: [Ahanaf Mokammel Omi](https://www.linkedin.com/in/ahanaf-mokammel-omi-b15764268/)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Original 3D resume template inspired by Sen Zheng's portfolio
- Built with modern web technologies and best practices
- Designed for performance and accessibility

---

<div align="center">

**Made with ❤️ by Ahanaf Mokammel Omi**

[⬆ Back to Top](#ahanaf-mokammel-omi---3d-portfolio)

</div>
