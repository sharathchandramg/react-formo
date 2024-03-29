module.exports = {
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/transform-runtime',
    '@babel/plugin-transform-class-properties',
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
  ],
  env: {
    test: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
    },
  },
};
