const cli = require('commander');
const path = require('path');

const utils = require('./utils');
const pkg = require('./package.json');

let settings = {};

cli
	.version(pkg.version)
	.option('-f, --source <folders>', 'Specify the folder to get the source files from')
	.option('-o, --output <output>', 'Specify the full path to the output file, including name')
	.option('-i, --isolate', 'Puts every file content inside an anonymous function')
	.option('-s, --sort', 'Sort the file paths alphabetically before creating the bundle');

cli.on('option:source', (src) => {
	src = path.resolve(src);

	if (!utils.isDir(src)) {
		return utils.log('error', `Cannot access directory: ${src}`);
	}

	settings.files = src;
});

cli.on('option:output', (output) => {
	// ...
});

cli.parse(process.argv);