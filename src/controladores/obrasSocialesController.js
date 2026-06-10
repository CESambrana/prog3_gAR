const obrasSocialesService = require('../servicios/obrasSocialesService');

const obrasSocialesController = {
    getObrasSociales: async (req, res) => {
        try {
            const data = await obrasSocialesService.getAll();
            res.json({ status: true, data });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al obtener obras sociales", error: error.message });
        }
    },

    getObraSocialById: async (req, res) => {
        try {
            const data = await obrasSocialesService.getById(parseInt(req.params.id));
            if (!data) return res.status(404).json({ status: false, mensaje: "Obra social no encontrada" });
            res.json({ status: true, data });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al obtener obra social", error: error.message });
        }
    },

    crearObraSocial: async (req, res) => {
        try {
            const id_obra_social = await obrasSocialesService.create(req.body);
            res.status(201).json({ status: true, mensaje: "Obra social creada correctamente", id_obra_social });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al crear obra social", error: error.message });
        }
    },

    editarObraSocial: async (req, res) => {
        try {
            const affected = await obrasSocialesService.update(parseInt(req.params.id), req.body);
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Obra social no encontrada para actualizar" });
            res.json({ status: true, mensaje: "Obra social actualizada correctamente" });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al actualizar obra social", error: error.message });
        }
    },

    eliminarObraSocial: async (req, res) => {
        try {
            const affected = await obrasSocialesService.delete(parseInt(req.params.id));
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Obra social no encontrada para eliminar" });
            res.json({ status: true, mensaje: "Obra social dada de baja (lógica)" });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al eliminar obra social", error: error.message });
        }
    }
};

module.exports = obrasSocialesController;
