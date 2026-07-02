const express = require("express");
const router = express.Router();
const auditoriaController = require("../../controladores/auditoriaController");
const { param, validarCampos } = require("../../middlewares/validador");
const verificarToken = require("../../middlewares/verificarToken");
const verificarRol = require("../../middlewares/verificarRol");

/**
 * @swagger
 * tags:
 *   name: Auditoría
 *   description: Historial de acciones de los usuarios (extra - solo admin)
 */

/**
 * @swagger
 * /api/v1/auditoria:
 *   get:
 *     summary: Listar historial de acciones (últimas 200)
 *     tags: [Auditoría]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de acciones del sistema
 */

/**
 * @swagger
 * /api/v1/auditoria/usuario/{id_usuario}:
 *   get:
 *     summary: Listar historial de acciones de un usuario puntual
 *     tags: [Auditoría]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historial de acciones del usuario
 */

/* BROWSE - solo admin */
router.get("/", [verificarToken, verificarRol([3])], auditoriaController.getAuditoria);

/* Historial por usuario - solo admin */
router.get(
    "/usuario/:id_usuario",
    [verificarToken, verificarRol([3]), param("id_usuario", "El ID debe ser un número entero").isInt({ min: 1 }), validarCampos],
    auditoriaController.getAuditoriaPorUsuario
);

module.exports = router;
