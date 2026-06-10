const db = require('../db/db');
const jwt = require('jsonwebtoken');

const authService = {
    login: async (email, contrasenia) => {
        const [rows] = await db.query(
            `SELECT id_usuario, apellido, nombres, email, rol
             FROM usuarios
             WHERE email = ? AND contrasenia = SHA2(?, 256) AND activo = 1`,
            [email, contrasenia]
        );
        if (rows.length === 0) return null;
        const usuario = rows[0];
        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, nombres: usuario.nombres, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return token;
    }
};

module.exports = authService;
