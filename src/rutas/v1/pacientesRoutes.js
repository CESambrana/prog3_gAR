const express = require("express");
const router = express.Router();
const pacientesController = require("../../controladores/pacientesController");
const { body } = require("express-validator");
const { validarCampos, param } = require("../../middlewares/validador");
const verificarToken = require("../../middlewares/verificarToken");
const verificarRol = require("../../middlewares/verificarRol");

/**
 * @swagger
 * tags:
 *   name: Pacientes
 *   description: Gestión de pacientes
 */

/**
 * @swagger
 * /api/v1/pacientes:
 *   get:
 *     summary: Listar todos los pacientes (admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pacientes activos
 *   post:
 *     summary: Crear un paciente (admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_usuario, id_obra_social]
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 example: 5
 *               id_obra_social:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Paciente creado correctamente
 */

/**
 * @swagger
 * /api/v1/pacientes/{id}:
 *   get:
 *     summary: Obtener un paciente por ID (admin o el propio paciente)
 *     tags: [Pacientes]
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
 *         description: Paciente encontrado
 *       404:
 *         description: No encontrado
 *   put:
 *     summary: Editar obra social del paciente (admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_obra_social:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Paciente actualizado
 *   delete:
 *     summary: Eliminar paciente - baja lógica (admin)
 *     tags: [Pacientes]
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
 *         description: Paciente dado de baja
 */

/**
 * @swagger
 * /api/v1/pacientes/{id}/obras-sociales:
 *   patch:
 *     summary: Asociar paciente con una obra social (admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_obra_social:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Obra social asociada correctamente
 */

/* BROWSE - solo admin */
router.get("/", [verificarToken, verificarRol([3])], pacientesController.getPacientes);

/* READ - admin o paciente (rol 2 o 3) */
router.get("/:id", [verificarToken, verificarRol([2, 3]), param("id", "El ID debe ser un número entero").isInt({ min: 1 }), validarCampos], pacientesController.getPacienteById);

/* ADD - solo admin */
router.post(
    "/",
    [
        verificarToken,
        verificarRol([3]),
        body("id_usuario", "El id_usuario es obligatorio").isInt({ min: 1 }),
        body("id_obra_social", "El id_obra_social es obligatorio").isInt({ min: 1 }),
        validarCampos
    ],
    pacientesController.crearPaciente
);

/* EDIT - solo admin */
router.put(
    "/:id",
    [
        verificarToken,
        verificarRol([3]),
        param("id", "El ID debe ser un número entero").isInt({ min: 1 }),
        body("id_obra_social", "El id_obra_social es obligatorio").isInt({ min: 1 }),
        validarCampos
    ],
    pacientesController.editarPaciente
);

/* DELETE - solo admin */
router.delete("/:id", [verificarToken, verificarRol([3]), param("id", "El ID debe ser un número entero").isInt({ min: 1 }), validarCampos], pacientesController.eliminarPaciente);

/* Asociar paciente con obra social - solo admin */
router.patch(
    "/:id/obras-sociales",
    [
        verificarToken,
        verificarRol([3]),
        param("id", "El ID debe ser un número entero").isInt({ min: 1 }),
        body("id_obra_social", "El id_obra_social es obligatorio").isInt({ min: 1 }),
        validarCampos
    ],
    pacientesController.asociarObraSocial
);

module.exports = router;
