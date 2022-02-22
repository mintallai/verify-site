// ADOBE CONFIDENTIAL
// Copyright 2021 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 8081;

const distPath = path.resolve(__dirname, '../../dist');
const assetDataPath = path.resolve(__dirname, '../assets/data');
const index = fs.readFileSync(path.resolve(distPath, '__app.html')).toString();

app.use(express.static(distPath));
app.use('/assets', express.static(assetDataPath));

app.get('*', (_, res) => {
  res.send(index);
});

app.listen(port, () => {
  console.log('Test server listening on port %d', port);
});
