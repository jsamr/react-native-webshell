module.exports = {
  presets: ['module:metro-react-native-babel-preset', '@babel/typescript'],
  plugins: [
    [
      'babel-plugin-inline-import',
      {
        extensions: ['.webjs']
      }
    ],
    '@babel/plugin-transform-react-jsx'
  ]
};
