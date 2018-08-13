/* User objects, as represented in a computer's passwd file.
Reference: https://www.cyberciti.biz/faq/understanding-etcgroup-file/

*/

import Errors from './Error'

// Group objects, as found in the groups file. These are constructed by an individual line in that file.
module.exports = class Group {
	constructor (data) {
		let elems = data.split(':')

		if (elems.length == 4) {
			this.name = elems[0]

			//If the gid spot is blank, set it to NaN, so the isValid() check fails later
			this.gid = elems[2].length ? Number(elems[2]) : NaN

			//Members list is allowed to be empty. But without this check, an empty list will turn into ['']
			this.members = elems[3] ? elems[3].split(',') : []
		}


		if (!this.isValid())
			throw Errors.malformedObject
	}

	isValid() {
		return !!(this.name && !isNaN(this.gid) && Array.isArray(this.members))
	}
}