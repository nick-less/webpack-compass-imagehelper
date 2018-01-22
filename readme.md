## webpack-compass-imagehelper


this is copied from https://github.com/phlppschrr/gulp-compass-imagehelper and adjusted to work with webpack instead of gulp, it lets
you use the compass image helper functions together with a webpack/sass-loader enviroment.


### plugin options

```javascript
new CompassImageHelperPlugin({
			targetFile: 'target/_images.scss',
			images_path: 'src/main/scss/',
			pattern: 'resources/**/*',
			css_path: 'images/',
			prefix: 'icon--'
		})
```


This plugin generates a helper .scss file, which you have to @import into your own sass project. 
The generated sass file acts as a polyfill: Inside the generated file is a sass map which contains all 
the image infos including a inlined data version. The default mustache template also outputs %placeholders for 
each image. Feel free to modify the template to your needs. Additional there are the following helper function which mimic 
the native functions from Compass:

### Supported Compass functions
* **inline-image($image):** Embeds the contents of an image directly inside your stylesheet. All images are currently base64 encoded, in a future version SVG images will be UTF-8 encoded.
* **image-width($image):** Returns the width of the image found at the path supplied by $image. Warning, some SVG images may fail here and return `null`.
* **image-height($image)** Returns the height of the image found at the path supplied by $image. Warning, some SVG images may fail here and return `null`.
* **image-url($image, $only-path: false, $cache-buster: false)**  
  Generates a path to an asset found relative to the project's images directory.
  Passing a true value as the second argument will cause only the path to be returned instead of a url() function
  The third argument is used to control the cache buster on a per-use basis. When set to false no cache buster will be used. When true a md5-hash of the file is appended to the url. When a string, that value will be used as the cache buster. Be sure to set `images_path` and `css_path` options.
* **image-exists($image):** Returns true if the image exists in our helper file. (Not part of compass, but still its here)
