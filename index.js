'use strict';

const express = require('express');

const mountRoutes = require('./routes');

const app = express();
mountRoutes(app);

app.get('/', (req, res) => res.send('Hello world!'));

app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port;
  console.log("App now running on port", port);
});
