const pacientesService = require('../servicios/pacientesService');

const pacientesController = {
    getPacientes: async (req, res) => {
        try {
            const data = await pacientesService.getAll();
            res.json({ status: true, data });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al obtener pacientes", error: error.message });
        }
    },

    getPacienteById: async (req, res) => {
        try {
            const data = await pacientesService.getById(parseInt(req.params.id));
            if (!data) return res.status(404).json({ status: false, mensaje: "Paciente no encontrado" });
            res.json({ status: true, data });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al obtener paciente", error: error.message });
        }
    },

    crearPaciente: async (req, res) => {
        try {
            const id_paciente = await pacientesService.create(req.body);
            res.status(201).json({ status: true, mensaje: "Paciente creado correctamente", id_paciente });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al crear paciente", error: error.message });
        }
    },

    editarPaciente: async (req, res) => {
        try {
            const affected = await pacientesService.update(parseInt(req.params.id), req.body);
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Paciente no encontrado para actualizar" });
            res.json({ status: true, mensaje: "Paciente actualizado correctamente" });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al actualizar paciente", error: error.message });
        }
    },

    eliminarPaciente: async (req, res) => {
        try {
            const affected = await pacientesService.delete(parseInt(req.params.id));
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Paciente no encontrado" });
            res.json({ status: true, mensaje: "Paciente dado de baja (lógica)" });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al eliminar paciente", error: error.message });
        }
    },

    asociarObraSocial: async (req, res) => {
        try {
            const affected = await pacientesService.asociarObraSocial(parseInt(req.params.id), req.body.id_obra_social);
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Paciente no encontrado" });
            res.json({ status: true, mensaje: "Obra social asociada al paciente correctamente" });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al asociar obra social", error: error.message });
        }
    }
};

module.exports = pacientesController;
