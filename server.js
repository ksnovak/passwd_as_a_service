import routes from './routes';
import fileReader from './fileReader';
import express from 'express';

const app = express();

routes(app)
app.listen(3000, () => console.log('listening on port 3000'))

module.exports = app