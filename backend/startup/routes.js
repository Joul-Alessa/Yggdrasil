const express = require('express');
const projects = require('../routes/projects');
const softwares = require('../routes/softwares');
const skills = require('../routes/skills');

module.exports = function(app){
    app.use(express.json());
    
    app.use('/api/projects', projects);
    app.use('/api/softwares', softwares);
    app.use('/api/skills', skills);
}