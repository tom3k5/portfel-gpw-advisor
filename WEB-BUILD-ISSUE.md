# Web App Build Issue

## Problem
The Next.js web app cannot build because of React Native compatibility issues with `react-native-paper`.

## Root Cause
- `react-native-paper` imports from `react-native`
- Next.js webpack needs to alias `react-native` to `react-native-web`
- The webpack alias `react-native$` (exact match) doesn't work for transitive dependencies
- The library resolution happens before webpack aliases are applied

## Attempted Solutions
1. Added webpack alias `'react-native$': 'react-native-web'` - didn't work
2. Used `@expo/next-adapter` with `withExpo()` - didn't work
3. Added babel plugin `react-native-web` - caused dist/exports path issues
4. Manually added dist/exports aliases - files exist but resolution still fails

## Recommended Solutions (for later)
1. **Option A**: Create platform-specific component versions (`.web.tsx` files) that don't use react-native-paper
2. **Option B**: Use a different UI library for web (e.g., MUI, Chakra UI) and keep react-native-paper for mobile only
3. **Option C**: Fork or patch react-native-paper to work better with webpack
4. **Option D**: Use Expo for Web instead of Next.js (simpler compatibility)

## Current Status
- Mobile app (Expo) is the primary target and should work fine
- Web app is secondary and can be fixed in a later iteration
- For now, focus on testing and developing the mobile app

## Files Modified
- `apps/web/next.config.js` - Added webpack config
- `apps/web/src/app/page.tsx` - Removed react-native-paper Button
- `apps/web/src/app/import/page.tsx` - Converted to web-friendly HTML/CSS
- Shared UI components still use react-native-paper (intended for mobile)

## Next Steps
1. Test mobile app with Expo
2. Develop features for mobile first
3. Come back to web compatibility later in the project
