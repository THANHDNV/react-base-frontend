const path = require('path')
const htmlwp = require('html-webpack-plugin')
const {CleanWebpackPlugin: cleanwp} = require('clean-webpack-plugin')

module.exports = function(env) {
    const envConfig = require(`./webpack.config.${env}`);
    return {
        ...{
            entry: {
                main: [
                    '@babel/polyfill',
                    './src/app.js'
                ]
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-env', '@babel/preset-react']      
                                }
                            }
                        ]
                    },
                    {
                        test: /\.(css|sass|)$/,
                        use: [
                            {
                                loader: 'style-loader'
                            },
                            {
                                loader: 'css-loader'
                            }
                        ]
                    },
                    {
                        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                        use: [
                          {
                            loader: 'file-loader',
                            options: {
                              name: '[name].[ext]',
                              outputPath: 'fonts/'
                            }
                          }
                        ]
                    },
                    {
                        test: /\.(png|jpe?g|gif)$/i,
                        loader: 'file-loader',
                        options: {
                          outputPath: 'images',
                        },
                    },
                ]
            },
            plugins:[
                new cleanwp(),
                new htmlwp(),
            ],
            output: {
                filename: '[hash].js',
                publicPath: "/"
            }
        },
        ...envConfig
    }
}