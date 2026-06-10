const express = require("express");
const router = express.Router();
const estadisticasController = require("../../controladores/estadisticasController");
const verificarToken = require("../../middlewares/verificarToken");
const verificarRol = require("../../middlewares/verificarRol");

/**
 * @swagger
 * tags:
 *   name: Estadísticas
 *   description: Estadísticas de atenciones (solo admin)
 */

/**
 * @swagger
 * /api/v1/estadisticas/atenciones:
 *   get:
 *     summary: Obtener estadísticas de atenciones en JSON
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas generadas por stored procedure
 */

/**
 * @swagger
 * /api/v1/estadisticas/atenciones/pdf:
 *   get:
 *     summary: Descargar estadísticas de atenciones en PDF
 *     tags: [Estadísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo PDF generado
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */

/* JSON - solo admin */
router.get("/atenciones", [verificarToken, verificarRol([3])], estadisticasController.getEstadisticas);

/* PDF - solo admin */
router.get("/atenciones/pdf", [verificarToken, verificarRol([3])], estadisticasController.getEstadisticasPdf);

module.exports = router;
