const db = require('../db/db');
const turnosReservasRepo = require('../repositorios/turnosReservasRepo');
const medicosRepo = require('../repositorios/medicosRepo');
const pacientesRepo = require('../repositorios/pacientesRepo');
const obrasSocialesRepo = require('../repositorios/obrasSocialesRepo');

const formatTurnoDTO = (turno) => ({
    id: turno.id_turno_reserva,
    fecha: turno.fecha_hora,
    valor: turno.valor_total,
    atendido: turno.atendido === 1,
    medico: turno.medico_apellido ? `${turno.medico_apellido}, ${turno.medico_nombres}` : undefined,
    paciente: turno.paciente_apellido ? `${turno.paciente_apellido}, ${turno.paciente_nombres}` : undefined,
    especialidad: turno.especialidad || undefined,
    obra_social: turno.obra_social || undefined
});

const turnosReservasService = {
    getAll: async () => {
        const rows = await turnosReservasRepo.getAll();
        return rows.map(formatTurnoDTO);
    },

    getMisTurnosMedico: async (id_usuario) => {
        const medico = await medicosRepo.getByUsuarioId(id_usuario);
        if (!medico) return null;
        const rows = await turnosReservasRepo.getByMedicoId(medico.id_medico);
        return rows.map(formatTurnoDTO);
    },

    getMisTurnosPaciente: async (id_usuario) => {
        const paciente = await pacientesRepo.getByUsuarioId(id_usuario);
        if (!paciente) return null;
        const rows = await turnosReservasRepo.getByPacienteId(paciente.id_paciente);
        return rows.map(formatTurnoDTO);
    },

    create: async ({ id_usuario, rol, id_medico, id_paciente, fecha_hora }) => {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            if (rol === 2) {
                const paciente = await pacientesRepo.getByUsuarioId(id_usuario);
                if (!paciente) throw { status: 404, mensaje: "Paciente no encontrado para este usuario" };
                id_paciente = paciente.id_paciente;
            }

            const medicoData = await medicosRepo.getValorConsulta(parseInt(id_medico));
            if (!medicoData) throw { status: 404, mensaje: "Médico no encontrado" };

            const pacienteData = await pacientesRepo.getObraSocial(parseInt(id_paciente));
            if (!pacienteData) throw { status: 404, mensaje: "Paciente no encontrado" };

            const osData = await obrasSocialesRepo.getById(pacienteData.id_obra_social);
            if (!osData) throw { status: 404, mensaje: "Obra social no encontrada o inactiva" };

            const { valor_consulta } = medicoData;
            const { porcentaje_descuento, es_particular } = osData;
            const valor_total = es_particular == 1
                ? parseFloat(valor_consulta)
                : parseFloat(valor_consulta) - (parseFloat(porcentaje_descuento) * parseFloat(valor_consulta) / 100);

            const insertId = await turnosReservasRepo.create(connection, {
                id_medico: parseInt(id_medico),
                id_paciente: parseInt(id_paciente),
                id_obra_social: pacienteData.id_obra_social,
                fecha_hora,
                valor_total: valor_total.toFixed(2)
            });

            await connection.commit();
            connection.release();
            return { id_turno_reserva: insertId, valor_total: valor_total.toFixed(2) };
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    },

    marcarAtendido: async (id, id_usuario) => {
        const medico = await medicosRepo.getByUsuarioId(id_usuario);
        if (!medico) return null;
        return turnosReservasRepo.marcarAtendido(id, medico.id_medico);
    },

    delete: (id) => turnosReservasRepo.softDelete(id)
};

module.exports = turnosReservasService;
