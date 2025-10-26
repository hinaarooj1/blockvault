module.exports = {
  // ... your existing config
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
    alias: {
      // Add any aliases you need
    },
    mainFields: ['browser', 'module', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
};