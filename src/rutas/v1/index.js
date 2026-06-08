const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const usuariosRoutes = require("./usuariosRoutes");
const especialidadesRoutes = require("./especialidadesRoutes");
const obrasSocialesRoutes = require("./obrasSocialesRoutes");
const medicosRoutes = require("./medicosRoutes");
const pacientesRoutes = require("./pacientesRoutes");

router.use("/auth", authRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/especialidades", especialidadesRoutes);
router.use("/obras-sociales", obrasSocialesRoutes);
router.use("/medicos", medicosRoutes);
router.use("/pacientes", pacientesRoutes);

module.exports = router;
