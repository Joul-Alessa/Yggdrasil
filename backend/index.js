const express = require('express');
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();
require('dotenv').config();
app.use(morgan(":date[clf] :method :url :status :res[content-length] - :response-time ms"));
app.use(helmet());

require('./startup/db')();
require('./startup/routes')(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Listening on port ' + port)
});