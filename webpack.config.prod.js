const uglifywp = require('uglifyjs-webpack-plugin')

module.exports = {
    mode: 'production',
    optimization: {
        minimizer: [
            new uglifywp({
                extractComments: true
            })
        ]
    }
}