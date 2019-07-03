var fs = require('fs');
var path = require('path');
var chardet = require('chardet');

const OPENING_STATEMENT = `
(function() {
`;

const CLOSING_STATEMENT = `
})();
`;

const DEFAULT_CHARSET = 'UTF-8';

/**
 * Get a list of files recursive
 * 
 * @param {String} folder Path
 * @return {Array} files
 */
const processFolder = (folder, blacklist = null, sort = false) => {
	let files = [];

	fs.readdirSync(folder).forEach(route => {
		if (fs.lstatSync(path.join(folder, route)).isDirectory()) {
			processFolder(path.join(folder, route), blacklist).forEach(file => files.push(file));
			return;
		}

		if (!blacklist || !blacklist.some(rule => route.match(new RegExp(rule, "i")))) {
			files.push(
				path.join(folder, route)
			);
		}
	});
	
	return (sort) ? files.sort() : files;
}

/**
 * Appends content to a file re-using a stream
 * 
 * @param {fsWriteStream} stream 
 * @param {String} content 
 */
const append = (stream, content) => {
	stream.write(content);
};

module.exports = function(config, wroteCallback = null, status = console.log) {
	let bundleFile = path.resolve(config.output || path.join(__dirname, 'bundle.js'));
	let bundled = 0;
	let input = config.files;

	// Clear file
	if (fs.existsSync(bundleFile)) {
		status(`Cleaning ${bundleFile}... `);
		fs.truncateSync(bundleFile);

		// If we just wanted to clear, stop here
		if (config.justClear) {
			return;
		}
	}

	status(`Writing to ${bundleFile}`);

	// If it is a folder, get every file from it
	if (typeof input === 'string') {
		input = processFolder(input, config.blacklist || null, !!config.sort);
	}

	// If is array, process each one of it
	if (typeof config.files === 'object') {
		input = [];
		
		config.files.forEach(folder => {
			input = [...input, ...processFolder(folder, config.blacklist || null, !!config.sort)];
		});
	}

	let stream = fs.createWriteStream(bundleFile, {flags: 'a'});

	input.forEach(file => {
		bundled++;

		status(`Adding file ${file} (${bundled}/${input.length})`);

		append(
			stream,
			`/** begin file: ${file} **/\n`
		);

		if (config.isolate) {
			append(stream, OPENING_STATEMENT);
		}

		// Detect charset, unless told otherwise
		let encoding = (!config.ignoreCharset) ? chardet.detectFileSync(file) : DEFAULT_CHARSET;

		// Non UTF currently unsupported
		if (encoding.indexOf('UTF') === -1) {
			encoding = DEFAULT_CHARSET;
		}

		append(stream, fs.readFileSync(file, encoding).toString().replace(/^\uFEFF/, ''));

		if (config.isolate) {
			append(stream, CLOSING_STATEMENT);
		}

		append(
			stream,
			`\n/** end file: ${file} **/\n\n`
		);

		if (!!wroteCallback) {
			wroteCallback(bundled, input.length);
		}
	});
}