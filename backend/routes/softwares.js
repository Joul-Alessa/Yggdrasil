const express = require("express");
const software = require("../controllers/softwares");

const router = express.Router();

router.route("/")
    .post(software.create) // Permiso para Admins
    .get(software.show); // Permiso para el público

router.route("/:id")
    .get(software.showOne) // Permiso para el público
    .put(software.update) // Permiso para Admins
    .delete(software.remove); // Permiso para Admins

module.exports = router;