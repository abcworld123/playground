import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { globSync } from 'glob';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { PurgeCSSPlugin } from 'purgecss-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import type { Configuration } from 'webpack';

const projectPath = __dirname;
const distPath = `${projectPath}/dist`;
const srcPath = `${projectPath}/src`;
const viewsPath = `${projectPath}/views`;
const scriptsPath = `${srcPath}/scripts`;
const pagesPath = `${srcPath}/pages`;

const entries = globSync(`${scriptsPath}/**/*.ts`)
  .filter(name => !/\.d\.ts$/.test(name))
  .map(name => name.slice(scriptsPath.length + 1, -3));

const pages = globSync(`${pagesPath}/**/*.ejs`)
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

const purgeExcludes = [
  /swal2-popup$/,
  /toast$/,
  /ver-line$/,
];

console.log('\x1B[33mbuilding...\x1B[0m');

const config: Configuration = {
  mode: 'production',
  devtool: false,
  entry: Object.fromEntries(entries.map(name => (
    [name, [`${scriptsPath}/${name}.ts`]]
  ))),
  output: {
    filename: 'javascripts/[name].[contenthash].js',
    path: distPath,
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxSize: 200000,
    },
  },
  performance: {
    assetFilter: (filename) => /\.(js|css)$/.test(filename),
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
        test: /\.(svg|eot|woff|woff2|ttf|jpg|png|gif|webp)$/,
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
      filename: 'stylesheets/[name].[contenthash].css',
    }),
    new PurgeCSSPlugin({
      paths: globSync(`${srcPath}/**/*`, { nodir: true }),
      safelist: {
        greedy: purgeExcludes,
      },
      blocklist: [],
      keyframes: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public' },
      ],
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
};

export default config;
