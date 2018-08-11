import fs from 'fs';
import minimist from 'minimist'


module.exports = {
	minimistOptions: {
		string: ['passwd', 'groups'],
		default: {passwd: '/etc/passwd', groups: '/etc/groups'}
	},

	parseArgs: function(args) {
		let parsedArgs = minimist(args, this.minimistOptions);

		//If the --passwd or --groups flag gets passed with no actual value, this will override and go back to defaults
		parsedArgs.passwd = parsedArgs.passwd || this.minimistOptions.default.passwd
		parsedArgs.groups = parsedArgs.groups || this.minimistOptions.default.groups

		return parsedArgs
	},

	// let readFile = function(filename) {

	// }
}