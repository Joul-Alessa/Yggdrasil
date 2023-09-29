const {Skill, validateSkill} = require('../models/skills');

module.exports = {
    create: async function(req, res)
    {
        try
        {
            const validation = validateSkill(req.body);
            if(validation.error)
            {
                console.log("Error 400 (Bad Request): " + validation.error);
                return res.status(400).send(validation.error);
            }

            var skill = new Skill({
                name: req.body.name
            });

            await skill.save();
            return res.send(skill);
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
            const skills = await Skill.find();
            if(skills.length > 0)
            {
                return res.send(skills);
            }
            else
            {
                return res.status(404).send("Sin skills agregadas");
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
            var skill = await Skill.findById(req.params.id);
            if(!skill)
            {
                return res.status(404).send("Skill no encontrada");
            }
            return res.send(skill);
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
            const validation = validateSkill(req.body);
            if(validation.error)
            {
                console.log("Error 400 (Bad Request): " + validation.error);
                return res.status(400).send(validation.error);
            }

            var skill = await Skill.findById(req.params.id);
            if(!skill)
            {
                return res.status(404).send("Skill no encontrada");
            }

            var skill = await Skill.updateOne({ _id: req.params.id }, {
                name: req.body.name
            });

            skill = await Skill.findById(req.params.id);
            return res.send(skill);
        }
        catch(error)
        {
            console.log("Error: " + error);
            return res.status(500).send(error);
        }
    },
    remove: async function(req, res)
    {
        try
        {
            var skill = await Skill.findByIdAndRemove(req.params.id);

            if(!skill)
            {
                return res.status(404).send("Skill no encontrada");
            }
            else
            {
                return res.send(skill);
            }
        }
        catch(error)
        {
            console.log("Error: " + error);
            return res.status(500).send(error);
        }
    }
}