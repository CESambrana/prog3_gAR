const medicosService = require('../servicios/medicosService');

const medicosController = {
    getMedicos: async (req, res) => {
        try {
            const data = await medicosService.getAll();
            res.json({ status: true, data });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al obtener médicos", error: error.message });
        }
    },

    getMedicosPorEspecialidad: async (req, res) => {
        try {
            const data = await medicosService.getAllByEspecialidad(parseInt(req.params.id_especialidad));
            res.json({ status: true, data });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al obtener médicos por especialidad", error: error.message });
        }
    },

    getMedicoById: async (req, res) => {
        try {
            const data = await medicosService.getById(parseInt(req.params.id));
            if (!data) return res.status(404).json({ status: false, mensaje: "Médico no encontrado" });
            res.json({ status: true, data });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al obtener médico", error: error.message });
        }
    },

    crearMedico: async (req, res) => {
        try {
            const id_medico = await medicosService.create(req.body);
            res.status(201).json({ status: true, mensaje: "Médico creado correctamente", id_medico });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al crear médico", error: error.message });
        }
    },

    editarMedico: async (req, res) => {
        try {
            const affected = await medicosService.update(parseInt(req.params.id), req.body);
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Médico no encontrado para actualizar" });
            res.json({ status: true, mensaje: "Médico actualizado correctamente" });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al actualizar médico", error: error.message });
        }
    },

    eliminarMedico: async (req, res) => {
        try {
            const affected = await medicosService.delete(parseInt(req.params.id));
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Médico no encontrado" });
            res.json({ status: true, mensaje: "Médico dado de baja (lógica)" });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al eliminar médico", error: error.message });
        }
    },

    asociarObraSocial: async (req, res) => {
        try {
            const id_medico_obra_social = await medicosService.asociarObraSocial(
                parseInt(req.params.id), req.body.id_obra_social
            );
            res.status(201).json({ status: true, mensaje: "Obra social asociada al médico correctamente", id_medico_obra_social });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al asociar obra social", error: error.message });
        }
    },

    getObrasSocialesDelMedico: async (req, res) => {
        try {
            const data = await medicosService.getObrasSociales(parseInt(req.params.id));
            res.json({ status: true, data });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al obtener obras sociales del médico", error: error.message });
        }
    }
};

module.exports = medicosController;
