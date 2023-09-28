const express = require('express');
const projects = require('../routes/projects');
const softwares = require('../routes/softwares');

module.exports = function(app){
    app.use(express.json());
    
    app.use('/api/projects', projects);
    app.use('/api/softwares', softwares);
}