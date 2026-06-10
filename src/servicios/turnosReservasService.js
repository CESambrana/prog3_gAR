const db = require('../db/db');

const turnosReservasService = {
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

    getMisTurnosMedico: async (id_usuario) => {
        const [medico] = await db.query("SELECT id_medico FROM medicos WHERE id_usuario = ?", [id_usuario]);
        if (medico.length === 0) return null;
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
        `, [medico[0].id_medico]);
        return rows;
    },

    getMisTurnosPaciente: async (id_usuario) => {
        const [paciente] = await db.query("SELECT id_paciente FROM pacientes WHERE id_usuario = ?", [id_usuario]);
        if (paciente.length === 0) return null;
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
        `, [paciente[0].id_paciente]);
        return rows;
    },

    create: async ({ id_usuario, rol, id_medico, id_paciente, fecha_hora }) => {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            if (rol === 2) {
                const [pacienteRows] = await connection.query(
                    "SELECT id_paciente FROM pacientes WHERE id_usuario = ?", [id_usuario]
                );
                if (pacienteRows.length === 0) throw { status: 404, mensaje: "Paciente no encontrado para este usuario" };
                id_paciente = pacienteRows[0].id_paciente;
            }

            const [medicoRows] = await connection.query(
                "SELECT valor_consulta FROM medicos WHERE id_medico = ?", [parseInt(id_medico)]
            );
            if (medicoRows.length === 0) throw { status: 404, mensaje: "Médico no encontrado" };

            const [pacienteRows2] = await connection.query(
                "SELECT id_obra_social FROM pacientes WHERE id_paciente = ?", [parseInt(id_paciente)]
            );
            if (pacienteRows2.length === 0) throw { status: 404, mensaje: "Paciente no encontrado" };

            const { id_obra_social } = pacienteRows2[0];
            const [osRows] = await connection.query(
                "SELECT porcentaje_descuento, es_particular FROM obras_sociales WHERE id_obra_social = ? AND activo = 1",
                [id_obra_social]
            );
            if (osRows.length === 0) throw { status: 404, mensaje: "Obra social no encontrada o inactiva" };

            const { valor_consulta } = medicoRows[0];
            const { porcentaje_descuento, es_particular } = osRows[0];
            const valor_total = es_particular == 1
                ? parseFloat(valor_consulta)
                : parseFloat(valor_consulta) - (parseFloat(porcentaje_descuento) * parseFloat(valor_consulta) / 100);

            const [result] = await connection.query(
                "INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total) VALUES (?, ?, ?, ?, ?)",
                [parseInt(id_medico), parseInt(id_paciente), id_obra_social, fecha_hora, valor_total.toFixed(2)]
            );

            await connection.commit();
            connection.release();
            return { id_turno_reserva: result.insertId, valor_total: valor_total.toFixed(2) };
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    },

    marcarAtendido: async (id, id_usuario, observaciones) => {
        const [medico] = await db.query("SELECT id_medico FROM medicos WHERE id_usuario = ?", [id_usuario]);
        if (medico.length === 0) return null;
        const [result] = await db.query(
            "UPDATE turnos_reservas SET atendido = 1, observaciones = ? WHERE id_turno_reserva = ? AND id_medico = ? AND activo = 1",
            [observaciones || null, id, medico[0].id_medico]
        );
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.query(
            "UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?", [id]
        );
        return result.affectedRows;
    }
};

module.exports = turnosReservasService;
