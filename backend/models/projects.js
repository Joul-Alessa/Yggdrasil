const Joi = require('joi');
const mongoose = require('mongoose');

const project = new mongoose.Schema({
    name: { type: String, required: true },
    short_desc: { type: String, required: true },
    long_desc: { type: String, required: true },
    softwares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Software' }],
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    project_type: { type: String, enum: ['0', '1'], required: true },
    order_number: { type: Number, required: true },
    picture: { type: String, required: true }, // Cambiar con su alternativa usando multer
});

const Project = mongoose.model('Project', project);

function validateProject(project){
    const schema = Joi.object({
        name: Joi.string().max(200).required(),
        short_desc: Joi.string().max(2048).required(),
        long_desc: Joi.string().max(8192).required(),
        softwares: Joi.array().items(Joi.string().alphanum().length(24)).optional(),
        skills: Joi.array().items(Joi.string().alphanum().length(24)).optional(),
        project_type: Joi.string().valid("0", "1").required(),
        order_number: Joi.number().required(),
        picture: Joi.string().max(200).required()
    });

    return schema.validate(project);
}

module.exports.Project = Project;
module.exports.validateProject = validateProject;