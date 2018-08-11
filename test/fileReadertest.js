import chai from 'chai'
import fileReader from '../src/fileReader.js'
import 'babel-polyfill'
import fs from 'fs'
import moment from 'moment'

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

	describe.only('Updates', () => {

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

	describe.skip('Parser', () => {
		it('Should alert if passwd is malformed')
		it('Should alert if groups is malformed')
		it('Can interpret a single user')
		it('Can interpret multiple users')
		it('Will alert on malformed data')
		it('Will handle empty data')
	})
})