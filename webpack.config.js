const path = require('path')

module.exports = {
    // plugins: [
    //     new webpack.ProvidePlugin({
    //         Globalize: "globalize"
    //     })
    // ],
    resolve: {
        alias: {
            'cldr$': 'cldrjs',
            'cldr': 'cldrjs/dist/cldr'
          }
    }
}