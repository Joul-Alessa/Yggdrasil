const Joi = require('joi');
const mongoose = require('mongoose');

const falsecventry = new mongoose.Schema({
    name: { type: String, required: true },
    beginDate: { type: String, required: true },
    endDate: { type: String, required: true },
    formality: { type: String, enum: ['0', '1'], required: true },
    topic: { type: String, required: true },
    subtopic: { type: String, required: true }
});

const Falsecventry = mongoose.model('Falsecventry', falsecventry);

function validateEntry(project){
    const schema = Joi.object({
        name: Joi.string().max(1024).required(),
        beginDate: Joi.string().max(60).required(),
        endDate: Joi.string().max(60).required(),
        formality: Joi.string().valid("0", "1").required(),
        topic: Joi.string().max(200).required(),
        subtopic: Joi.string().max(200).required()
    });

    return schema.validate(project);
}

module.exports.Falsecventry = Falsecventry;
module.exports.validateEntry = validateEntry;