const express = require("express");
const router = express.Router();
const especialidadesController = require("../../controladores/especialidadesController");
const { validacionDeEspecialidad, validarCampos } = require("../../middlewares/validador");
const { body } = require("express-validator");
const verificarToken = require("../../middlewares/verificarToken");
const verificarRol = require("../../middlewares/verificarRol");

/**
 * @swagger
 * tags:
 *   name: Especialidades
 *   description: Gestión de especialidades médicas
 */

/**
 * @swagger
 * /api/v1/especialidades:
 *   get:
 *     summary: Listar todas las especialidades
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de especialidades activas
 *   post:
 *     summary: Crear una especialidad (admin)
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Cardiología
 *     responses:
 *       201:
 *         description: Especialidad creada correctamente
 *       403:
 *         description: Acceso denegado
 */

/**
 * @swagger
 * /api/v1/especialidades/{id}:
 *   get:
 *     summary: Obtener una especialidad por ID
 *     tags: [Especialidades]
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
 *         description: Especialidad encontrada
 *       404:
 *         description: No encontrada
 *   put:
 *     summary: Editar una especialidad (admin)
 *     tags: [Especialidades]
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
 *               nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Actualizada correctamente
 *   delete:
 *     summary: Eliminar una especialidad - baja lógica (admin)
 *     tags: [Especialidades]
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
 *         description: Dada de baja correctamente
 */

/* BROWSE - cualquier usuario autenticado puede listar */
router.get("/", verificarToken, especialidadesController.getEspecialidades);

/* READ - cualquier usuario autenticado puede ver una */
router.get("/:id", verificarToken, especialidadesController.getEspecialidadById);

/* ADD - solo administrador (rol 3) */
router.post(
    "/",
    [verificarToken, verificarRol([3]), ...validacionDeEspecialidad],
    especialidadesController.crearEspecialidad
);

/* EDIT - solo administrador (rol 3) */
router.put(
    "/:id",
    [
        verificarToken,
        verificarRol([3]),
        body("nombre", "El nombre es obligatorio").trim().notEmpty(),
        validarCampos
    ],
    especialidadesController.editarEspecialidad
);

/* DELETE - solo administrador (rol 3) */
router.delete("/:id", [verificarToken, verificarRol([3])], especialidadesController.eliminarEspecialidad);

module.exports = router;
