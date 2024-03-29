import CopyPlugin from 'copy-webpack-plugin';
import glob from 'glob';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import type { Configuration } from 'webpack';

const projectPath = __dirname;
const distPath = `${projectPath}/dist`;
const srcPath = `${projectPath}/src`;
const viewsPath = `${projectPath}/views`;
const scriptsPath = `${srcPath}/scripts`;
const pagesPath = `${srcPath}/pages`;

const entries = glob.sync(`${scriptsPath}/**/*.ts`)
  .filter(name => !/\.d\.ts$/.test(name))
  .map(name => name.slice(scriptsPath.length + 1, -3));

const pages = glob.sync(`${pagesPath}/**/*.ejs`)
  .map(name => name.slice(pagesPath.length + 1, -4));

const htmls = pages.map(name => (
  new HtmlWebpackPlugin({
    chunks: [name],
    publicPath: '/',
    base: '',
    template: `${pagesPath}/${name}.ejs`,
    filename: `${viewsPath}/${name}.ejs`,
  })
));

console.log('\x1B[33mbuilding...\x1B[0m');

const config: Configuration = {
  mode: 'development',
  watch: true,
  devtool: 'inline-source-map',
  entry: Object.fromEntries(entries.map(name => (
    [name, [`${scriptsPath}/${name}.ts`]]
  ))),
  output: {
    filename: 'javascripts/[name].js',
    path: distPath,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxSize: 25000,
    },
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
        test: /\.ejs$/,
        loader: 'html-loader',
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(svg|eot|woff|woff2|ttf|jpg|png|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[hash][ext][query]',
        },
      },
    ],
  },
  plugins: [
    ...htmls,
    new MiniCssExtractPlugin({
      filename: 'stylesheets/[name].css',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public' },
      ],
    }),
  ],
  resolve: {
    roots: [srcPath],
    modules: [
      'node_modules',
      srcPath,
    ],
    extensions: ['.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin(),
    ],
  },
  stats: {
    preset: 'minimal',
    assets: false,
    modules: false,
  },
};

export default config;
