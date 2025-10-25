# Portfel GPW Advisor - Project Context

## Project Overview
Innowacyjna aplikacja mobilna i webowa dla inwestorów indywidualnych na GPW, dostarczająca spersonalizowane raporty oparte na AI dwa razy dziennie.

## Tech Stack
- **Architektura**: Monorepo (Turborepo)
- **Mobile**: React Native + Expo (apps/expo)
- **Web**: Next.js + React Native Web (apps/web)
- **Shared Packages**:
  - packages/ui - komponenty UI
  - packages/logic - logika biznesowa, algorytmy AI/ML
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **AI/ML**: Torch.js, Python (SciPy/PyTorch)
- **Real-time**: WebSockets

## External APIs
- Polygon.io (dane real-time GPW)
- X API (sentiment analysis)
- Ortex (short interest data)

## Development Phases
1. **Etap 1** (6 tygodni): Core & Usability - podstawowy dashboard, ręczne zarządzanie portfelem
2. **Etap 2** (6 tygodni): Data & Analysis - real-time data, sentiment analysis
3. **Etap 3** (8 tygodni): Intelligence & Optimization - LSTM predictions, portfolio optimization

## Key Features
- Portfolio management (manual + CSV import)
- Real-time price updates (Polygon.io WebSocket)
- Sentiment analysis from X
- AI-powered price predictions (LSTM)
- Portfolio optimization (Markowitz + ML)
- Push notifications (8:00 & 16:00 CET)
- Backtesting capabilities

## Business Model
- **Free**: Basic portfolio management, static reports
- **Premium**: Auto-sync with brokers, advanced AI reports, real-time alerts, auto-trading

## Target KPIs
- 10,000 active users in 12 months
- 40% retention after 3 months
- 60% users outperforming WIG20
- 5% conversion to premium in 6 months

## Current Phase
**Etap 1**: Foundation & Usability (Week 1-6)
