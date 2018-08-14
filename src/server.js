import routes from './routes';
import fileReader from './fileReader';
import express from 'express';

const args = fileReader.parseArgs(process.argv)

const server = express();

routes(server, args)

//Start up the server, but only once; this prevents issues when doing mocha --watch
if (!module.parent) {
	server.listen(3000, () => console.log('listening on port 3000'))
}

module.exports = {
	server,
	args
}