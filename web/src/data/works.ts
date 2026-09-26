// Works data (bilingual). 13 individual sections → click to expand work details.
// Pure data-driven: add/remove sections/works by only editing this file, Works.jsx only handles rendering.
//
// Section fields:
//   id        Unique identifier (used for framer layoutId shared element animation)
//   no        Number '01'…'13'
//   title     Section title
//   tagline   One-liner on right side of index row
//   items[]   Flat work list: { name, meta?, tags?, link? }
//             Click item to pop up fullscreen details, can add optional media/copy fields:
//             { image?, video?, year?, desc? } (media uses placeholder when missing, description falls back to meta/tags)
//   groups[]  Grouped works (mutually exclusive with items): { heading, items: string[] }
//   awards[]  Award chips (optional)
//   footer    Bottom tech/notes line (optional)

export interface WorkListItem {
  name: string
  meta?: string
  tags?: string[]
  link?: string
  slug?: string
}

export interface WorkGroup {
  heading: string
  items: string[]
}

export interface WorkSection {
  id: string
  no: string
  title: string
  tagline: string
  items?: WorkListItem[]
  groups?: WorkGroup[]
  awards?: string[]
  footer?: string
}

export interface WorksLang {
  title: string
  closeLabel: string
  openLabel: string
  hint: string
  awardsLabel: string
  visitLabel: string
  detailPlaceholder: string
  phImageLabel: string
  phButtonLabel: string
  countLabel: (n: number) => string
  sections: WorkSection[]
}

