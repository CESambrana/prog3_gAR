const pacientesService = require('../servicios/pacientesService');

const pacientesController = {
    getPacientes: async (req, res, next) => {
        try {
            const data = await pacientesService.getAll();
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    },

    getPacienteById: async (req, res, next) => {
        try {
            const data = await pacientesService.getById(parseInt(req.params.id));
            if (!data) return res.status(404).json({ status: false, mensaje: "Paciente no encontrado" });
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    },

    crearPaciente: async (req, res, next) => {
        try {
            const id_paciente = await pacientesService.create(req.body);
            res.status(201).json({ status: true, mensaje: "Paciente creado correctamente", id_paciente });
        } catch (error) {
            next(error);
        }
    },

    editarPaciente: async (req, res, next) => {
        try {
            const affected = await pacientesService.update(parseInt(req.params.id), req.body);
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Paciente no encontrado para actualizar" });
            res.json({ status: true, mensaje: "Paciente actualizado correctamente" });
        } catch (error) {
            next(error);
        }
    },

    eliminarPaciente: async (req, res, next) => {
        try {
            const affected = await pacientesService.delete(parseInt(req.params.id));
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Paciente no encontrado" });
            res.json({ status: true, mensaje: "Paciente dado de baja (lógica)" });
        } catch (error) {
            next(error);
        }
    },

    asociarObraSocial: async (req, res, next) => {
        try {
            const affected = await pacientesService.asociarObraSocial(parseInt(req.params.id), req.body.id_obra_social);
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Paciente no encontrado" });
            res.json({ status: true, mensaje: "Obra social asociada al paciente correctamente" });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = pacientesController;
