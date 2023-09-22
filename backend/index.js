const express = require('express');

const app = express();

const port = process.env.PORT || 3500;

require('dotenv').config();

app.listen(port, () => {
    console.log('Listening on port: ' + port);
});