const authService = require('../servicios/authService');

const authController = {
    login: async (req, res) => {
        try {
            const { email, contrasenia } = req.body;
            const token = await authService.login(email, contrasenia);
            if (!token) {
                return res.status(401).json({ status: false, mensaje: "Credenciales inválidas" });
            }
            res.json({ status: true, mensaje: "Login exitoso", token });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al iniciar sesión", error: error.message });
        }
    }
};

module.exports = authController;
