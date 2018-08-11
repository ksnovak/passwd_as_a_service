import routes from './routes';
import fileReader from './fileReader';
import express from 'express';

const args = fileReader.parseArgs(process.argv)

const server = express();

routes(server)
server.listen(3000, () => console.log('listening on port 3000'))

module.exports = {
	server
}