export const WORKS: Record<'zh' | 'en', WorksLang> = {
  zh: {
    title: 'Works',
    closeLabel: 'Back',
    openLabel: 'Expand',
    hint: 'Keep scrolling',
    awardsLabel: 'Awards',
    visitLabel: 'Visit site',
    detailPlaceholder: 'Your work description',
    phImageLabel: 'Image / Video',
    phButtonLabel: 'Link button',
    countLabel: (n) => `${n} works`,
    sections: [
      {
        id: 'nexus',
        no: '01',
        title: 'NEXUS',
        tagline: 'Supply-Chain Intelligence Command Center',
        items: [
          { name: 'NEXUS', meta: 'Supply Chain Intelligence', slug: 'nexus', link: 'https://github.com/BigSmoke4/NEXUS-Supply-Chain-Intelligence-Command-Center' },
        ],
        footer: 'ASP.NET Core MVC · C# · PostgreSQL · EF Core · Redis · SignalR · Docker · OpenTelemetry',
      },
      {
        id: 'veritas',
        no: '02',
        title: 'VERITAS',
        tagline: 'Enterprise Identity & Access Governance Platform',
        items: [
          { name: 'VERITAS', meta: 'Identity & Access Governance', slug: 'veritas', link: 'https://github.com/BigSmoke4/VERITAS' },
        ],
        footer: 'ASP.NET Core · C# · .NET 9 · PostgreSQL · EF Core · Redis · ASP.NET Core Identity · Razor',
      },
      {
        id: 'neura',
        no: '03',
        title: 'NEURA',
        tagline: 'Neural AI Agent Orchestration & Continuity Platform',
        items: [
          { name: 'NEURA', meta: 'AI Agent Orchestration', slug: 'neura', link: 'https://github.com/BigSmoke4/NEURA-Neural-AI-Agent-Orchestration-Continuity-Platform' },
        ],
        footer: 'ASP.NET Core MVC · C# · PostgreSQL · EF Core · Redis · SignalR · OpenAI · Anthropic · Google AI',
      },
      {
        id: 'forge',
        no: '04',
        title: 'FORGE',
        tagline: 'AI Software Engineering Intelligence Platform',
        items: [
          { name: 'FORGE', meta: 'Software Engineering Intelligence', slug: 'forge', link: 'https://github.com/BigSmoke4/FORGE-AI-Software-Engineering-Intelligence-Platform' },
        ],
        footer: 'ASP.NET Core · C# · Roslyn · PostgreSQL · EF Core · Git · Docker',
      },
      {
        id: 'pulse',
        no: '05',
        title: 'PULSE',
        tagline: 'Distributed Job Processing & Workflow Platform',
        items: [
          { name: 'PULSE', meta: 'Distributed Job Processing', slug: 'pulse', link: 'https://github.com/BigSmoke4/Pulse-Job-Orchestrator' },
        ],
        footer: 'ASP.NET Core MVC · C# · RabbitMQ · Redis · SQL Server · EF Core · Docker',
      },
      {
        id: 'bdpricefinder',
        no: '06',
        title: 'BDPriceFinder',
        tagline: 'Multi-Vendor E-Commerce & Price Comparison Platform',
        items: [
          { name: 'BDPriceFinder', meta: 'Multi-Vendor E-Commerce', slug: 'bdpricefinder', link: 'https://bdpricefinder.com' },
        ],
        footer: 'ASP.NET Core MVC · C# · Razor Views · SQL Server · EF Core · Redis · SignalR · JavaScript',
      },
      {
        id: 'local-agent',
        no: '07',
        title: 'Local Agent Platform',
        tagline: 'Local-First Autonomous Coding Platform',
        items: [
          { name: 'Local Agent', meta: 'Autonomous Coding Platform', slug: 'local-agent', link: 'https://github.com/BigSmoke4/Local-Agent-Platform' },
        ],
        footer: 'ASP.NET Core · C# · PostgreSQL · EF Core · Ollama · Roslyn · SignalR · Docker',
      },
      {
        id: 'atlas',
        no: '08',
        title: 'ATLAS',
        tagline: 'Enterprise Intelligent API & Event Platform',
        items: [
          { name: 'ATLAS', meta: 'API & Event Platform', slug: 'atlas', link: 'https://github.com/BigSmoke4/ATLAS-Enterprise-Intelligent-API-Event-Platform' },
        ],
        footer: 'ASP.NET Core · C# · .NET 9 · PostgreSQL · Redis · Kafka · OpenTelemetry',
      },
      {
        id: 'aurora',
        no: '09',
        title: 'AURORA',
        tagline: 'Organizational Resilience & Decision Intelligence',
        items: [
          { name: 'AURORA', meta: 'Decision Intelligence Architecture', slug: 'aurora', link: 'https://github.com/BigSmoke4/AURORA-Autonomous-Unified-Reasoning-Organizational-Resilience-Architecture' },
        ],
        footer: 'ASP.NET Core MVC · C# · Razor Views · PostgreSQL · EF Core · SignalR',
      },
      {
        id: 'sentinel',
        no: '10',
        title: 'SENTINEL',
        tagline: 'Enterprise Operational Risk & Resilience Simulator',
        items: [
          { name: 'SENTINEL', meta: 'Operational Risk Simulator', slug: 'sentinel', link: 'https://github.com/BigSmoke4/sentinel-risk-simulator' },
        ],
        footer: 'ASP.NET Core MVC · C# · PostgreSQL · Redis · EF Core · Docker',
      },
      {
        id: 'aegis',
        no: '11',
        title: 'AEGIS',
        tagline: 'Intelligent Incident Response & Digital Operations Platform',
        items: [
          { name: 'AEGIS', meta: 'Incident Response Platform', slug: 'aegis', link: 'https://github.com/BigSmoke4/Aegis-Intelligent-Incident-Response-Digital-Operations-Platform' },
        ],
        footer: 'ASP.NET Core MVC · C# · PostgreSQL · Redis · EF Core · Docker · xUnit',
      },
      {
        id: 'nirbhor',
        no: '12',
        title: 'NIRBHOR',
        tagline: 'Bilingual AI Personal Administrative Agent',
        items: [
          { name: 'NIRBHOR', meta: 'Bilingual AI Agent', slug: 'nirbhor', link: 'https://github.com/BigSmoke4/NIRBHOR-Bilingual-AI-Personal-Administrative-Agent' },
        ],
        footer: 'ASP.NET Core MVC · C# · PostgreSQL · EF Core · Identity · SignalR · Anthropic',
      },
      {
        id: 'ecommerce',
        no: '13',
        title: 'Responsive E-Commerce',
        tagline: 'ASP.NET MVC Razor Views Application',
        items: [
          { name: 'E-Commerce', meta: 'ASP.NET MVC Application', slug: 'ecommerce', link: 'https://github.com/BigSmoke4/Responsive-Ecommerce-asp.net-MVC-razor-view' },
        ],
        footer: 'ASP.NET MVC · C# · Razor Views · Entity Framework · SQL Server · HTML/CSS/JavaScript',
      },
    ],
  },
  en: {
    title: 'Works',
    closeLabel: 'Back',
    openLabel: 'Explore',
    hint: 'Keep scrolling',
    awardsLabel: 'Awards',
    visitLabel: 'Visit site',
    detailPlaceholder: 'Your work description',
    phImageLabel: 'Image / Video',
    phButtonLabel: 'Link button',
    countLabel: (n) => `${n} works`,
    sections: [
      {
        id: 'nexus',
        no: '01',
        title: 'NEXUS',
        tagline: 'Supply-Chain Intelligence Command Center',
        items: [
          { name: 'NEXUS', meta: 'Supply Chain Intelligence', slug: 'nexus', link: 'https://github.com/BigSmoke4/NEXUS-Supply-Chain-Intelligence-Command-Center' },
        ],
        footer: 'ASP.NET Core MVC · C# · PostgreSQL · EF Core · Redis · SignalR · Docker · OpenTelemetry',
      },
      {
        id: 'veritas',
        no: '02',
        title: 'VERITAS',
        tagline: 'Enterprise Identity & Access Governance Platform',
        items: [
          { name: 'VERITAS', meta: 'Identity & Access Governance', slug: 'veritas', link: 'https://github.com/BigSmoke4/VERITAS' },
        ],
        footer: 'ASP.NET Core · C# · .NET 9 · PostgreSQL · EF Core · Redis · ASP.NET Core Identity · Razor',
      },
      {
        id: 'neura',
        no: '03',
        title: 'NEURA',
        tagline: 'Neural AI Agent Orchestration & Continuity Platform',
        items: [
          { name: 'NEURA', meta: 'AI Agent Orchestration', slug: 'neura', link: 'https://github.com/BigSmoke4/NEURA-Neural-AI-Agent-Orchestration-Continuity-Platform' },
        ],
        footer: 'ASP.NET Core MVC · C# · PostgreSQL · EF Core · Redis · SignalR · OpenAI · Anthropic · Google AI',
      },
      {
        id: 'forge',
        no: '04',
        title: 'FORGE',
        tagline: 'AI Software Engineering Intelligence Platform',
        items: [
          { name: 'FORGE', meta: 'Software Engineering Intelligence', slug: 'forge', link: 'https://github.com/BigSmoke4/FORGE-AI-Software-Engineering-Intelligence-Platform' },
        ],
        footer: 'ASP.NET Core · C# · Roslyn · PostgreSQL · EF Core · Git · Docker',
      },
      {
        id: 'pulse',
        no: '05',
        title: 'PULSE',
        tagline: 'Distributed Job Processing & Workflow Platform',
        items: [
          { name: 'PULSE', meta: 'Distributed Job Processing', slug: 'pulse', link: 'https://github.com/BigSmoke4/Pulse-Job-Orchestrator' },
        ],
        footer: 'ASP.NET Core MVC · C# · RabbitMQ · Redis · SQL Server · EF Core · Docker',
      },
      {
        id: 'bdpricefinder',
        no: '06',
        title: 'BDPriceFinder',
        tagline: 'Multi-Vendor E-Commerce & Price Comparison Platform',
        items: [
          { name: 'BDPriceFinder', meta: 'Multi-Vendor E-Commerce', slug: 'bdpricefinder', link: 'https://bdpricefinder.com' },
        ],
        footer: 'ASP.NET Core MVC · C# · Razor Views · SQL Server · EF Core · Redis · SignalR · JavaScript',
      },
      {
        id: 'local-agent',
        no: '07',
        title: 'Local Agent Platform',
        tagline: 'Local-First Autonomous Coding Platform',
        items: [
          { name: 'Local Agent', meta: 'Autonomous Coding Platform', slug: 'local-agent', link: 'https://github.com/BigSmoke4/Local-Agent-Platform' },
        ],
        footer: 'ASP.NET Core · C# · PostgreSQL · EF Core · Ollama · Roslyn · SignalR · Docker',
      },
      {
        id: 'atlas',
        no: '08',
        title: 'ATLAS',
        tagline: 'Enterprise Intelligent API & Event Platform',
        items: [
          { name: 'ATLAS', meta: 'API & Event Platform', slug: 'atlas', link: 'https://github.com/BigSmoke4/ATLAS-Enterprise-Intelligent-API-Event-Platform' },
        ],
        footer: 'ASP.NET Core · C# · .NET 9 · PostgreSQL · Redis · Kafka · OpenTelemetry',
      },
      {
        id: 'aurora',
        no: '09',
        title: 'AURORA',
        tagline: 'Organizational Resilience & Decision Intelligence',
        items: [
          { name: 'AURORA', meta: 'Decision Intelligence Architecture', slug: 'aurora', link: 'https://github.com/BigSmoke4/AURORA-Autonomous-Unified-Reasoning-Organizational-Resilience-Architecture' },
        ],
        footer: 'ASP.NET Core MVC · C# · Razor Views · PostgreSQL · EF Core · SignalR',
      },
      {
        id: 'sentinel',
        no: '10',
        title: 'SENTINEL',
        tagline: 'Enterprise Operational Risk & Resilience Simulator',
        items: [
          { name: 'SENTINEL', meta: 'Operational Risk Simulator', slug: 'sentinel', link: 'https://github.com/BigSmoke4/sentinel-risk-simulator' },
        ],
        footer: 'ASP.NET Core MVC · C# · PostgreSQL · Redis · EF Core · Docker',
      },
      {
        id: 'aegis',
        no: '11',
        title: 'AEGIS',
        tagline: 'Intelligent Incident Response & Digital Operations Platform',
        items: [
          { name: 'AEGIS', meta: 'Incident Response Platform', slug: 'aegis', link: 'https://github.com/BigSmoke4/Aegis-Intelligent-Incident-Response-Digital-Operations-Platform' },
        ],
        footer: 'ASP.NET Core MVC · C# · PostgreSQL · Redis · EF Core · Docker · xUnit',
      },
      {
        id: 'nirbhor',
        no: '12',
        title: 'NIRBHOR',
        tagline: 'Bilingual AI Personal Administrative Agent',
        items: [
          { name: 'NIRBHOR', meta: 'Bilingual AI Agent', slug: 'nirbhor', link: 'https://github.com/BigSmoke4/NIRBHOR-Bilingual-AI-Personal-Administrative-Agent' },
        ],
        footer: 'ASP.NET Core MVC · C# · PostgreSQL · EF Core · Identity · SignalR · Anthropic',
      },
      {
        id: 'ecommerce',
        no: '13',
        title: 'Responsive E-Commerce',
        tagline: 'ASP.NET MVC Razor Views Application',
        items: [
          { name: 'E-Commerce', meta: 'ASP.NET MVC Application', slug: 'ecommerce', link: 'https://github.com/BigSmoke4/Responsive-Ecommerce-asp.net-MVC-razor-view' },
        ],
        footer: 'ASP.NET MVC · C# · Razor Views · Entity Framework · SQL Server · HTML/CSS/JavaScript',
      },
    ],
  },
}

