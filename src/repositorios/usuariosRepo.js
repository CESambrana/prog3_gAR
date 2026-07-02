const db = require('../db/db');

const usuariosRepo = {
    getAll: async () => {
        const [rows] = await db.query(
            "SELECT id_usuario, documento, apellido, nombres, email, foto_path, rol FROM usuarios WHERE activo = 1"
        );
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(
            "SELECT id_usuario, documento, apellido, nombres, email, foto_path, rol FROM usuarios WHERE id_usuario = ? AND activo = 1",
            [id]
        );
        return rows[0] || null;
    },

    create: async ({ documento, apellido, nombres, email, contrasenia, foto_path, rol }) => {
        const foto = foto_path || '';
        const [result] = await db.query(
            "INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo) VALUES (?, ?, ?, ?, SHA2(?, 256), ?, ?, 1)",
            [documento, apellido, nombres, email, contrasenia, foto, parseInt(rol)]
        );
        return result.insertId;
    },

    update: async (id, { documento, apellido, nombres, email, contrasenia, rol }) => {
        if (contrasenia) {
            const [result] = await db.query(
                "UPDATE usuarios SET documento=?, apellido=?, nombres=?, email=?, contrasenia=SHA2(?, 256), rol=? WHERE id_usuario=? AND activo=1",
                [documento, apellido, nombres, email, contrasenia, parseInt(rol), id]
            );
            return result.affectedRows;
        }
        const [result] = await db.query(
            "UPDATE usuarios SET documento=?, apellido=?, nombres=?, email=?, rol=? WHERE id_usuario=? AND activo=1",
            [documento, apellido, nombres, email, parseInt(rol), id]
        );
        return result.affectedRows;
    },

    softDelete: async (id) => {
        const [result] = await db.query(
            "UPDATE usuarios SET activo = 0 WHERE id_usuario = ?", [id]
        );
        return result.affectedRows;
    },

    updateFoto: async (id, foto_path) => {
        const [result] = await db.query(
            "UPDATE usuarios SET foto_path = ? WHERE id_usuario = ? AND activo = 1",
            [foto_path, id]
        );
        return result.affectedRows;
    }
};

module.exports = usuariosRepo;
