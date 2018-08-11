import routes from './routes';
import fileReader from './fileReader';
import express from 'express';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2), {
	string: ['passwd', 'groups'],
	default: {passwd: '/etc/passwd', groups: '/etc/groups'}
})

console.log(args)


const app = express();

routes(app)
app.listen(3000, () => console.log('listening on port 3000'))

module.exports = app