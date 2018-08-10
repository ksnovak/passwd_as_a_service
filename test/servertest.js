import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../server.js'

var expect = chai.expect

chai.use(chaiHttp)

describe('App', () => {

})

describe('File reading', () => {
	describe('Default file locations', () => {
		it('Should have a default /etc/passwd location')
		it('Should have a default /etc/groups location')
		it ('Should alert if passwd could not be found')
		it ('Should alert if groups could not be found')
		it ('Should alert if passwd is malformed')
		it ('Should alert if groups is malformed')
	})

	describe('Custom file locations', () => {
		it ('Should accept a custom passwd location')
		it ('Should accept a custom groups location')
		it ('Should alert if passwd could not be found')
		it ('Should alert if groups could not be found')
		it ('Should alert if passwd is malformed')
		it ('Should alert if groups is malformed')
	})

	describe('Updates', () => {
		it('Should notice if the passwd file got updated')
		it('Should notice if the groups file got updated')
		it('Should re-read the passwd file if it gets updated')
		it('Should re-read the groups file if it gets updated')
	})

	describe('Parser', () => {
		it('Can interpret a single user')
		it('Can interpret multiple users')
		it('Will alert on malformed data')
		it('Will handle empty data')
	})
})

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

	describe('Users', () => {
		describe('GET /users', () => {
			it('Returns a list of users in the /etc/passwd file')
			it('Handles an empty file')
			it('Errors on a malformed file')
			it('Errors on a non-existent file')
		})
		describe('GET /users/query', () => {
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
		describe('GET /users/:uid', () => {
			it('Returns a user with a matching uid')
			it('Returns a 404 if no user is found')
			it('Handles a malformed uid')
		})
		describe('GET /users/:uid/groups', () => {
			it('Returns all groups for the given user')
			it('Handles a non-existent user')
			it('Handles a user without groups')
			it('Handles a malformed uid')
		})
	})

	describe('Groups', () => {
		describe('GET /groups', () => {
			it('Returns a list of all groups in the system, in /etc/group')
			it('Handles an empty file')
			it('Errors on a malformed file')
			it('Errors on a non-existent file')
		})
		describe('GET /groups/query', () => {
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
		describe('GET /groups/:gid', () => {
			it('Returns a group with a matching gid')
			it('Returns a 404 if no group is found')
			it('Handles a malformed gid')
		})
	})
})
