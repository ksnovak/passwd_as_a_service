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

	var badUsers = [
		{val: 'root:x', reason: 'not enough fields'},
		{val: '', reason: 'empty string'},
		{val: 'daemon:x:2:2:daemon:/sbin:/sbin/nologin:porkchops:sandwiches', reason: 'too many fields'},
		{val: 'daemon:x:three:2:daemon:/sbin:/sbin/nologin', reason: 'no UID'}
	]

	badUsers.forEach(elem => {
		it (`Should reject user creation with ${elem.reason}`, () => {
			expect(function() { let user = new User(elem.val)}).to.throw(Error.malformedObject)
		})
	});
})

describe.only('Group', () => {
	it ('Should create a group from a well-formed string', () => {
		expect(new Group('adm:x:4:root,adm,daemon'))
			.to.be.an('object')
			.with.property('gid', 4)
	})

	var badGroups = [
		{val: '', reason: ''},
		{val: '', reason: ''},
		{val: '', reason: ''},
		{val: '', reason: ''},
	]

	badGroups.forEach(elem => {
		it (`Should reject group creation with ${elem.reason}`, () => {
			expect(function() { let group = new Group(elem.val)}).to.throw(Error.malformedObject)
		})
	});
})

// describe('Error')