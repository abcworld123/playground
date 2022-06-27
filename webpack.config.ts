import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import glob from 'glob';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import type { Configuration } from 'webpack';
import type { CallableOption } from 'webpack-cli';

const srcPath = './src';
const outPath = './public';
const tsPath = `${process.cwd()}/${srcPath}/ts/**/*.ts`;
const prelen = process.cwd().length + srcPath.length + 3;
const entries = glob.sync(tsPath)
  .filter(name => !/\.d\.ts$/.test(name))
  .map(name => name.replace('/./', '/').slice(prelen, -3));

console.log('\x1B[33mbuilding...\x1B[0m');

const config: Configuration = {
  watch: true,
  devtool: 'inline-source-map',
  entry: Object.fromEntries(entries.map((path) => [path, `${srcPath}/ts/${path}.ts`])),
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
  ],
  resolve: {
    alias: {
      '@css': `${__dirname}/src/css`,
    },
    modules: [
      `${__dirname}/src`,
      'node_modules',
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

const configWithMode: CallableOption = (env, argv) => {
  if (argv.mode === 'production') {
    config.watch = false;
    config.devtool = false;
    config.stats = {};
    config.plugins.push(
      new ForkTsCheckerWebpackPlugin({
        logger: {
          log: () => {},
          error: console.error,
        },
        typescript: {
          configFile: './tsconfig.json',
        },
      }));
  }
  return config;
};

export default configWithMode;
