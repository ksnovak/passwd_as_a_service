import 'express'
import fileReader from './fileReader'
import { args } from './server'

let users = [];

async function getUsers (args) {
	if (users && users.length == 0) {
		return await fileReader.getUsers(args.passwd)
	}
	else {
		return users
	}
}

module.exports = function(app, args) {

	app.use(async function(req, res, next) {
		users = await getUsers(args)

		next()
	})

	app.get('/entry', function(req, res) {
		res.send('Hello world!')
	})

	//List of all users in the system
	app.get('/users', async function(req, res) {

		res.send(users)
	})

	//List of users matching specified query fields
	//  name, uid, gid, omment, home, shell
	app.get('/users/query', function(req, res) {
		res.send('users query')
	})

	//Get the user with the matching uid
	// Returns 404 if not found
	app.get('/users/:uid', function(req, res) {
		res.send(`user of uid ${req.params.uid}`)
	})

	//Get the groups for a given user
	app.get('/users/:uid/groups', function(req, res) {
		res.send(`groups for user of uid ${req.params.uid}`)
	})

	//List of all groups in the system
	app.get('/groups', function(req, res) {
		res.send('groups')
	})

	//List of all groups matching speified query fields
	// name, gid, member (member can be repeated)
	app.get('/groups/query', function(req, res) {
		res.send('groups query')
	})

	//Get the group with the matching gid
	app.get('/groups/:gid', function(req, res) {
		res.send(`groups of gid ${req.params.gid}`)
	})
}