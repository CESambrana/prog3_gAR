const db = require('../db/db');

const authRepo = {
    findByEmailAndPassword: async (email, contrasenia) => {
        const [rows] = await db.query(
            `SELECT id_usuario, apellido, nombres, email, rol
             FROM usuarios
             WHERE email = ? AND contrasenia = SHA2(?, 256) AND activo = 1`,
            [email, contrasenia]
        );
        return rows[0] || null;
    }
};

module.exports = authRepo;
