import chai from 'chai'
import fileReader from '../src/fileReader.js'
import 'babel-polyfill'

var expect = chai.expect

describe('File operations', () => {
	describe('Default file locations', () => {
		it ('Should have a default /etc/passwd location', () => { expect(fileReader.minimistOptions.default).to.have.property('passwd') })
		it ('Should have a default /etc/groups location', () => { expect(fileReader.minimistOptions.default).to.have.property('groups') })
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
	})

	describe('File opening', () => {
		it ('Can find an existing file', async function() {
			expect(await fileReader.doesFileExist('etc/passwd')).to.be.true
		})
		it ('Should alert if file could not be found', async function () {
			expect(await fileReader.doesFileExist('this/doesnt/exist.json')).to.be.false
		})
		it ('Should not accept a directory as the filename', async function () {
			expect(await fileReader.doesFileExist('etc/')).to.be.false
		})
	})

	describe.skip('Updates', () => {
		it('Should notice if the specified file got updated')
		it('Should re-read the specified file if it gets updated')
	})

	describe.skip('Parser', () => {
		it('Should alert if passwd is malformed')
		it('Should alert if groups is malformed')
		it('Can interpret a single user')
		it('Can interpret multiple users')
		it('Will alert on malformed data')
		it('Will handle empty data')
	})
})