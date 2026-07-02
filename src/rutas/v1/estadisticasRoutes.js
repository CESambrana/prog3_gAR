const express = require("express");
const router = express.Router();
const estadisticasController = require("../../controladores/estadisticasController");
const { query, validarCampos } = require("../../middlewares/validador");
const verificarToken = require("../../middlewares/verificarToken");
const verificarRol = require("../../middlewares/verificarRol");

/**
 * @swagger
 * tags:
 *   name: Estadísticas
 *   description: Estadísticas de atenciones, generadas siempre por stored procedures (solo admin)
 */

/**
 * @swagger
 * /api/v1/estadisticas/por-especialidad:
 *   get:
 *     summary: Cantidad de turnos y facturación del último mes, por especialidad
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas generadas por sp_estadisticas_atenciones
 */

/**
 * @swagger
 * /api/v1/estadisticas/por-obra-social:
 *   get:
 *     summary: Cantidad de turnos y facturación por obra social
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas generadas por sp_estadisticas_por_obra_social
 */

/**
 * @swagger
 * /api/v1/estadisticas/por-medico:
 *   get:
 *     summary: Cantidad de turnos, atendidos/pendientes y facturación por médico
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas generadas por sp_estadisticas_por_medico
 */

/**
 * @swagger
 * /api/v1/estadisticas/por-paciente:
 *   get:
 *     summary: Cantidad de turnos y gasto total por paciente
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas generadas por sp_estadisticas_por_paciente
 */

/**
 * @swagger
 * /api/v1/estadisticas/turnos:
 *   get:
 *     summary: Detalle de turnos en un rango de fechas
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         description: Si no se envía, se toma un mes atrás desde hoy
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Si no se envía, se toma la fecha de hoy
 *     responses:
 *       200:
 *         description: Estadísticas generadas por sp_estadisticas_por_rango_fechas
 */

/**
 * @swagger
 * /api/v1/estadisticas/turnos/pdf:
 *   get:
 *     summary: Descargar informe de atenciones en PDF (detalle de turnos + resumen por obra social)
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Archivo PDF generado
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */

const validacionRango = [
    query("desde", "La fecha desde debe tener formato YYYY-MM-DD").optional().isISO8601(),
    query("hasta", "La fecha hasta debe tener formato YYYY-MM-DD").optional().isISO8601(),
    validarCampos
];

/* Todas las estadísticas son exclusivas del admin */
router.get("/por-especialidad", [verificarToken, verificarRol([3])], estadisticasController.getPorEspecialidad);
router.get("/por-obra-social", [verificarToken, verificarRol([3])], estadisticasController.getPorObraSocial);
router.get("/por-medico", [verificarToken, verificarRol([3])], estadisticasController.getPorMedico);
router.get("/por-paciente", [verificarToken, verificarRol([3])], estadisticasController.getPorPaciente);
router.get("/turnos", [verificarToken, verificarRol([3]), ...validacionRango], estadisticasController.getPorRangoFechas);
router.get("/turnos/pdf", [verificarToken, verificarRol([3]), ...validacionRango], estadisticasController.getEstadisticasPdf);

module.exports = router;
