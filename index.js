var fs = require('fs');
var write = require('write');
var path = require('canonical-path');
var mustache = require('mustache');
var sizeOf = require('image-size');
var mime = require('mime');
var md5 = require('md5');
var appRoot = require('app-root-path').path;
var glob = require("glob");

function createImageAssetFile (options) {
		var images = [];
		  //var images_path = options.images_path || '';

		  if (!options) options = {};

		  if (!options.template)
		    options.template = path.join(__dirname, 'compass-imagehelper.mustache');

		  if (!options.targetFile)
		    options.targetFile = '_compass-imagehelper.scss';

		  if (!options.prefix)
		    options.prefix = '';

		  var template = fs.readFileSync(options.template).toString();



		  var pathPrefix = function () {
		    var result = '';
		    if (options.http_images_path) {
		      result = options.http_images_path;
		    } else if (options.css_path && options.images_path) {
		      // relative path from css folder to images
		      result = path.relative(options.css_path, options.images_path);
		    } else if (options.images_path) {
		      // relative from project url
		      result = path.relative(appRoot, options.images_path);
		    }

		    // make sure pathPrefix ends with a trailing slash
		    if (result && result.substr(-1) != '/') {
		      result = result + '/';
		    }

		    return result;
		  };

		  var bufferContents = function (file) {
		  
		    if (!options.images_path) {
		      // autodetect images_path with the first file
		      options.images_path = path.relative(appRoot, file.base);
		    }

		    var imageInfo = {};
		    var data;
		    var encoding;

		    var mimetype = mime.getType(file.path);
		    var dimensions;

		    if (mimetype == 'image/svg+xml') {
		      data = file.contents.toString()
		          .replace(/"/g, '\'')
		          .replace(/%/g, '%25')
		          .replace(/</g, '%3C')
		          .replace(/>/g, '%3E')
		          .replace(/&/g, '%26')
		          .replace(/#/g, '%23')
		          .replace(/\s+/g, ' ')
		          .trim();
		      encoding = 'charset=US-ASCII';
		      dimensions = sizeOf(file.path);
		    } else {
		      data = file.contents.toString('base64');
		      encoding = 'base64';
		      dimensions = sizeOf(file.path);
		    }

		    imageInfo.width = dimensions.width;
		    imageInfo.height = dimensions.height;
		    imageInfo.mime = mimetype;
		    imageInfo.filename = path.basename(file.path);
		    imageInfo.basename = path.basename(file.path, path.extname(file.path));
		    imageInfo.dirname = path.basename(path.dirname(file.path));
		    imageInfo.ext = path.extname(file.path);
		    imageInfo.path = path.relative(options.images_path, file.path);
		    imageInfo.fullname = imageInfo.path.replace(/[\/\\\.]/g, '-'); // Replace /, \, and . with -
		    imageInfo.fullname = imageInfo.fullname.replace(/@/g, '\\@'); // Escape @
		    if (!isNaN(parseInt(imageInfo.fullname, 10))) {
		      // classnames must not start with an unescaped number.
		      // Instead of escaping we simply prefix starting numbers by '_'
		      imageInfo.fullname = '_' + imageInfo.fullname;
		    }

		    imageInfo.hash = md5(file.contents);
		    imageInfo.data = 'url("data:' + mimetype + ';' + encoding + ',' + data + '")';

		    images.push(imageInfo);

		  };

 		glob(options.images_path+options.pattern, function (er, files) {
  				for (var i = 0; i < files.length; i++) {
			 		bufferContents({path:files[i],contents:fs.readFileSync(files[i]), base:''})
				}
			   var fullPath =  options.targetFile;
				write.sync(fullPath, 
				new Buffer(mustache.render(template, {
		        	prefix: options.prefix,
		        	path_prefix: pathPrefix(),
		        	items: images,
		      })));
		      console.log("webpack-compass-imagehelper: "+fullPath+" written for "+files.length+" images");
			})

	/*
      
		*/

	}
	

function CompassImageHelperPlugin(options) {
	createImageAssetFile (options);

}

CompassImageHelperPlugin.prototype.apply = function(compiler) {

	/*
	compiler.plugin("compilation", function(compilation) {
	}); 
	compiler.plugin('emit', (compilation, done) => {
	    for (const filename in compilation.assets) {
	      const hash = crypto.createHash("md5");
	      hash.update(compilation.assets[filename].source());
	      const md5 = hash.digest('hex');

	      // Fingerprint .md5 file
	      compilation.assets[`${filename}.md5`] = {
	        source: () => md5,
	        size: () => md5.length,
	      };

	      // Identical to original file but with hash prepended.
	      compilation.assets[`${md5}-${filename}`] = compilation.assets[filename];
	    };
	    done();
	});
	*/
	
};

module.exports = CompassImageHelperPlugin;
