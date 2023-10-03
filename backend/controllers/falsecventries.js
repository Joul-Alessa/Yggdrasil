const {Falsecventry, validateEntry} = require('../models/falsecventries');

module.exports = {
    create: async function(req, res)
    {
        try
        {
            const validation = validateEntry(req.body);
            if(validation.error)
            {
                console.log("Error 400 (Bad Request): " + validation.error);
                return res.status(400).send(validation.error);
            }

            var falsecventry = new Falsecventry({
                name: req.body.name,
                beginDate: req.body.beginDate,
                endDate: req.body.endDate,
                formality: req.body.formality,
                topic: req.body.topic,
                subtopic: req.body.subtopic
                
            });

            await falsecventry.save();
            return res.send(falsecventry);
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
            const falsecventries = await Falsecventry.find();
            if(falsecventries.length > 0)
            {
                return res.send(falsecventries);
            }
            else
            {
                return res.status(404).send("Sin entradas agregadas");
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
            var falsecventry = await Falsecventry.findById(req.params.id);
            if(!falsecventry)
            {
                return res.status(404).send("Entrada no encontrada");
            }
            return res.send(falsecventry);
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
            const validation = validateEntry(req.body);
            if(validation.error)
            {
                console.log("Error 400 (Bad Request): " + validation.error);
                return res.status(400).send(validation.error);
            }

            var falsecventry = await Falsecventry.findById(req.params.id);
            if(!falsecventry)
            {
                return res.status(404).send("Entrada no encontrada");
            }

            var falsecventry = await Falsecventry.updateOne({ _id: req.params.id }, {
                name: req.body.name,
                beginDate: req.body.beginDate,
                endDate: req.body.endDate,
                formality: req.body.formality,
                topic: req.body.topic,
                subtopic: req.body.subtopic
            });

            falsecventry = await Falsecventry.findById(req.params.id);
            return res.send(falsecventry);
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
            var falsecventry = await Falsecventry.findByIdAndRemove(req.params.id);

            if(!falsecventry)
            {
                return res.status(404).send("Entrada no encontrada");
            }
            else
            {
                return res.send(falsecventry);
            }
        }
        catch(error)
        {
            console.log("Error: " + error);
            res.status(500).send(error);
        }
    }
}