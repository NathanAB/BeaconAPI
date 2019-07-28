'use strict';

const express = require('express');

const mountRoutes = require('./routes');

const port = 3000;
const app = express();
mountRoutes(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get('/', (req, res) => res.send('Hello world!'));
