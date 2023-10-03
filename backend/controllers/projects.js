const {Project, validateProject} = require('../models/projects');

module.exports = {
    create: async function(req, res)
    {
        try
        {
            const validation = validateProject(req.body);
            if(validation.error)
            {
                console.log("Error 400 (Bad Request): " + validation.error);
                return res.status(400).send(validation.error);
            }

            var project = new Project({
                name: req.body.name,
                short_desc: req.body.short_desc,
                long_desc: req.body.long_desc,
                softwares: req.body.softwares,
                skills: req.body.skills,
                project_type: req.body.project_type,
                order_number: req.body.order_number,
                formality: req.body.formality,
                picture: req.body.picture
            });

            await project.save();
            return res.send(project);
        }
        catch(error)
        {
            console.log("Error: " + error);
            return res.status(500).send(error);
        }
    },
    show: async function(req, res)
    {
        try
        {
            const projects = await Project.find();
            if(projects.length > 0)
            {
                return res.send(projects);
            }
            else
            {
                return res.status(404).send("Sin proyectos agregados");
            }
        }
        catch(error)
        {
            console.log("Error: " + error);
            return res.status(500).send(error);
        }
    },
    showOne: async function(req, res)
    {
        try
        {
            var project = await Project.findById(req.params.id);
            if(!project)
            {
                return res.status(404).send("Proyecto no encontrado");
            }
            return res.send(project);
        }
        catch(error)
        {
            console.log("Error: " + error);
            return res.status(500).send(error);
        }
    },
    update: async function(req, res)
    {
        try
        {
            const validation = validateProject(req.body);
            if(validation.error)
            {
                console.log("Error 400 (Bad Request): " + validation.error);
                return res.status(400).send(validation.error);
            }

            var project = await Project.findById(req.params.id);
            if(!project)
            {
                return res.status(404).send("Proyecto no encontrado");
            }

            var project = await Project.updateOne({ _id: req.params.id }, {
                name: req.body.name,
                short_desc: req.body.short_desc,
                long_desc: req.body.long_desc,
                softwares: req.body.softwares,
                skills: req.body.skills,
                project_type: req.body.project_type,
                order_number: req.body.order_number,
                formality: req.body.formality,
                picture: req.body.picture
            });

            project = await Project.findById(req.params.id);
            return res.send(project);
        }
        catch(error)
        {
            console.log("Error: " + error);
            res.status(500).send(error);
        }
    },
    remove: async function(req, res)
    {
        try
        {
            var project = await Project.findByIdAndRemove(req.params.id);

            if(!project)
            {
                return res.status(404).send("Proyecto no encontrado");
            }
            else
            {
                return res.send(project);
            }
        }
        catch(error)
        {
            console.log("Error: " + error);
            res.status(500).send(error);
        }
    }
}