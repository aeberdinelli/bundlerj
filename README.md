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
npm install --save bundlerj
```

## Usage
Once you have your settings ready, you can just call the library:

```javascript
const bundle = require('bundlerj');

const SETTINGS = {
	// Your settings here
};

bundle(SETTINGS);
```
