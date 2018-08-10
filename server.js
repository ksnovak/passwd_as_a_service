import routes from './routes';
import express from 'express';

const app = express();

// app.get('/', (req, res) => {
// 	res.send('Hello world!')
// })
routes(app)
app.listen(3000, () => console.log('listening on port 3000'))


module.exports = app