var assert = require('assert');
var webpack = require('webpack');
var fs = require('fs');
var options = require('./webpack.config.js');

describe('Array', function() {
  describe('#runPlugin()', function() {
    webpack(options, function(err, stats) {
      if (err) {
        console.log(err)
      }
    })
    var size = 8946;
    it('should generate a file ', function() {
      var fstats = fs.statSync('./dist/_images.scss')
      assert.notEqual(null, fstats)
    });
    it('should generate a file of ' + size + ' bytes', function() {
      var fstats = fs.statSync('./dist/_images.scss')
      assert.equal(size, fstats.size)
    });
  });
});
