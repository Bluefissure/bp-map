const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (env) => {
  let mode = env.production ? 'production' : 'development';
  if (env.CF_PAGES) {
    mode = 'production';
  }
  console.log('Build Mode: ', mode);
  return {
    entry: {
      app: [
        './src/index.tsx',
      ],
    },
    mode,
    output: {
      filename: '[chunkhash].[name].entry.js',
      path: path.resolve(__dirname, 'public/'),
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: 'javascript/auto',
          use: [
            'file-loader'
          ].map((loader) => ({
            loader,
            options: {
              outputPath: 'static/assets/',
              publicPath: 'static/assets/',
            }
          })),
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
          ],
          generator: {
            outputPath: 'static/css/',
            publicPath: 'static/css/',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/index.html'
      })
    ],
    devServer: {
      historyApiFallback: true,
      compress: true,
      port: 9000,
    },
  };
};