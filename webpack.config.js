const { Configuration } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

// path
const srcPath = './src/ts';
const distPath = './public';

// entries
const ts = [
  'home',
  'random/random',
  'jebi/jebi',
  'weather/weather',
];

console.log('\x1B[33mbuilding...\x1B[0m');

/** @type {Configuration} */
module.exports = {
  watch: true,
  entry: Object.fromEntries(ts.map((path) => [path, `${srcPath}/${path}.ts`])),
  output: {
    filename: 'javascripts/[name].js',
    path: path.resolve(__dirname, distPath),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(svg|eot|woff|woff2|ttf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext][query]',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'stylesheets/[name].css',
    }),
  ],
  resolve: {
    alias: {
      '@css': path.resolve(__dirname, 'src/css'),
    },
  },
  stats: {
    preset: 'minimal',
    assets: false,
    modules: false,
  },
  
  // mode: 'production',
  mode: 'development',
};
