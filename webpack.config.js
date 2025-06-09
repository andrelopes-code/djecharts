const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        main: "./src/frontend/main.ts",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "./src/djecharts/static/djecharts/js"),
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
};
