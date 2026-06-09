const express = require("express");
const router = express.Router();
const medicosController = require("../../controladores/medicosController");
const { body } = require("express-validator");
const { validarCampos } = require("../../middlewares/validador");
const verificarToken = require("../../middlewares/verificarToken");
const verificarRol = require("../../middlewares/verificarRol");

const validacionDeMedico = [
    body("id_usuario", "El id_usuario es obligatorio y debe ser numérico").isInt({ min: 1 }),
    body("id_especialidad", "La especialidad es obligatoria").isInt({ min: 1 }),
    body("matricula", "La matrícula es obligatoria y debe ser numérica").isInt({ min: 1 }),
    body("valor_consulta", "El valor de consulta debe ser un número").isDecimal(),
    validarCampos
];

/**
 * @swagger
 * tags:
 *   name: Médicos
 *   description: Gestión de médicos
 */

/**
 * @swagger
 * /api/v1/medicos:
 *   get:
 *     summary: Listar todos los médicos
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de médicos activos
 *   post:
 *     summary: Crear un médico (admin)
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_usuario, id_especialidad, matricula, valor_consulta]
 *             properties:
 *               id_usuario:
 *                 type: integer
 *               id_especialidad:
 *                 type: integer
 *               matricula:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               valor_consulta:
 *                 type: number
 *     responses:
 *       201:
 *         description: Médico creado correctamente
 */

/**
 * @swagger
 * /api/v1/medicos/especialidad/{id_especialidad}:
 *   get:
 *     summary: Listar médicos por especialidad
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_especialidad
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de médicos de esa especialidad
 */

/**
 * @swagger
 * /api/v1/medicos/{id}:
 *   get:
 *     summary: Obtener un médico por ID
 *     tags: [Médicos]
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
 *         description: Médico encontrado
 *       404:
 *         description: No encontrado
 *   put:
 *     summary: Editar un médico (admin)
 *     tags: [Médicos]
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
 *               id_especialidad:
 *                 type: integer
 *               matricula:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               valor_consulta:
 *                 type: number
 *     responses:
 *       200:
 *         description: Actualizado correctamente
 *   delete:
 *     summary: Eliminar un médico - baja lógica (admin)
 *     tags: [Médicos]
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
 *         description: Dado de baja correctamente
 */

/* BROWSE - cualquier usuario autenticado */
router.get("/", verificarToken, medicosController.getMedicos);

/* BROWSE por especialidad - cualquier usuario autenticado */
router.get("/especialidad/:id_especialidad", verificarToken, medicosController.getMedicosPorEspecialidad);

/* READ - cualquier usuario autenticado */
router.get("/:id", verificarToken, medicosController.getMedicoById);

/* ADD - solo admin */
router.post("/", [verificarToken, verificarRol([3]), ...validacionDeMedico], medicosController.crearMedico);

/* EDIT - solo admin */
router.put(
    "/:id",
    [
        verificarToken,
        verificarRol([3]),
        body("id_especialidad", "La especialidad es obligatoria").isInt({ min: 1 }),
        body("matricula", "La matrícula debe ser numérica").isInt({ min: 1 }),
        body("valor_consulta", "El valor de consulta debe ser un número").isDecimal(),
        validarCampos
    ],
    medicosController.editarMedico
);

/* DELETE - solo admin */
router.delete("/:id", [verificarToken, verificarRol([3])], medicosController.eliminarMedico);

/* Listar obras sociales de un médico */
router.get("/:id/obras-sociales", verificarToken, medicosController.getObrasSocialesDelMedico);

/* Asociar médico con obra social - solo admin */
router.post(
    "/:id/obras-sociales",
    [
        verificarToken,
        verificarRol([3]),
        body("id_obra_social", "El id_obra_social es obligatorio").isInt({ min: 1 }),
        validarCampos
    ],
    medicosController.asociarObraSocial
);

module.exports = router;
