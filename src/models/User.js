/* User objects, as represented in a computer's passwd file.
Reference: http://www.yourownlinux.com/2015/07/etc-passwd-file-format-in-linux-explained.html

*/

import Error from './Error'

// User objects, as found in the passwd file. These are constructed by an individual line in that file.
module.exports = class User {
	constructor(data) {
		let elems = data.split(':')

		//There needs to be 7 properties in each line to be correctly formed. If it doesn't pass that check, it's invalid
		if (elems.length == 7) {
			this.name = elems[0];
			//elems[1] is password, which will always just be an x
			this.uid = elems[2].length ? Number(elems[2]) : null;
			this.gid = elems[3].length ? Number(elems[3]) : null;
			this.comment = elems[4];
			this.home = elems[5];
			this.shell = elems[6];
		}

		//TODO: How do we immediately reject if invalid?
		if (!this.isValid()) {
			throw Error.malformedObject
		}
	}

	//Checks to see that all fields of the User object are valid.
	isValid() {
		//Have to do !! because there are strings; without it, the last truthy string field would be returned, instead of a boolean value.
		return !!(this.name && !isNaN(this.uid)  && !isNaN(this.gid) && (typeof this.comment == 'string') && this.home && this.shell)
	}
}