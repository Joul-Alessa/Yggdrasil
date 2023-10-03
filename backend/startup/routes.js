const express = require('express');
const softwares = require('../routes/softwares');
const skills = require('../routes/skills');
const projects = require('../routes/projects');
const falsecventries = require('../routes/falsecventries');

module.exports = function(app){
    app.use(express.json());
    
    app.use('/api/softwares', softwares);
    app.use('/api/skills', skills);
    app.use('/api/projects', projects);
    app.use('/api/falsecventries', falsecventries);
}