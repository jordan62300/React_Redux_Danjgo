module.exports = {
    module: {
        rules : [
            {
                test: /\.js$/,
                exclude: /nodde_modules/,
                use: {
                    loarder: "babel-loader"
                }
            }
        ]
    }
}