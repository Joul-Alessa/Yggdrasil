const express = require("express");
const project = require("../controllers/projects");

const router = express.Router();

router.route("/")
    .post(project.create) // Permiso para Admins
    .get(project.show); // Permiso para el público

router.route("/:id")
    .get(project.showOne) // Permiso para el público
    .put(project.update) // Permiso para Admins
    .delete(project.remove); // Permiso para Admins

module.exports = router;