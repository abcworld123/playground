const glob = require('glob');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const srcPath = './src/ts';
const outPath = './public';
const tsPath = `${process.cwd()}/${srcPath}/**/*.ts`;
const prelen = process.cwd().length + srcPath.length + 2;
const entries = glob.sync(tsPath)
  .filter(name => !/\.d\.ts$/.test(name))
  .map(name => name.slice(prelen, -3));

const mode = 'development';
// const mode = 'production';

const isDev = mode === 'development';
console.log('\x1B[33mbuilding...\x1B[0m');

/** @type {webpack.Configuration} */
module.exports = {
  watch: isDev,
  devtool: isDev ? 'inline-source-map' : false,
  entry: Object.fromEntries(entries.map((path) => [path, `${srcPath}/${path}.ts`])),
  output: {
    filename: 'javascripts/[name].js',
    path: `${__dirname}/${outPath}`,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
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
    new ForkTsCheckerWebpackPlugin({
      logger: {
        log: () => {},
        error: console.error,
      },
      typescript: {
        configFile: `${srcPath}/tsconfig.json`,
      },
    }),
  ],
  resolve: {
    alias: {
      '@css': `${__dirname}/src/css`,
      '@components': `${__dirname}/src/components`,
    },
  },
  stats: isDev ? {
    preset: 'minimal',
    assets: false,
    modules: false,
  } : {},
  mode,
};
