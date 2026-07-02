const especialidadesService = require('../servicios/especialidadesService');

const especialidadesController = {
    getEspecialidades: async (req, res, next) => {
        try {
            const data = await especialidadesService.getAll();
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    },

    getEspecialidadById: async (req, res, next) => {
        try {
            const data = await especialidadesService.getById(parseInt(req.params.id));
            if (!data) return res.status(404).json({ status: false, mensaje: "Especialidad no encontrada" });
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    },

    crearEspecialidad: async (req, res, next) => {
        try {
            const id_especialidad = await especialidadesService.create(req.body);
            res.status(201).json({ status: true, mensaje: "Especialidad creada correctamente", id_especialidad });
        } catch (error) {
            next(error);
        }
    },

    editarEspecialidad: async (req, res, next) => {
        try {
            const affected = await especialidadesService.update(parseInt(req.params.id), req.body);
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Especialidad no encontrada para actualizar" });
            res.json({ status: true, mensaje: "Especialidad actualizada correctamente" });
        } catch (error) {
            next(error);
        }
    },

    eliminarEspecialidad: async (req, res, next) => {
        try {
            const affected = await especialidadesService.delete(parseInt(req.params.id));
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Especialidad no encontrada para eliminar" });
            res.json({ status: true, mensaje: "Especialidad dada de baja (lógica)" });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = especialidadesController;
