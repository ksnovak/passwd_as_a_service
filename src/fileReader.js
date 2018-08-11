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

	//Common error object to be thrown when something requested is not found
	fileNotFound: {
		name: 404,
		message: 'File not found'
	},

	malformed: {
		name: 'Malformed',
		message: 'File is malformed'
	},

	//Class to build user objects, with a function to make sure it is properly formed
	User: class {
		constructor(data) {
			let elems = data.split(':')

			//There needs to be 7 properties in each line to be correctly formed. If it doesn't pass that check, it's invalid
			if (elems.length == 7) {
				this.name = elems[0];
				//elems[1] is password, which will always just be an x
				this.uid = Number(elems[2]);
				this.gid = Number(elems[3]);
				this.comment = elems[4];
				this.home = elems[5];
				this.shell = elems[6];
			}
		}

		isValid() {
			return (this.name && (this.uid || this.uid == 0)  && (this.gid || this.gid == 0) && (typeof this.comment == 'string') && this.home && this.shell)
		}
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

	readFile: async function(path, callback) {
		try {
			let fileExists = await this.doesFileExist(path)
			if (fileExists) {

				let contents = await promisify(fs.readFile)(path)
				contents = contents.toString()

				if (callback)
					callback(contents)

				return contents
			}
			else {
				throw this.fileNotFound
			}
		}
		catch (err) {
			throw this.fileNotFound
		}
	},

	getPasswd: async function(path, callback) {
		try {
			let contents = await this.readFile(path)
			if (contents) {
				return this.parsePasswd(contents)
			}
			else {
				return []
			}

		}
		catch (err) {
			throw this.fileNotFound
		}
	},

	parsePasswd: function(contents) {
		let users = []
		let lines = contents.split('\n')

		lines.map(line => {
			let user = new this.User(line)

			if (user.isValid()) {
				users.push(user)
			}
			else {
				throw this.malformed
			}
		})

		console.log(`lines: ${lines.length}, users: ${users.length}`)

		//Only return users if every single line was valid.
		if (lines.length == users.length) {
			return users
		}
		else {
			throw this.malformed
		}
	},

	//Watch the specified file for any changes, and run the appropriate callback as needed
	watchFile: async function(path, changedCallback, otherCallback) {
		if (await this.doesFileExist(path)) {
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
	},
}