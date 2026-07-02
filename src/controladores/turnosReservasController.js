const turnosReservasService = require('../servicios/turnosReservasService');

const turnosReservasController = {
    getTurnos: async (req, res, next) => {
        try {
            const data = await turnosReservasService.getAll();
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    },

    getMisTurnos: async (req, res, next) => {
        try {
            const { id_usuario, rol } = req.usuario;
            let data;
            if (rol === 1) {
                data = await turnosReservasService.getMisTurnosMedico(id_usuario);
                if (data === null) return res.status(404).json({ status: false, mensaje: "Médico no encontrado" });
            } else if (rol === 2) {
                data = await turnosReservasService.getMisTurnosPaciente(id_usuario);
                if (data === null) return res.status(404).json({ status: false, mensaje: "Paciente no encontrado" });
            } else {
                return res.status(403).json({ status: false, mensaje: "Acceso denegado" });
            }
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    },

    crearTurno: async (req, res, next) => {
        try {
            const { id_usuario, rol } = req.usuario;
            const { id_medico, fecha_hora, id_paciente } = req.body;
            if (rol === 3 && !id_paciente) {
                return res.status(400).json({ status: false, mensaje: "El id_paciente es obligatorio para administradores" });
            }
            const result = await turnosReservasService.create({ id_usuario, rol, id_medico, id_paciente, fecha_hora });
            res.status(201).json({ status: true, mensaje: "Turno creado correctamente", ...result });
        } catch (error) {
            next(error);
        }
    },

    marcarAtendido: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) return res.status(400).json({ status: false, mensaje: "ID de turno inválido" });
          
            const { observaciones } = req.body || {};
            const affected = await turnosReservasService.marcarAtendido(id, req.usuario.id_usuario, observaciones);
          
            if (affected === null) return res.status(404).json({ status: false, mensaje: "Médico no encontrado" });
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Turno no encontrado o no pertenece a este médico" });
            res.json({ status: true, mensaje: "Turno marcado como atendido" });
        } catch (error) {
            next(error);
        }
    },

    eliminarTurno: async (req, res, next) => {
        try {
            const affected = await turnosReservasService.delete(parseInt(req.params.id));
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Turno no encontrado" });
            res.json({ status: true, mensaje: "Turno eliminado (baja lógica)" });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = turnosReservasController;
