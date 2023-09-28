const {Software, validateSoftware} = require('../models/softwares');

module.exports = {
    create: async function(req, res)
    {
        try
        {
            const validation = validateSoftware(req.body);
            if(validation.error)
            {
                console.log("Error 400 (Bad Request): " + validation.error);
                return res.status(400).send(validation.error);
            }

            var software = new Software({
                name: req.body.name,
                fontColor: req.body.fontColor,
                bgColor: req.body.bgColor
            });

            await software.save();
            return res.send(software);
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
            const softwares = await Software.find();
            if(softwares.length > 0)
            {
                return res.send(softwares);
            }
            else
            {
                return res.status(404).send("Sin software agregado");
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
            var software = await Software.findById(req.params.id);
            if(!software)
            {
                return res.status(404).send("Software no encontrado");
            }
            return res.send(software);
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
            const validation = validateSoftware(req.body);
            if(validation.error)
            {
                console.log("Error 400 (Bad Request): " + validation.error);
                return res.status(400).send(validation.error);
            }

            var software = await Software.findById(req.params.id);
            if(!software)
            {
                return res.status(404).send("Software no encontrado");
            }

            var software = await Software.updateOne({ _id: req.params.id }, {
                name: req.body.name,
                fontColor: req.body.fontColor,
                bgColor: req.body.bgColor
            });

            software = await Software.findById(req.params.id);
            return res.send(software);
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
            var software = await Software.findByIdAndRemove(req.params.id);

            if(!software)
            {
                return res.status(404).send("Software no encontrado");
            }
            else
            {
                return res.send(software);
            }
        }
        catch(error)
        {
            console.log("Error: " + error);
            return res.status(500).send(error);
        }
    }
}