// Section cover images (full-height cover on left side of each card in horizontal gallery). Place in public/works/covers/.
// When image missing, left column uses large number gradient placeholder, auto-lights up after adding image.
export const SECTION_COVERS: Record<string, string> = {
  nexus: `${import.meta.env.BASE_URL}works/covers/nexus.jpg`,
  veritas: `${import.meta.env.BASE_URL}works/covers/veritas.jpg`,
  neura: `${import.meta.env.BASE_URL}works/covers/neura.jpg`,
  forge: `${import.meta.env.BASE_URL}works/covers/forge.jpg`,
  pulse: `${import.meta.env.BASE_URL}works/covers/pulse.jpg`,
  bdpricefinder: `${import.meta.env.BASE_URL}works/covers/bdpricefinder.jpg`,
  'local-agent': `${import.meta.env.BASE_URL}works/covers/local-agent.jpg`,
  atlas: `${import.meta.env.BASE_URL}works/covers/atlas.jpg`,
  aurora: `${import.meta.env.BASE_URL}works/covers/aurora.jpg`,
  sentinel: `${import.meta.env.BASE_URL}works/covers/sentinel.jpg`,
  aegis: `${import.meta.env.BASE_URL}works/covers/aegis.jpg`,
  nirbhor: `${import.meta.env.BASE_URL}works/covers/nirbhor.jpg`,
  ecommerce: `${import.meta.env.BASE_URL}works/covers/ecommerce.jpg`,
}

// Count works in a section (sum of items or groups), used for index row hover display
export function sectionCount(section: WorkSection): number {
  if (section.items) return section.items.length
  if (section.groups) return section.groups.reduce((n, g) => n + g.items.length, 0)
  return 0
}
