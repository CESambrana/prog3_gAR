const especialidadesService = require('../servicios/especialidadesService');

const especialidadesController = {
    getEspecialidades: async (req, res) => {
        try {
            const data = await especialidadesService.getAll();
            res.json({ status: true, data });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al obtener especialidades", error: error.message });
        }
    },

    getEspecialidadById: async (req, res) => {
        try {
            const data = await especialidadesService.getById(parseInt(req.params.id));
            if (!data) return res.status(404).json({ status: false, mensaje: "Especialidad no encontrada" });
            res.json({ status: true, data });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al obtener especialidad", error: error.message });
        }
    },

    crearEspecialidad: async (req, res) => {
        try {
            const id_especialidad = await especialidadesService.create(req.body);
            res.status(201).json({ status: true, mensaje: "Especialidad creada correctamente", id_especialidad });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al crear especialidad", error: error.message });
        }
    },

    editarEspecialidad: async (req, res) => {
        try {
            const affected = await especialidadesService.update(parseInt(req.params.id), req.body);
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Especialidad no encontrada para actualizar" });
            res.json({ status: true, mensaje: "Especialidad actualizada correctamente" });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al actualizar especialidad", error: error.message });
        }
    },

    eliminarEspecialidad: async (req, res) => {
        try {
            const affected = await especialidadesService.delete(parseInt(req.params.id));
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Especialidad no encontrada para eliminar" });
            res.json({ status: true, mensaje: "Especialidad dada de baja (lógica)" });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al eliminar especialidad", error: error.message });
        }
    }
};

module.exports = especialidadesController;
