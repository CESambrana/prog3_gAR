const medicosService = require('../servicios/medicosService');

const medicosController = {
    getMedicos: async (req, res, next) => {
        try {
            const data = await medicosService.getAll();
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    },

    getMedicosPorEspecialidad: async (req, res, next) => {
        try {
            const data = await medicosService.getAllByEspecialidad(parseInt(req.params.id_especialidad));
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    },

    getMedicoById: async (req, res, next) => {
        try {
            const data = await medicosService.getById(parseInt(req.params.id));
            if (!data) return res.status(404).json({ status: false, mensaje: "Médico no encontrado" });
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    },

    crearMedico: async (req, res, next) => {
        try {
            const id_medico = await medicosService.create(req.body);
            res.status(201).json({ status: true, mensaje: "Médico creado correctamente", id_medico });
        } catch (error) {
            next(error);
        }
    },

    editarMedico: async (req, res, next) => {
        try {
            const affected = await medicosService.update(parseInt(req.params.id), req.body);
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Médico no encontrado para actualizar" });
            res.json({ status: true, mensaje: "Médico actualizado correctamente" });
        } catch (error) {
            next(error);
        }
    },

    eliminarMedico: async (req, res, next) => {
        try {
            const affected = await medicosService.delete(parseInt(req.params.id));
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Médico no encontrado" });
            res.json({ status: true, mensaje: "Médico dado de baja (lógica)" });
        } catch (error) {
            next(error);
        }
    },

    asociarObraSocial: async (req, res, next) => {
        try {
            const id_medico_obra_social = await medicosService.asociarObraSocial(
                parseInt(req.params.id), req.body.id_obra_social
            );
            res.status(201).json({ status: true, mensaje: "Obra social asociada al médico correctamente", id_medico_obra_social });
        } catch (error) {
            next(error);
        }
    },

    getObrasSocialesDelMedico: async (req, res, next) => {
        try {
            const data = await medicosService.getObrasSociales(parseInt(req.params.id));
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = medicosController;
