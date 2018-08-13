import chai from 'chai'
import 'babel-polyfill'
import User from '../src/models/User'
import Group from '../src/models/Group'
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
	var goodUsers = [
		{val: 'root:x:0:0:root:/root:/bin/bash', reason: 'standard makeup', test: '/bin/bash'},
		{val: 'mailnull:x:47:47::/var/spool/mqueue:/sbin/nologin', reason: 'an empty comment', test: '/sbin/nologin'},
		{val: 'shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown', reason: 'gid of 0', test: '/sbin/shutdown'}
	]

	goodUsers.forEach(elem => {
		it(`Makes a user with ${elem.reason}`, () => {
			expect(new User(elem.val))
				.to.be.an('object')
				.with.property('shell', elem.test)
		})
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

describe('Group', () => {
	var goodGroups = [
		{val: 'adm:x:4:root,adm,daemon', reason: 'standard makeup', test: 'adm'},
		{val: 'games:x:20:', reason: 'an empty users list', test: 'games'},
		{val: 'news:x:13:news', reason: 'a single user in group list', test: 'news'},
	]

	goodGroups.forEach(elem => {
		it(`Makes a group with ${elem.reason}`, () => {
			expect(new Group(elem.val))
				.to.be.an('object')
				.with.property('name', elem.test)
		})
	})

	var badGroups = [
		{val: 'root:x:3', reason: 'not enough fields'},
		{val: 'sys:x::root,bin,adm', reason: 'no GID'},
		{val: '', reason: 'empty string'},
		{val: 'nobody:x:99:ibrahim:moizoos:', reason: 'too many fields'}
	]

	badGroups.forEach(elem => {
		it (`Reject group creation with ${elem.reason}`, () => {
			expect(function() { let group = new Group(elem.val)}).to.throw(Error.malformedObject)
		})
	});
})

// describe('Error')