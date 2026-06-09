const express = require("express");
const router = express.Router();
const authController = require("../../controladores/authController");
const { body } = require("express-validator");
const { validarCampos } = require("../../middlewares/validador");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, contrasenia]
 *             properties:
 *               email:
 *                 type: string
 *                 example: ferben@correo.com
 *               contrasenia:
 *                 type: string
 *                 example: ferben
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token JWT
 *       401:
 *         description: Credenciales inválidas
 */
/* LOGIN */
router.post(
    "/login",
    [
        body("email", "El email es obligatorio y debe ser válido").isEmail(),
        body("contrasenia", "La contraseña es obligatoria").notEmpty(),
        validarCampos
    ],
    authController.login
);

module.exports = router;
