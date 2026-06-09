const db = require('../db/db');

const JOIN_MEDICO = `
    SELECT m.id_medico, m.matricula, m.descripcion, m.valor_consulta,
           u.id_usuario, u.apellido, u.nombres, u.email, u.foto_path,
           e.id_especialidad, e.nombre AS especialidad
    FROM medicos m
    JOIN usuarios u ON m.id_usuario = u.id_usuario
    JOIN especialidades e ON m.id_especialidad = e.id_especialidad
`;

const medicosService = {
    getAll: async () => {
        const [rows] = await db.query(`${JOIN_MEDICO} WHERE u.activo = 1`);
        return rows;
    },

    getAllByEspecialidad: async (id_especialidad) => {
        const [rows] = await db.query(
            `${JOIN_MEDICO} WHERE m.id_especialidad = ? AND u.activo = 1`, [id_especialidad]
        );
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(
            `${JOIN_MEDICO} WHERE m.id_medico = ? AND u.activo = 1`, [id]
        );
        return rows[0] || null;
    },

    create: async ({ id_usuario, id_especialidad, matricula, descripcion, valor_consulta }) => {
        const [result] = await db.query(
            "INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) VALUES (?, ?, ?, ?, ?)",
            [parseInt(id_usuario), parseInt(id_especialidad), parseInt(matricula), descripcion || null, parseFloat(valor_consulta)]
        );
        return result.insertId;
    },

    update: async (id, { id_especialidad, matricula, descripcion, valor_consulta }) => {
        const [result] = await db.query(
            "UPDATE medicos SET id_especialidad = ?, matricula = ?, descripcion = ?, valor_consulta = ? WHERE id_medico = ?",
            [parseInt(id_especialidad), parseInt(matricula), descripcion || null, parseFloat(valor_consulta), id]
        );
        return result.affectedRows;
    },

    delete: async (id) => {
        const [medico] = await db.query("SELECT id_usuario FROM medicos WHERE id_medico = ?", [id]);
        if (medico.length === 0) return 0;
        const [result] = await db.query("UPDATE usuarios SET activo = 0 WHERE id_usuario = ?", [medico[0].id_usuario]);
        return result.affectedRows;
    },

    asociarObraSocial: async (id_medico, id_obra_social) => {
        const [result] = await db.query(
            "INSERT INTO medicos_obras_sociales (id_medico, id_obra_social, activo) VALUES (?, ?, 1)",
            [id_medico, parseInt(id_obra_social)]
        );
        return result.insertId;
    },

    getObrasSociales: async (id_medico) => {
        const [rows] = await db.query(
            `SELECT os.id_obra_social, os.nombre, os.descripcion, os.porcentaje_descuento, os.es_particular
             FROM medicos_obras_sociales mos
             JOIN obras_sociales os ON mos.id_obra_social = os.id_obra_social
             WHERE mos.id_medico = ? AND mos.activo = 1 AND os.activo = 1`,
            [id_medico]
        );
        return rows;
    }
};

module.exports = medicosService;
