const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const srcPath = './src/ts';
const outPath = './public';
const tsPath = `${process.cwd()}/${srcPath}/**/*.ts`;
const prelen = process.cwd().length + srcPath.length;
const entries = glob.sync(tsPath)
  .filter(name => !/\.d\.ts$/.test(name))
  .map(name => name.replace('/./', '/').slice(prelen, -3));

console.log('\x1B[33mbuilding...\x1B[0m');

/** @type {webpack.Configuration} */
const config = {
  watch: true,
  devtool: 'inline-source-map',
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
  ],
  resolve: {
    alias: {
      '@css': `${__dirname}/src/css`,
      '@components': `${__dirname}/src/components`,
    },
  },
  stats: {
    preset: 'minimal',
    assets: false,
    modules: false,
  },
};

module.exports = (env, args) => {
  if (args.mode === 'production') {
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
          configFile: `${srcPath}/tsconfig.json`,
        },
      }));
  }
  return config;
};
