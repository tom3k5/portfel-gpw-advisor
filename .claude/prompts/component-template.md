# React Component Template

Use this template when creating new UI components for Portfel GPW Advisor.

## Component Structure

```typescript
// packages/ui/src/components/[ComponentName].tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface [ComponentName]Props {
  // Define props with TypeScript
}

export const [ComponentName]: React.FC<[ComponentName]Props> = (props) => {
  return (
    <View style={styles.container}>
      {/* Component JSX */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles here
  },
});
```

## Requirements
- ✅ TypeScript with strict typing
- ✅ Props interface exported
- ✅ React.FC or React.memo for performance
- ✅ StyleSheet for styling (cross-platform compatible)
- ✅ Accessibility props (accessibilityLabel, accessibilityRole)
- ✅ Test file in __tests__ folder
- ✅ Storybook story (optional for Etap 1)

## Styling Guidelines
- Use React Native Paper theme colors
- Support light/dark mode
- Responsive design (mobile + web)
- Use spacing units: 4, 8, 16, 24, 32

## Example Test
```typescript
// packages/ui/src/components/__tests__/[ComponentName].test.tsx
import { render } from '@testing-library/react';
import { [ComponentName] } from '../[ComponentName]';

describe('[ComponentName]', () => {
  it('renders correctly', () => {
    const { getByText } = render(<[ComponentName] />);
    // Assertions
  });
});
```
