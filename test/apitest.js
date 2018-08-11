import chai from 'chai'
import chaiHttp from 'chai-http'
import { server } from '../src/server.js'

var expect = chai.expect

chai.use(chaiHttp)

describe('API', () => {
	describe('/entry', () => {
		it('responds with status 200', (done) => {
			chai.request(server).get('/entry')
				.end((err, res) => {
					expect(res).to.have.status(200)
					done()
				})
		})
	})

	describe.skip('Users', () => {
		describe.skip('GET /users', () => {
			it('Returns a list of users in the /etc/passwd file')
			it('Handles an empty file')
			it('Errors on a malformed file')
			it('Errors on a non-existent file')
		})
		describe.skip('GET /users/query', () => {
			//TODO: Need many tests with variety of query params. name, uid, gid, comment, home, shell
			it('Returns a list of users matching the specified query fields')
			it('Returns all users with the specified name')
			it('Returns the user with the specified uid')
			it('Returns all users belonging to specified group')
			it('Returns all users with the specified comment')
			it('Returns all users with the specified home')
			it('Returns all users with the specified shell')

			it('Returns an empty list when no users match the fields')
			it('Errors on a malformed file')
			it('Errors on a non-existent file')
		})
		describe.skip('GET /users/:uid', () => {
			it('Returns a user with a matching uid')
			it('Returns a 404 if no user is found')
			it('Handles a malformed uid')
		})
		describe.skip('GET /users/:uid/groups', () => {
			it('Returns all groups for the given user')
			it('Handles a non-existent user')
			it('Handles a user without groups')
			it('Handles a malformed uid')
		})
	})

	describe.skip('Groups', () => {
		describe.skip('GET /groups', () => {
			it('Returns a list of all groups in the system, in /etc/group')
			it('Handles an empty file')
			it('Errors on a malformed file')
			it('Errors on a non-existent file')
		})
		describe.skip('GET /groups/query', () => {
			//Need many tests with variety of query params. name, gid, member (member is repeatable)
			it('Returns a list of groups matching all specified fields')
			it('Returns groups matching a specified name')
			it('Returns a group with a specified gid')
			it('Returns all groups that a specified user is in')
			it('Returns a group when two specified users are members of it')
			it('Returns no groups when the two specified users have no common group')

			it('Returns an empty list when no groups match the fields')
			it('Errors on a malformed file')
			it('Errors on a non-existent file')
		})
		describe.skip('GET /groups/:gid', () => {
			it('Returns a group with a matching gid')
			it('Returns a 404 if no group is found')
			it('Handles a malformed gid')
		})
	})
})