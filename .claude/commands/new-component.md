---
description: Create a new UI component with tests and documentation
---

You are creating a new reusable UI component for Portfel GPW Advisor.

**User will provide:**
- Component name (e.g., "StockCard", "PriceIndicator")
- Component purpose and requirements
- Props specifications

**Your task:**
1. Create component file in `packages/ui/src/components/[ComponentName].tsx`:
   - Use TypeScript with strict typing
   - Export Props interface
   - Implement component with React.FC or React.memo
   - Use React Native StyleSheet
   - Add accessibility labels
   - Support light/dark theme (React Native Paper)

2. Create test file in `packages/ui/src/components/__tests__/[ComponentName].test.tsx`:
   - Test rendering with default props
   - Test all prop variations
   - Test user interactions (if applicable)
   - Test accessibility
   - Aim for >80% coverage

3. Update exports in `packages/ui/src/index.ts`:
   - Export component
   - Export Props interface

4. Create usage documentation:
   - Props description
   - Usage examples
   - Visual examples (if complex)

**Template to follow:**
Reference `.claude/prompts/component-template.md`

**Cross-platform requirements:**
- Must work on iOS, Android, and Web
- Responsive design
- Performance optimized (avoid unnecessary re-renders)

**Deliverable:**
- Working component
- Comprehensive tests
- Updated exports
- Usage documentation
