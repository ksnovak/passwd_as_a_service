import chai from 'chai'
import server from '../src/server.js'
import fileReader from '../src/fileReader.js'

var expect = chai.expect

describe('File reading', () => {
	describe('Default file locations', () => {
		it ('Should have a default /etc/passwd location', () => { expect(fileReader.minimistOptions.default).to.have.property('passwd') })
		it ('Should have a default /etc/groups location', () => { expect(fileReader.minimistOptions.default).to.have.property('groups') })
		it ('Should alert if passwd could not be found')
		it ('Should alert if groups could not be found')
		it ('Should alert if passwd is malformed')
		it ('Should alert if groups is malformed')
	})

	describe('Custom file locations', () => {
		it ('Should accept a custom passwd location', () => {

			let customLocation = '/etc/passwurd'
			let parsedArgs = fileReader.parseArgs(['--passwd', customLocation])
			expect(parsedArgs).to.have.property('passwd')
			expect(parsedArgs.passwd).to.equal(customLocation)

		})
		it ('Should accept a custom groups location', () => {

			let customLocation = '/etc/groops'
			let parsedArgs = fileReader.parseArgs(['--groups', customLocation])
			expect(parsedArgs).to.have.property('groups')
			expect(parsedArgs.groups).to.equal(customLocation)
		})

		it ('Should handle a blank custom passwd location', () => {
			let parsedArgs = fileReader.parseArgs(['--passwd', '--groups', '--/etc/groops'])
			expect(parsedArgs.passwd).to.equal(fileReader.minimistOptions.default.passwd)
		})
		it ('Should handle a blank custom groups location', () => {
			let parsedArgs = fileReader.parseArgs(['--groups', '--passwd', '--/etc/pasward'])
			expect(parsedArgs.groups).to.equal(fileReader.minimistOptions.default.groups)
		})

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