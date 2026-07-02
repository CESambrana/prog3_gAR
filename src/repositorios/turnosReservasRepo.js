const db = require('../db/db');

const turnosReservasRepo = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT tr.id_turno_reserva, tr.fecha_hora, tr.valor_total, tr.atendido,
                   u_m.apellido AS medico_apellido, u_m.nombres AS medico_nombres,
                   u_p.apellido AS paciente_apellido, u_p.nombres AS paciente_nombres,
                   os.nombre AS obra_social
            FROM turnos_reservas tr
            JOIN medicos m ON tr.id_medico = m.id_medico
            JOIN usuarios u_m ON m.id_usuario = u_m.id_usuario
            JOIN pacientes p ON tr.id_paciente = p.id_paciente
            JOIN usuarios u_p ON p.id_usuario = u_p.id_usuario
            JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
            WHERE tr.activo = 1
            ORDER BY tr.fecha_hora DESC
        `);
        return rows;
    },

    getByMedicoId: async (id_medico) => {
        const [rows] = await db.query(`
            SELECT tr.id_turno_reserva, tr.fecha_hora, tr.valor_total, tr.atendido,
                   u_p.apellido AS paciente_apellido, u_p.nombres AS paciente_nombres,
                   os.nombre AS obra_social
            FROM turnos_reservas tr
            JOIN pacientes p ON tr.id_paciente = p.id_paciente
            JOIN usuarios u_p ON p.id_usuario = u_p.id_usuario
            JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
            WHERE tr.id_medico = ? AND tr.activo = 1
            ORDER BY tr.fecha_hora DESC
        `, [id_medico]);
        return rows;
    },

    getByPacienteId: async (id_paciente) => {
        const [rows] = await db.query(`
            SELECT tr.id_turno_reserva, tr.fecha_hora, tr.valor_total, tr.atendido,
                   u_m.apellido AS medico_apellido, u_m.nombres AS medico_nombres,
                   e.nombre AS especialidad, os.nombre AS obra_social
            FROM turnos_reservas tr
            JOIN medicos m ON tr.id_medico = m.id_medico
            JOIN usuarios u_m ON m.id_usuario = u_m.id_usuario
            JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
            WHERE tr.id_paciente = ? AND tr.activo = 1
            ORDER BY tr.fecha_hora DESC
        `, [id_paciente]);
        return rows;
    },

    create: async (connection, { id_medico, id_paciente, id_obra_social, fecha_hora, valor_total }) => {
        const [result] = await connection.query(
            "INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total) VALUES (?, ?, ?, ?, ?)",
            [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total]
        );
        return result.insertId;
    },

    marcarAtendido: async (id, id_medico) => {
        const [result] = await db.query(
            "UPDATE turnos_reservas SET atendido = 1 WHERE id_turno_reserva = ? AND id_medico = ? AND activo = 1",
            [id, id_medico]
        );
        return result.affectedRows;
    },

    softDelete: async (id) => {
        const [result] = await db.query(
            "UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?", [id]
        );
        return result.affectedRows;
    }
};

module.exports = turnosReservasRepo;
