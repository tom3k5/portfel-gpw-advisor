---
description: Initialize Turborepo monorepo with all required packages
---

You are setting up the initial monorepo structure for Portfel GPW Advisor.

**Context**: This is a cross-platform investment app using Turborepo monorepo architecture.

**Your task**:
1. Initialize Turborepo with the following structure:
   - `apps/expo` - React Native mobile app (iOS + Android)
   - `apps/web` - Next.js web application with React Native Web
   - `packages/ui` - Shared UI components
   - `packages/logic` - Shared business logic and AI/ML algorithms
   - `packages/typescript-config` - Shared TypeScript configurations
   - `packages/eslint-config` - Shared ESLint configurations

2. Configure each package with:
   - TypeScript (strict mode)
   - ESLint + Prettier
   - Appropriate dependencies for each app type

3. Set up Turborepo build pipeline for optimal caching

4. Create initial folder structure following best practices:
   - `src/components` for UI components
   - `src/screens` for app screens (in apps)
   - `src/utils` for utilities
   - `src/types` for TypeScript definitions

5. Add essential scripts to root package.json:
   - `dev` - run all apps in development
   - `build` - build all packages
   - `test` - run all tests
   - `lint` - lint all code

**Expected deliverable**: Fully functional monorepo that can be built and run locally.

**Tech stack reference**: Turborepo, React Native (Expo), Next.js, TypeScript, ESLint, Prettier
