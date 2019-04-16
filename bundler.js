const cli = require('commander');
const path = require('path');

const utils = require('./utils');
const pkg = require('./package.json');

let settings = {};

cli
	.version(pkg.version)
	.command('generate', 'Generates the bundled javascript file')
	.command('clear', 'Removes the last generated bundle')
	.option('-f, --source <folders>', 'Specify the folder to get the source files from')
	.option('-o, --output <output>', 'Specify the full path to the output file, including name')
	.option('-i, --isolate', 'Puts every file content inside an anonymous function')
	.option('-s, --sort', 'Sort the file paths alphabetically before creating the bundle')
	.option('--ignore-charset', 'Do not try to get the file charset (assumes everything is UTF-8, improves speed)');

cli.on('option:source', (src) => {
	src = path.resolve(src);

	if (!utils.isDir(src)) {
		return utils.log('error', `Cannot access directory: ${src}`);
	}

	settings.files = src;
});

cli.on('option:output', (output) => {
	settings.output = output;
});

cli.on('command:*', () => {
	utils.log('error', `Invalid command ${cli.args.join(' ')} - Use --help to see a list of available commands`);
});

cli.parse(process.argv);