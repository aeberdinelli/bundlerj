# Bundler JS (bundlerj)
A simplified javascript bundler to generate a single file with all the app dependencies

## Options
The bundler receives parameters within an object, here's an example:

```javascript
const options = {
	/**
	 * The source to get your files from.
	 * You can use a string with a folder name or an array with folders
	 */
	"files": "src/",

	/**
	 * The route to the destination file
	 */
	"output": "dist/app.packed.js",

	/**
	 * You can add blacklist rules which will be translated into regex to ignore certain files
	 */
	"blacklist": [
		// If you have angular libs, you can ignore those from your packed app
		"^(.*)angular-(.*)$", 
		
		// Let's say you want to ignore all html or xml files
		"^(.*)\\.(html|xml)$" 
	],

	/**
	 * This puts every JS file content into an anonymous function.
	 * You should consider using this if you have several variables with the same names around more than one file.
	 * For example:
	 * 
	 * (function() {
	 *     console.log('Hello world');
	 * })();
	 */
	"isolate": true,

	/**
	 * Give some feedback to the console while creating the bundle
	 */
	"debug": true
}
```

## Install
Just run:
```
npm install --save-dev bundlerj
```

You can install it globally for using CLI in several proyects too:
```
npm install -g bundlerj
```

## Usage
### CLI
Some command line options are available.

```
Usage: bundler [options] [command]

Options:
  -V, --version           output the version number
  -g, --config <file>     Ignores everything else and uses a config file instead
  -f, --source <folders>  Specify the folder to get the source files from
  -o, --output <output>   Specify the full path to the output file, including name
  -i, --isolate           Puts every file content inside an anonymous function
  -s, --sort              Sort the file paths alphabetically before creating the bundle
  -p, --progress          Show progress
  --ignore-charset        Do not try to get the file charset (assumes everything is UTF-8, improves speed)
  -h, --help              output usage information

Commands:
  generate                Generates the bundled javascript file
  clear                   Clears the output file
  help [cmd]              display help for [cmd]
```

For example:
```
bundle generate --source src/js --output dist/bundle.js --progress
```

### Using the available method
```javascript
const bundle = require('bundlerj');

const SETTINGS = {
	// Your settings here
};

bundle(SETTINGS);
```

### Using gulp
You may setup a gulp task in order to build your bundle every time a file is updated:

```javascript
const gulp = require('gulp');
const bundler = require('bundlerj');

gulp.task('bundle-js', function() {
	bundler({
		// Settings
	});
});

gulp.task('default', ['bundle-js'], function() {
	gulp.watch('./src/js/**/*.js', ['bundle-js']);
});
```

That will watch changes in your `src/js` folder and then run the bundler.