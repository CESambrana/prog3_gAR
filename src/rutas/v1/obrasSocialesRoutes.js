const express = require("express");
const router = express.Router();
const obrasSocialesController = require("../../controladores/obrasSocialesController");
const { validacionDeObraSocial, validarCampos } = require("../../middlewares/validador");
const { body } = require("express-validator");
const verificarToken = require("../../middlewares/verificarToken");
const verificarRol = require("../../middlewares/verificarRol");

/* BROWSE - cualquier usuario autenticado */
router.get("/", verificarToken, obrasSocialesController.getObrasSociales);

/* READ - cualquier usuario autenticado */
router.get("/:id", verificarToken, obrasSocialesController.getObraSocialById);

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
        body("nombre", "El nombre es obligatorio").trim().notEmpty(),
        body("porcentaje_descuento", "El porcentaje debe ser un número").isDecimal(),
        body("es_particular", "es_particular debe ser 0 o 1").isInt({ min: 0, max: 1 }),
        validarCampos
    ],
    obrasSocialesController.editarObraSocial
);

/* DELETE - solo administrador (rol 3) */
router.delete("/:id", [verificarToken, verificarRol([3])], obrasSocialesController.eliminarObraSocial);

module.exports = router;
