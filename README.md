# html-webpack-extra-plugin  
This plugin can override output.publicPath, and it can only work with html-webpack-plugin 3.x.x  

## Installation  
```
npm i -D html-webpack-extra-plugin
```

## Usage  

Simply add the plugin behind the HtmlWebpackPlugin:  

#### webpack.config.js  

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExtraPlugin = require('html-webpack-extra-plugin');

module.exports = {
   entry: 'index.js',
   output: {
     path: __dirname + '/dist',
     filename: 'index_bundle.js'
   },
   plugins: [
     new HtmlWebpackPlugin({
        publicPath: 'https://xxx.com' // override output.publicPath here
     }),
     new HtmlWebpackExtraPlugin()
   ]
 };
```
