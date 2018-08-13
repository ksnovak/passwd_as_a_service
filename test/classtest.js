import chai from 'chai'
import 'babel-polyfill'
import User from '../src/models/User'
import Error from '../src/models/Error'

var expect = chai.expect
var assert = chai.assert

describe('Error', () => {
	it('should recognize two errors of the same type being equivalent', () => {
		expect(Error.fileNotFound).to.equal(Error.fileNotFound)
	})
	it('should recognize different error types', () => {
		expect(Error.fileNotFound).to.not.equal(Error.malformedObject)
	})

	it('should recognize an error having been thrown', () => {
		let testFn = function() { throw Error.malformedObject }
		expect(testFn).to.throw(Error.malformedObject)
	})

	it('should treat different thrown errors as different', () => {
		let testFn = function() { throw Error.malformedObject }
		expect(testFn).to.not.throw(testFn, Error.malformedObject, Error.malformedObject.message)
	})


})

describe('User', () => {
	it('Should create a user from a well-formed string', () => {
		expect(new User('root:x:0:0:root:/root:/bin/bash'))
			.to.be.an('object')
			.with.property('shell', '/bin/bash')
	})

	it ('Should error if a malformed string is passed', () => {
		expect(function() { let user = new User('root:x')}).to.throw(Error.malformedObject)
	})
})

// describe('Error')