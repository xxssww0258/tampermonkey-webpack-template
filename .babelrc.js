module.exports = {
    presets: [
        [
            '@babel/preset-env', // ES6转换ES5的语法转换规则
            {
                modules: false,
            },
        ],
        ['@babel/preset-typescript'],
    ],
    plugins: [],
}
