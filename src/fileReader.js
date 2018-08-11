import fs from 'fs';
import minimist from 'minimist'
import 'babel-polyfill'
import { promisify } from 'es6-promisify'
import chokidar from 'chokidar'

let watcher = chokidar.watch()

module.exports = {
	//Default options to use for command-line args
	minimistOptions: {
		string: ['passwd', 'groups'],
		default: {passwd: '/etc/passwd', groups: '/etc/groups'}
	},

	//Interpret the command-line arguments passed, using defaults as needed
	parseArgs: function(args) {
		let parsedArgs = minimist(args, this.minimistOptions);

		//If the --passwd or --groups flag gets passed with no actual value, this will override and go back to defaults
		parsedArgs.passwd = parsedArgs.passwd || this.minimistOptions.default.passwd
		parsedArgs.groups = parsedArgs.groups || this.minimistOptions.default.groups

		return parsedArgs
	},


	//Check if the specified path is an existing file
	doesFileExist: async function (path) {
		try {
			let stats = await promisify(fs.stat)(path)

			//a successful search could be either a file or a directory. But here we only want files.
			return stats.isFile()
		}
		catch (err) {
			//If we got an error, then the file doesn't exist to us
			return false
		}
	},

	//Watch the specified file for any changes, and run the appropriate callback as needed
	watchFile: async function(path, changedCallback, otherCallback) {
		if (this.doesFileExist(path)) {
			watcher.add(path).on('all', (event, path) => {

				if (event == 'change') {
					if (changedCallback)
						changedCallback()
				}

				//unlink and unlinkDir means either the file or directory got deleted; error is any kind of error
				else if (event in ['unlink', 'unlinkDir', 'error']) {
					if (otherCallback)
						otherCallback()
				}
			})
		}
	},

	//Remove the specified file from the watch list
	unwatchFile: async function(path) {
		watcher.unwatch(path)
	}
}