require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Emotion Detection POC');
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});