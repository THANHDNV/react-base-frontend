const path = require('path')
const htmlwp = require('html-webpack-plugin')
const {CleanWebpackPlugin: cleanwp} = require('clean-webpack-plugin')

module.exports = function(env) {
    const envConfig = require(`./webpack.config.${env}`);
    return {
        ...{
            entry: './src/app.js',
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
                            }, 
                            {
                                loader: 'sass-loader'
                            }
                        ]
                    }
                ]
            },
            plugins:[
                new cleanwp(),
                new htmlwp(),
            ],
            output: {
                path: path.resolve(__dirname, 'dist'),
                filename: '[hash].js'
            }
        },
        ...envConfig
    }
}