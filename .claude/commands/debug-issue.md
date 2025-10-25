---
description: Debug and fix an issue following systematic approach
---

You are debugging an issue in the Portfel GPW Advisor application.

**Context**: Use systematic debugging approach to identify root cause and fix.

**Your task**:
1. **Reproduce the Issue**:
   - Get exact steps to reproduce
   - Check which platform(s) affected (iOS/Android/Web)
   - Identify error messages or unexpected behavior
   - Determine if it's consistent or intermittent

2. **Gather Context**:
   - Check relevant logs (console, crash reports)
   - Review recent code changes (git log)
   - Check if related to external dependencies
   - Identify affected users (if production)

3. **Isolate the Problem**:
   - Use binary search (comment out code sections)
   - Add strategic console.log statements
   - Check network requests (if API-related)
   - Verify data flow through components

4. **Identify Root Cause**:
   - Analyze stack trace
   - Check for:
     - Type errors
     - Async/await issues
     - Race conditions
     - State management bugs
     - API integration problems
     - Platform-specific quirks

5. **Implement Fix**:
   - Write failing test first (TDD)
   - Implement minimal fix
   - Verify test passes
   - Check for side effects

6. **Verify Solution**:
   - Test on all affected platforms
   - Run full test suite
   - Check related functionality
   - Performance impact check

7. **Document**:
   - Add code comments explaining fix
   - Update tests
   - Add to CHANGELOG.md
   - Update docs if user-facing change

**Debugging Tools**:
- React DevTools (component state)
- Redux DevTools (if using Redux)
- Chrome DevTools / Safari Web Inspector
- React Native Debugger
- Flipper (for React Native)

**Common Issues to Check**:
- Unhandled promise rejections
- Memory leaks (event listeners not cleaned up)
- Incorrect TypeScript types
- Platform differences (iOS vs Android)
- API rate limiting
- Timezone handling (CET conversions)
- WebSocket disconnections
- State not updating (missing dependencies)

**Deliverable**: Fixed issue with test coverage and documentation
