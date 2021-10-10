const path = require('path');
const mode = process.env.NODE_ENV !== 'production'
const CompassImageHelperPlugin = require('../index');

module.exports = {
  entry:
      ['./test/entry.js'],
  output: {
    filename: 'out.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },
  plugins: [
  new CompassImageHelperPlugin({
    targetFile: './dist/_images.scss',
    images_path: './test/images/',
    pattern: '**/*',
    css_path: 'images/',
    sizeLimit: 10240, // size limit for image embedding
    prefix: 'icon--'
  })
],
  module: {
    rules: [
  
    ]
  }
};