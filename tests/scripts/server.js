const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 8081;

const distPath = path.resolve(__dirname, '../../dist');
const assetDataPath = path.resolve(__dirname, '../tests/assets/data');
const index = fs.readFileSync(path.resolve(distPath, '__app.html')).toString();

app.use(express.static(distPath));
app.use('/assets', express.static(assetDataPath));

app.get('*', (_, res) => {
  res.send(index);
});

app.listen(port, () => {
  console.log('Test server listening on port %d', port);
});
