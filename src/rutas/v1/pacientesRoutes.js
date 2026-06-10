const express = require("express");
const router = express.Router();
const pacientesController = require("../../controladores/pacientesController");
const { body } = require("express-validator");
const { validarCampos } = require("../../middlewares/validador");
const verificarToken = require("../../middlewares/verificarToken");
const verificarRol = require("../../middlewares/verificarRol");

/* BROWSE - solo admin */
router.get("/", [verificarToken, verificarRol([3])], pacientesController.getPacientes);

/* READ - admin o paciente (rol 2 o 3) */
router.get("/:id", [verificarToken, verificarRol([2, 3])], pacientesController.getPacienteById);

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
        body("id_obra_social", "El id_obra_social es obligatorio").isInt({ min: 1 }),
        validarCampos
    ],
    pacientesController.editarPaciente
);

/* DELETE - solo admin */
router.delete("/:id", [verificarToken, verificarRol([3])], pacientesController.eliminarPaciente);

/* Asociar paciente con obra social - solo admin */
router.patch(
    "/:id/obras-sociales",
    [
        verificarToken,
        verificarRol([3]),
        body("id_obra_social", "El id_obra_social es obligatorio").isInt({ min: 1 }),
        validarCampos
    ],
    pacientesController.asociarObraSocial
);

module.exports = router;
