#!/usr/bin/env node
const cli = require('commander');
const path = require('path');
const clui = require('clui');
const clear = require('clear');

const bundle = require('./index');
const utils = require('./utils');
const pkg = require('./package.json');

let settings = {};

cli
	.version(pkg.version)
	.command('generate', 'Generates the bundled javascript file')
	.command('clear', 'Clears the output file')
	.option('-g, --config <file>', 'Ignores everything else and uses a config file instead')
	.option('-f, --source <folders>', 'Specify the folder to get the source files from')
	.option('-o, --output <output>', 'Specify the full path to the output file, including name')
	.option('-i, --isolate', 'Puts every file content inside an anonymous function')
	.option('-s, --sort', 'Sort the file paths alphabetically before creating the bundle')
	.option('-p, --progress', 'Show progress')
	.option('--ignore-charset', 'Do not try to get the file charset (assumes everything is UTF-8, improves speed)');

cli.on('command:clear', () => {
	bundle({justClear: true});
});

cli.on('command:generate', () => {
	bundle(
		settings, 
		function processedCallback(current, total) {
			if (!settings.progress) {
				return;
			}

			clear();
			
			let bar = new clui.Progress(process.stdout.columns - 10);
			console.log(bar.update(current, total).replace(/\|/g, '=').replace(/=([^=\-]*)-/g, '>-'));

			if (current == total) {
				return utils.log('success', settings.output);
			}
		}, 
		function updateStatus(msg) {
			// If we should not show progress, show everything else
			if (!settings.progress && msg.startsWith('Adding')) {
				return;
			}

			if (!msg.startsWith('Adding')) {
				return utils.log('info', msg);
			}

			let parts = msg.replace('Adding file ', '').replace(/\([0-9]+\/[0-9]+\)/g, '').split(/\/|\\/);
			utils.log('info', `Processing file ${parts[parts.length - 1].trim()}...`);
		}
	);
});

// Setup source folder
cli.on('option:source', (src) => {
	src = path.resolve(src);

	if (!utils.isDir(src)) {
		return utils.log('error', `Cannot access directory: ${src}`);
	}

	settings.files = src;
});

// Loads a config file
cli.on('option:config', (config) => {
	try {
		settings = require(config);
	}
	catch (e) {
		utils.log('error', `Could not load config file: ${config}`);
		process.exit(1);
	}
});

// Show progress?
cli.on('option:progress', () => settings.progress = true);

// Set output path
cli.on('option:output', (output) => settings.output = output);

// Isolate?
cli.on('option:isolate', () => settings.isolate = true);

// Sort?
cli.on('option:sort', () => settings.sort = true);

// Ignore charset detection
cli.on('option:ignore-charset', () => settings.ignoreCharset = true);

// Handle wrong commands
cli.on('command:*', () => {
	utils.log('error', `Invalid command ${cli.args.join(' ')} - Use --help to see a list of available commands`);
});

// Build CLI
cli.parse(process.argv);