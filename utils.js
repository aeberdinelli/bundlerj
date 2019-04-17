const fs = require('fs');
const chalk = require('chalk');

/**
 * Log level formats
 * @type {Object}
 */
const FORMAT = {
	'error': chalk.bgRed,
	'success': chalk.bgGreen,
	'info': chalk.bgBlue
};

module.exports = {
	/**
	 * Checks if a path exists and is a directory
	 * 
	 * @param {String} path 
	 * @returns {Boolean}
	 */
	isDir(path) {
		try {
			return fs.statSync(path).isDirectory();
		}
		catch (e) {
			return false;
		}
	},

	/**
	 * Outputs log to the console 
	 * 
	 * @param {String} type Log level
	 * @param {String} text Text to log
	 * @returns {void}
	 */
	log(type, text) {
		console.log(
			FORMAT[type](`${type.toUpperCase()}`) + ' ' + text
		);
	}
};