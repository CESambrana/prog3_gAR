const db = require('../db/db');

const obrasSocialesService = {
    getAll: async () => {
        const [rows] = await db.query("SELECT * FROM obras_sociales WHERE activo = 1");
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(
            "SELECT * FROM obras_sociales WHERE id_obra_social = ? AND activo = 1", [id]
        );
        return rows[0] || null;
    },

    create: async ({ nombre, descripcion, porcentaje_descuento, es_particular }) => {
        const [result] = await db.query(
            "INSERT INTO obras_sociales (nombre, descripcion, porcentaje_descuento, es_particular, activo) VALUES (?, ?, ?, ?, 1)",
            [nombre, descripcion || '', porcentaje_descuento, parseInt(es_particular)]
        );
        return result.insertId;
    },

    update: async (id, { nombre, descripcion, porcentaje_descuento, es_particular }) => {
        const [result] = await db.query(
            "UPDATE obras_sociales SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ? WHERE id_obra_social = ? AND activo = 1",
            [nombre, descripcion || '', porcentaje_descuento, parseInt(es_particular), id]
        );
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.query(
            "UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ?", [id]
        );
        return result.affectedRows;
    }
};

module.exports = obrasSocialesService;
