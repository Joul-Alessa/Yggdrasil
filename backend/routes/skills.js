const express = require("express");
const skill = require("../controllers/skills");

const router = express.Router();

router.route("/")
    .post(skill.create) // Permiso para Admins
    .get(skill.show); // Permiso para el público

router.route("/:id")
    .get(skill.showOne) // Permiso para el público
    .put(skill.update) // Permiso para Admins
    .delete(skill.remove); // Permiso para Admins

module.exports = router;