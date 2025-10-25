# Etap 1, Week 1: Setup & Architecture

## Goal
Set up development environment and project structure.

## Team
- Frontend/Mobile Developer
- Backend Developer

## Tasks

### Day 1-2: Project Initialization
- [ ] Create new repository
- [ ] Initialize Turborepo
- [ ] Set up folder structure (apps/expo, apps/web, packages/*)
- [ ] Configure TypeScript strict mode
- [ ] Set up ESLint and Prettier
- [ ] Configure Git hooks (Husky)

**Commands to use:**
```bash
/setup-monorepo
```

### Day 3: Mobile App Setup
- [ ] Initialize Expo project in apps/expo
- [ ] Configure app.json (name, bundle ID, permissions)
- [ ] Set up React Navigation
- [ ] Create basic screen structure
- [ ] Test on iOS and Android simulators

**Deliverable:** Mobile app showing "Hello World" on both platforms

### Day 4: Web App Setup
- [ ] Initialize Next.js project in apps/web
- [ ] Configure React Native Web
- [ ] Set up routing
- [ ] Test in browser
- [ ] Ensure shared components work

**Deliverable:** Web app running on localhost:3000

### Day 5: Backend Setup
- [ ] Initialize Express.js server
- [ ] Set up PostgreSQL database
- [ ] Configure database migrations (Prisma/TypeORM)
- [ ] Create basic health check endpoint
- [ ] Set up environment variables

**Deliverable:** Backend API responding to GET /health

### Day 6: Integration & Testing
- [ ] Create shared UI package
- [ ] Create shared logic package
- [ ] Test Turborepo build pipeline
- [ ] Verify all apps can import shared packages
- [ ] Write basic smoke tests
- [ ] Set up CI/CD (GitHub Actions)

**Test build:**
```bash
npm run build
npm test
```

## Definition of Done
✅ All apps run successfully on local machines
✅ Turborepo caching works correctly
✅ TypeScript compiles without errors
✅ ESLint passes with no warnings
✅ Basic CI/CD pipeline runs
✅ Documentation updated (README, setup instructions)

## Blockers & Risks
- Expo SDK version compatibility
- React Native Web quirks
- Team unfamiliar with Turborepo

## Next Week Preview
Week 2 will focus on implementing the core dashboard UI with portfolio table and charts.
