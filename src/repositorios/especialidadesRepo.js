const db = require('../db/db');

const especialidadesRepo = {
    getAll: async () => {
        const [rows] = await db.query("SELECT * FROM especialidades WHERE activo = 1");
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(
            "SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1", [id]
        );
        return rows[0] || null;
    },

    create: async ({ nombre }) => {
        const [result] = await db.query(
            "INSERT INTO especialidades (nombre, activo) VALUES (?, 1)", [nombre]
        );
        return result.insertId;
    },

    update: async (id, { nombre }) => {
        const [result] = await db.query(
            "UPDATE especialidades SET nombre = ? WHERE id_especialidad = ? AND activo = 1", [nombre, id]
        );
        return result.affectedRows;
    },

    softDelete: async (id) => {
        const [result] = await db.query(
            "UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?", [id]
        );
        return result.affectedRows;
    }
};

module.exports = especialidadesRepo;
