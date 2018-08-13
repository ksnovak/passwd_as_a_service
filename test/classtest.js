import chai from 'chai'
import 'babel-polyfill'
import User from '../src/models/User'
import Error from '../src/models/Error'

var expect = chai.expect

describe('User', () => {
	it('Should create a user from a well-formed string', () => {
		expect(new User('root:x:0:0:root:/root:/bin/bash')).to.be.an('object')
			.with.property('shell', '/bin/bash')
	})

	it ('Should error if a malformed string is passed', () => {
		expect(function() { let user = new User('root:x')}).to.throw(Error.malformedObject)
	})
})

// describe('Error')