module.exports = {
    presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        "@babel/preset-typescript"
    ],

    "plugins": [
        "@jochlain/babel-plugin-yaml"
    ]
};