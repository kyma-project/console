const path = require('path');
const theme = require('./config/theme');
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin');
const { generateCSSReferences, generateJSReferences } = MiniHtmlWebpackPlugin;

module.exports = {
  sections: [
    {
      name: 'Components',
      ignore: [
        '**/__tests__/**',
        '**/components/index.js',
        'src/components/ThemeWrapper/index.js',
      ],
      components: 'src/components/**/index.js',
      description: '',
    },
  ],
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'src/components/ThemeWrapper'),
  },
  styleguideDir: 'docs',

  title: 'ReactJS UI Components library for Kyma',
  theme: {
    color: {
      base: theme.colors.text,
      light: theme.colors.textLight,
      lightest: theme.colors.chrome200,
      link: theme.colors.link,
      linkHover: theme.colors.linkHover,
      border: theme.colors.chrome200,
      name: theme.colors.green,
      type: theme.colors.purple,
      error: theme.colors.red,
      baseBackground: theme.colors.chrome000,
      codeBackground: 'pink',
      sidebarBackground: theme.colors.chrome100,
    },
    fontFamily: {
      base: theme.fonts.primary,
    },
    fontSize: {
      base: 12,
      text: 16,
      small: 14,
      h1: 40,
      h2: 36,
      h3: 32,
      h4: 28,
      h5: 24,
      h6: 20,
    },
  },
};
