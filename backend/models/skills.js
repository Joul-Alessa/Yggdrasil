const Joi = require('joi');
const mongoose = require('mongoose');

const skill = new mongoose.Schema({
    name: { type: String, required: true }
});

const Skill = mongoose.model('Skill', skill);

function validateSkill(skill){
    const schema = Joi.object({
        name: Joi.string().max(100).required()
    });

    return schema.validate(skill);
}

module.exports.Skill = Skill;
module.exports.validateSkill = validateSkill;