const path = require('path');
const postPreset = require('postcss-preset-env');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.MODE ?? 'development';
const devMode = mode === 'development';

const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
  mode,
  target,
  devtool,
  context: path.join(__dirname, 'src'),
  entry: ['@babel/polyfill', './js/app.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'assets/[hash][ext]',
    clean: true,
  },
  devServer: {
    port: 3000,
    open: true,
    hot: true,
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: 'index.ejs',
      filename: 'index.html',
      title: 'Home'
    }),
    new MiniCSSExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: ['html-loader']
      },
      {
        test: /\.(s*)css$/i,
        use: [
          devMode ? 'style-loader' : MiniCSSExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [postPreset],
              }
            }
          },
          'sass-loader',
        ]
      },
      {
        test: /\.(ttf|woff?2)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(jpe?g|png|webp|gif|svg|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'image/[hash].[ext]'
        }
      },
      {
        test: /\.m?js$/i,
        exclude: /(node_modules|bower_components)/i,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.ejs$/i,
        use: ['html-loader', 'template-ejs-loader'],
      }
    ],
  },
}
