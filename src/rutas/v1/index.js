const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const usuariosRoutes = require("./usuariosRoutes");
const especialidadesRoutes = require("./especialidadesRoutes");
const obrasSocialesRoutes = require("./obrasSocialesRoutes");
const medicosRoutes = require("./medicosRoutes");
const pacientesRoutes = require("./pacientesRoutes");
const turnosReservasRoutes = require("./turnosReservasRoutes");
const estadisticasRoutes = require("./estadisticasRoutes");
const auditoriaRoutes = require("./auditoriaRoutes");

router.use("/auth", authRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/especialidades", especialidadesRoutes);
router.use("/obras-sociales", obrasSocialesRoutes);
router.use("/medicos", medicosRoutes);
router.use("/pacientes", pacientesRoutes);
router.use("/turnos-reservas", turnosReservasRoutes);
router.use("/estadisticas", estadisticasRoutes);
router.use("/auditoria", auditoriaRoutes);

module.exports = router;