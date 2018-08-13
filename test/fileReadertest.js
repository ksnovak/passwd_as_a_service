import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import fileReader from '../src/fileReader.js'
import 'babel-polyfill'
import fs from 'fs'
import moment from 'moment'
import Errors from '../src/models/Error'

chai.use(chaiAsPromised)

var expect = chai.expect
// var should = chai.should()

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

	describe('Updates', () => {

		it('Should notice if the specified file got updated', (done) => {
			let path = 'test/testdata/editable'

			fileReader.watchFile(path, function() {
				done();
			})

			//Note that our API is read-only; there's nothing in it that will update files, so we're directly calling fs here
			fs.writeFile(path, `The time is now ${moment().format('hh:mm:ss a, dddd, MMMM Do YYYY')}`, (err) => {
				if (err) {
					throw err
				}
			})
		})

		it ("Doesn't alert for changes to unwatched files", function (done) {

			let path = 'test/testdata/edittwo'

			fileReader.watchFile(path, function() {
				done(new Error("This wasn't the edited file"))
			})

			fs.writeFile(`${path}other`, `The time is now ${moment().format('hh:mm:ss a, dddd, MMMM Do YYYY')}`, (err) => {
				if (err) {
					throw err
				}
				else {
					//Wait a little bit and see if the watcher noticed any changes.
					setTimeout(function() { done() }, 200)
				}
			})
		})

		it('Can unwatch a watched file', (done) => {
			try {
				let path = 'etc/passwd'
				fileReader.watchFile(path)
				fileReader.unwatchFile(path)
				done()
			}
			catch (err) {
				done(err)
			}

		})
		it("Doesn't error on trying to unwatch a non-watched file", () => {
			fileReader.unwatchFile('this/doesnt/exist')
		})

		it('Should re-read the specified file if it gets updated')

		//Make sure there's nothing left being watched at the end of the test
		afterEach('Unwatch everything', () => {
			fileReader.unwatchFile('*/*')

		})
	})

	describe.only('Parser', () => {
		it('Can read data from a file', async function () {
			fileReader.readFile('etc/passwd', function(contents) {
				expect(contents).to.be.a('string')
			})
		})
		it('Gives a 404 on trying to read a non-existent file', async function() {
			return expect(fileReader.readFile('this/doesnt/exist')).to.be.rejectedWith(Errors.fileNotFound)
		})
		it('Can interpret multiple users', async function() {
			let path = 'etc/passwd'
			expect(await fileReader.getPasswd(path))
				.to.be.an('array')

		})
		it('Can interpret a single user', async function() {
			let path = 'test/testdata/passwd_single'
			expect(await fileReader.getPasswd(path))
				.to.be.an('array')
				.and.have.lengthOf(1)
		})
		it('Will handle empty data', async function() {
			let path = 'test/testdata/passwd_empty'
			expect(await fileReader.getPasswd(path))
				.to.be.an('array')
				.and.have.lengthOf(0)
		})
		it('Will alert if passwd is malformed', async function() {
			let path = 'test/testdata/passwd_malformed'
			return expect(fileReader.getPasswd(path)).to.be.rejectedWith(Errors.malformedFile)
		})
		it('Will alert if groups is malformed')

	})
})