const path = require(‘path’);
const HtmlWebpackPlugin = require(‘html-webpack-plugin’);

module.exports = {
mode: ‘production’,
entry: ‘./src/index.jsx’,
output: {
path: path.resolve(__dirname, ‘dist’),
filename: ‘bundle.js’,
},
module: {
rules: [
{
test: /.jsx?$/,
exclude: /node_modules/,
use: {
loader: ‘babel-loader’,
options: {
presets: [’@babel/preset-react’]
}
}
},
{
test: /.(png|jpg|jpeg|gif|mp3|wav|ogg)$/,
type: ‘asset/resource’,
generator: {
filename: ‘assets/[name][ext]’
}
}
]
},
plugins: [
new HtmlWebpackPlugin({
template: ‘./src/index.html’
})
],
resolve: {
extensions: [’.js’, ‘.jsx’]
},
target: ‘electron-renderer’
};