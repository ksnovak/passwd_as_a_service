import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../server.js'

var expect = chai.expect

chai.use(chaiHttp)

describe('App', () => {
	describe('/entry', () => {
		it('responds with status 200', (done) => {
			chai.request(server).get('/entry')
				.end((err, res) => {
					expect(res).to.have.status(200)
					done()
				})
		})
	})
})
