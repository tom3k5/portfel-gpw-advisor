/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@portfel/ui', '@portfel/logic', 'react-native', 'react-native-web', 'react-native-paper', 'react-native-vector-icons', 'react-native-safe-area-context'],
  webpack: (config, { webpack }) => {
    // Add react-native-web alias
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };

    // Add platform extensions for react-native-web
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];

    // Ignore Expo-specific modules that don't work on web
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(expo-notifications|expo-document-picker|expo-device|expo-constants|@react-native-async-storage\/async-storage|@react-native-community\/datetimepicker)$/,
      })
    );

    return config;
  },
};

module.exports = nextConfig;
