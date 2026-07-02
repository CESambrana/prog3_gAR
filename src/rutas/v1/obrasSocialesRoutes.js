const express = require("express");
const router = express.Router();
const obrasSocialesController = require("../../controladores/obrasSocialesController");
const { validacionDeObraSocial, validarCampos, param } = require("../../middlewares/validador");
const { body } = require("express-validator");
const verificarToken = require("../../middlewares/verificarToken");
const verificarRol = require("../../middlewares/verificarRol");

/**
 * @swagger
 * tags:
 *   name: ObrasSociales
 *   description: Gestión de obras sociales
 */

/**
 * @swagger
 * /api/v1/obras-sociales:
 *   get:
 *     summary: Listar todas las obras sociales
 *     tags: [ObrasSociales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de obras sociales activas
 *   post:
 *     summary: Crear una obra social (admin)
 *     tags: [ObrasSociales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, porcentaje_descuento, es_particular]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: OSDE
 *               porcentaje_descuento:
 *                 type: number
 *                 example: 0.30
 *               es_particular:
 *                 type: integer
 *                 description: "0=Obra social, 1=Particular"
 *                 example: 0
 *     responses:
 *       201:
 *         description: Obra social creada correctamente
 */

/**
 * @swagger
 * /api/v1/obras-sociales/{id}:
 *   get:
 *     summary: Obtener una obra social por ID
 *     tags: [ObrasSociales]
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
 *         description: Obra social encontrada
 *       404:
 *         description: No encontrada
 *   put:
 *     summary: Editar una obra social (admin)
 *     tags: [ObrasSociales]
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
 *               porcentaje_descuento:
 *                 type: number
 *               es_particular:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Obra social actualizada
 *   delete:
 *     summary: Eliminar obra social - baja lógica (admin)
 *     tags: [ObrasSociales]
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
 *         description: Obra social dada de baja
 */

/* BROWSE - cualquier usuario autenticado */
router.get("/", verificarToken, obrasSocialesController.getObrasSociales);

/* READ - cualquier usuario autenticado */
router.get("/:id", [verificarToken, param("id", "El ID debe ser un número entero").isInt({ min: 1 }), validarCampos], obrasSocialesController.getObraSocialById);

/* ADD - solo administrador (rol 3) */
router.post(
    "/",
    [verificarToken, verificarRol([3]), ...validacionDeObraSocial],
    obrasSocialesController.crearObraSocial
);

/* EDIT - solo administrador (rol 3) */
router.put(
    "/:id",
    [
        verificarToken,
        verificarRol([3]),
        param("id", "El ID debe ser un número entero").isInt({ min: 1 }),
        body("nombre", "El nombre es obligatorio").trim().notEmpty(),
        body("porcentaje_descuento", "El porcentaje debe ser un número").isDecimal(),
        body("es_particular", "es_particular debe ser 0 o 1").isInt({ min: 0, max: 1 }),
        validarCampos
    ],
    obrasSocialesController.editarObraSocial
);

/* DELETE - solo administrador (rol 3) */
router.delete("/:id", [verificarToken, verificarRol([3]), param("id", "El ID debe ser un número entero").isInt({ min: 1 }), validarCampos], obrasSocialesController.eliminarObraSocial);

module.exports = router;
