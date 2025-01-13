import express from 'express';
import config from './config';


const app = express();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});