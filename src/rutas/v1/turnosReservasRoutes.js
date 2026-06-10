const express = require("express");
const router = express.Router();
const turnosReservasController = require("../../controladores/turnosReservasController");
const { body } = require("express-validator");
const { validarCampos } = require("../../middlewares/validador");
const verificarToken = require("../../middlewares/verificarToken");
const verificarRol = require("../../middlewares/verificarRol");

/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: Gestión de turnos y reservas
 */

/**
 * @swagger
 * /api/v1/turnos-reservas:
 *   get:
 *     summary: Listar todos los turnos (admin)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos activos
 *   post:
 *     summary: Crear un turno (paciente o admin)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_medico, fecha_hora]
 *             properties:
 *               id_medico:
 *                 type: integer
 *                 example: 1
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-20T10:00:00"
 *               id_paciente:
 *                 type: integer
 *                 description: Solo requerido si el solicitante es admin
 *                 example: 1
 *     responses:
 *       201:
 *         description: Turno creado con valor_total calculado
 *       404:
 *         description: Médico o paciente no encontrado
 */

/**
 * @swagger
 * /api/v1/turnos-reservas/mis-turnos:
 *   get:
 *     summary: Ver mis turnos (médico o paciente)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos del usuario autenticado
 */

/**
 * @swagger
 * /api/v1/turnos-reservas/{id}/atendido:
 *   patch:
 *     summary: Marcar turno como atendido (médico)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               observaciones:
 *                 type: string
 *                 example: Paciente con fiebre leve, se receta ibuprofeno
 *     responses:
 *       200:
 *         description: Turno marcado como atendido
 *       404:
 *         description: Turno no encontrado o no pertenece al médico
 */

/**
 * @swagger
 * /api/v1/turnos-reservas/{id}:
 *   delete:
 *     summary: Eliminar un turno - baja lógica (admin)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno eliminado
 */

/* BROWSE - solo admin */
router.get("/", [verificarToken, verificarRol([3])], turnosReservasController.getTurnos);

/* Mis turnos - médico o paciente */
router.get("/mis-turnos", [verificarToken, verificarRol([1, 2])], turnosReservasController.getMisTurnos);

/* ADD - paciente (el suyo) o admin (cualquiera) */
router.post(
    "/",
    [
        verificarToken,
        verificarRol([2, 3]),
        body("id_medico", "El id_medico es obligatorio").isInt({ min: 1 }),
        body("fecha_hora", "La fecha y hora son obligatorias").notEmpty().isISO8601(),
        validarCampos
    ],
    turnosReservasController.crearTurno
);

/* Marcar atendido - solo médico */
router.patch(
    "/:id/atendido",
    [
        verificarToken,
        verificarRol([1]),
        body("observaciones").optional().trim().isLength({ max: 500 }),
        validarCampos
    ],
    turnosReservasController.marcarAtendido
);

/* DELETE - solo admin */
router.delete("/:id", [verificarToken, verificarRol([3])], turnosReservasController.eliminarTurno);

module.exports = router;
