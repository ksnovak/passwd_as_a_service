/* All of the different errors that're expected to be thrown within the system

*/
let newError = function (name, message) {
	let err = new Error(message)
	err.name = name

	return err
}

module.exports = {
	newError,
	genericError: newError('generic', 'Something went wrong'),
	fileNotFound: newError(404, 'File not found'),
	malformedFile: newError('malformedFile', 'File is malformed'),
	malformedObject: newError('malformedObject', 'Object is malformed'),
}