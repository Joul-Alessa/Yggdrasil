const express = require("express");
const falsecventry = require("../controllers/falsecventries");

const router = express.Router();

router.route("/")
    .post(falsecventry.create) // Permiso para Admins
    .get(falsecventry.show); // Permiso para el público

router.route("/:id")
    .get(falsecventry.showOne) // Permiso para el público
    .put(falsecventry.update) // Permiso para Admins
    .delete(falsecventry.remove); // Permiso para Admins

module.exports = router;