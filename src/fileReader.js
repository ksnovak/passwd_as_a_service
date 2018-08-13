import fs from 'fs';
import minimist from 'minimist'
import 'babel-polyfill'
import { promisify } from 'es6-promisify'
import chokidar from 'chokidar'
import User from './models/User'
import Errors from './models/Error'

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

	//Get the contents of the file, and return them as a string. Throw 404 if something goes wrong
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
				throw Errors.fileNotFound
			}
		}
		catch (err) {
			throw Errors.fileNotFound
		}
	},

	//Function to get an array of the relevant objects from the specified file
	readFileAndGetArray: async function(path, buildArrayFunction, objType, callback) {
		try {
			let contents = await this.readFile(path)
			if (contents) {
				if (callback)
					callback(buildArrayFunction(contents, objType))

				return buildArrayFunction(contents, objType)
			}
			else {
				return []
			}

		}
		catch (err) {
			//We care about Malformed File errors; but any other kind of error caught, we just treat as a 404
			if (err == Errors.malformedFile)
				throw Errors.malformedFile
			else
				throw Errors.fileNotFound
		}
	},


	//Retrieve the passwd file, and return an array of users from it
	getPasswd: async function(path, callback) {
		return this.readFileAndGetArray(path, this.buildArray, User, callback)
	},

	getGroups: async function(path, callback) {
		// return this.readFileAndGetArray(path, this.parseGroups, Group, callback)
	},

	//Given the file contents (either passwd or groups), and the type of object (user or group), parse and create an array of those objects
	buildArray: function(contents, objType) {
		try {
			let arr = []
			let lines = contents.split('\n')


			lines.map(line => {
				let elem = new objType(line)
				arr.push(elem)
			})


			//Only return the list if every single line was valid.
			if (lines.length == arr.length) {
				return arr
			}
			else {
				throw Errors.malformedFile
			}
		}
		catch (err) {
			throw Errors.malformedFile
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