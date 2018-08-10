import 'express'

module.exports = function(app) {
	app.get('/entry', function(req, res) {
		res.send('Hello world!')
	})
}