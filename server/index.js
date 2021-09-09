const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send('Emotion Detection POC');
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});