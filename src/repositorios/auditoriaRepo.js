const db = require('../db/db');

const auditoriaRepo = {
    registrar: async ({ id_usuario, metodo, ruta, status_code }) => {
        const [result] = await db.query(
            "INSERT INTO auditoria (id_usuario, metodo, ruta, status_code) VALUES (?, ?, ?, ?)",
            [id_usuario, metodo, ruta, status_code]
        );
        return result.insertId;
    },

    getAll: async () => {
        const [rows] = await db.query(`
            SELECT a.id_auditoria, a.metodo, a.ruta, a.status_code, a.fecha_hora,
                   u.apellido, u.nombres, u.rol
            FROM auditoria a
            JOIN usuarios u ON a.id_usuario = u.id_usuario
            ORDER BY a.fecha_hora DESC
            LIMIT 200
        `);
        return rows;
    },

    getByUsuario: async (id_usuario) => {
        const [rows] = await db.query(`
            SELECT a.id_auditoria, a.metodo, a.ruta, a.status_code, a.fecha_hora
            FROM auditoria a
            WHERE a.id_usuario = ?
            ORDER BY a.fecha_hora DESC
            LIMIT 200
        `, [id_usuario]);
        return rows;
    }
};

module.exports = auditoriaRepo;
