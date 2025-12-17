# Lumina R - Risk Intelligence Platform

**Lumina R** is an intelligent risk management platform designed for SMEs (Small and Medium Enterprises). It's the sister product to **Lumina S**, sharing the same design language while focusing specifically on risk identification, assessment, and mitigation.

## Features

- **Risk Dashboard** - Real-time overview of your organization's risk landscape
- **Risk Heat Map** - Visual probability vs impact matrix
- **Risk Register** - Comprehensive tracking of identified risks
- **AI Risk Coach** - Intelligent insights and recommendations powered by AI
- **Risk Analytics** - Trends and patterns in your risk data
- **Reports** - Generate and export risk reports

## Design Philosophy

Lumina R shares the core design principles of the Lumina product family:
- Clean, modern UI with excellent readability
- Consistent component library and interaction patterns
- Professional color palette with semantic risk indicators

### Distinctive Elements for Lumina R
- **Primary Color**: Deep Violet/Indigo (#7c3aed) - conveying trust and protection
- **Risk Indicators**: Semantic colors for risk levels (emerald for low, amber for medium, red for high/critical)
- **Shield Iconography**: Emphasizing protection and risk mitigation
- **AI Coach Widget**: Unique to Lumina R for intelligent risk guidance

## Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/       # Layout components (Sidebar, Header, Layout)
│   ├── ui/           # Reusable UI components (Button, Card, Badge)
│   └── dashboard/    # Dashboard-specific components
├── pages/            # Page components
├── types/            # TypeScript type definitions
├── lib/              # Utilities and sample data
└── hooks/            # Custom React hooks
```

## The Lumina Family

- **Lumina S** - Scheduling & Service Management
- **Lumina R** - Risk Intelligence Platform (this project)

Both products share design DNA while serving distinct business needs.
