const db = require('../db/db');

const JOIN_PACIENTE = `
    SELECT p.id_paciente, p.id_usuario, p.id_obra_social,
           u.apellido, u.nombres, u.email, u.foto_path,
           os.nombre AS obra_social, os.porcentaje_descuento, os.es_particular
    FROM pacientes p
    JOIN usuarios u ON p.id_usuario = u.id_usuario
    JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
`;

const pacientesRepo = {
    getAll: async () => {
        const [rows] = await db.query(`${JOIN_PACIENTE} WHERE u.activo = 1`);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(
            `${JOIN_PACIENTE} WHERE p.id_paciente = ? AND u.activo = 1`, [id]
        );
        return rows[0] || null;
    },

    getByUsuarioId: async (id_usuario) => {
        const [rows] = await db.query(
            "SELECT id_paciente FROM pacientes WHERE id_usuario = ?", [id_usuario]
        );
        return rows[0] || null;
    },

    getObraSocial: async (id_paciente) => {
        const [rows] = await db.query(
            "SELECT id_obra_social FROM pacientes WHERE id_paciente = ?", [id_paciente]
        );
        return rows[0] || null;
    },

    getIdUsuario: async (id) => {
        const [rows] = await db.query(
            "SELECT id_usuario FROM pacientes WHERE id_paciente = ?", [id]
        );
        return rows[0] || null;
    },

    create: async ({ id_usuario, id_obra_social }) => {
        const [result] = await db.query(
            "INSERT INTO pacientes (id_usuario, id_obra_social) VALUES (?, ?)",
            [parseInt(id_usuario), parseInt(id_obra_social)]
        );
        return result.insertId;
    },

    update: async (id, { id_obra_social }) => {
        const [result] = await db.query(
            "UPDATE pacientes SET id_obra_social = ? WHERE id_paciente = ?",
            [parseInt(id_obra_social), id]
        );
        return result.affectedRows;
    },

    asociarObraSocial: async (id, id_obra_social) => {
        const [result] = await db.query(
            "UPDATE pacientes SET id_obra_social = ? WHERE id_paciente = ?",
            [parseInt(id_obra_social), id]
        );
        return result.affectedRows;
    }
};

module.exports = pacientesRepo;
