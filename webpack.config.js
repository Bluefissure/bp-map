const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    app: [
        './src/index.tsx',
      ],
  },
  mode: 'development',
  output: {
    filename: '[name].entry.js',
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
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'javascript/auto',
            use: [
                'file-loader',
                'webp-loader'
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
    compress: true,
    port: 9000,
  },
};