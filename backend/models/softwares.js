const Joi = require('joi');
const mongoose = require('mongoose');

const software = new mongoose.Schema({
    name: { type: String, required: true },
    fontColor: { type: String, required: true },
    bgColor: { type: String, required: true }
});

const Software = mongoose.model('Software', software);

function validateSoftware(software){
    const schema = Joi.object({
        name: Joi.string().max(100).required(),
        fontColor: Joi.string().min(7).max(7).regex(/^#[ABCDEF0-9]{6}$/).required(),
        bgColor: Joi.string().min(7).max(7).regex(/^#[ABCDEF0-9]{6}$/).required()
    });

    return schema.validate(software);
}

module.exports.Software = Software;
module.exports.validateSoftware = validateSoftware;