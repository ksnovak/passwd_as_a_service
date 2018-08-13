
let FileNotFound = new Error('File not found')
FileNotFound.name = 404

let MalformedFile = new Error('File is malformed')
MalformedFile.name = 'malformedFile'

let MalformedObject = new Error('Object is malformed')
MalformedObject.name = 'malformedObject'


module.exports = {
	//Common error object to be thrown when something requested is not found
	fileNotFound: FileNotFound,

	malformedFile: MalformedFile,

	malformedObject: MalformedObject
}