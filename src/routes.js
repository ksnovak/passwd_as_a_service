import 'express'

module.exports = function(app) {
	app.get('/entry', function(req, res) {
		res.send('Hello world!')
	})

	app.get('/users', function(req, res) {

	})

	app.get('/users/query', function(req, res) {

	})

	app.get('/users/:uid', function(req, res) {

	})

	app.get('/users/:uid/groups', function(req, res) {

	})


	app.get('/groups', function(req, res) {

	})
	app.get('/groups/query', function(req, res) {

	})
	app.get('/groups/:gid', function(req, res) {

	})
}