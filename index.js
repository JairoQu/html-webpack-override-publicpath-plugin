const { ReplaceSource } = require('webpack-sources');

const PLUGIN_NAME = 'HtmlWebpackOverridePublicPathPlugin';


class HtmlWebpackOverridePublicPathPlugin {
  constructor() {
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      if(compilation.hooks) {
        const resolvePath = path => {
          if (typeof path !== 'string') return;
          if (path.length && path.substr(-1, 1) !== '/') {
            path += '/';
          }
          return path;
        }

        if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
          compilation.hooks.htmlWebpackPluginAlterChunks.tap(PLUGIN_NAME, (chunks, htmlPluginData) => {
            const oldPublicPath = compilation.options.output.publicPath;
            const newPublicPath = resolvePath(htmlPluginData.plugin.options.publicPath);
            if (typeof newPublicPath !== 'string' || typeof oldPublicPath !== 'string' || oldPublicPath === '/') {
              return;
            }
            chunks.forEach((chunk) => {
              chunk.files.forEach((file) => {
                if (file.endsWith('.js')) {
                  const _source = new ReplaceSource(compilation.assets[file]);
                  const _jsStart = _source.source().indexOf('"' + oldPublicPath + '"');
                  _jsStart !== -1 && _source.replace(_jsStart, _jsStart + oldPublicPath.length + 1, '"' + newPublicPath + '"');
                  compilation.updateAsset(file, _source)
                }
              });
            });       
          });

          compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(PLUGIN_NAME, (htmlPluginData) => {
            const oldPublicPath = compilation.options.output.publicPath;
            let newPublicPath = htmlPluginData.plugin.options.publicPath;
            if (typeof newPublicPath !== 'string' || typeof oldPublicPath !== 'string') {
              return;
            }
            newPublicPath = resolvePath(newPublicPath);
  
            const changeTagAttr = (tag, oldPublicPath, newPublicPath) => {
              if (tag.tagName === 'link') {
                tag.attributes.href = tag.attributes.href.replace(new RegExp('^' + oldPublicPath), newPublicPath);
              } else if (tag.tagName === 'script') {
                tag.attributes.src = tag.attributes.src.replace(new RegExp('^' + oldPublicPath), newPublicPath);
              }
              return tag;
            };

            htmlPluginData.head = htmlPluginData.head.map(tag => {
              return changeTagAttr(tag, oldPublicPath, newPublicPath);
            });
  
            htmlPluginData.body = htmlPluginData.body.map(tag => {
              return changeTagAttr(tag, oldPublicPath, newPublicPath);
            });
          });
        } else {
          throw new Error('html-webpack-extra-plugin can only work with html-webpack-plugin 3.x.x');
        }
      } else {
        // webpack 3.x and earlier
        throw new Error(`${PLUGIN_NAME} can only work with webpack 4.x and later`);
      }
    });
  }
}

module.exports = HtmlWebpackOverridePublicPathPlugin;