require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use('/api', require('./src/api'));

app.get('/', (req, res) => {
  res.send('Emotion Detection POC');
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});