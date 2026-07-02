const db = require('../db/db');

const estadisticasRepo = {
    getPorEspecialidad: async () => {
        const [results] = await db.query('CALL sp_estadisticas_atenciones()');
        return results[0];
    },

    getPorObraSocial: async () => {
        const [results] = await db.query('CALL sp_estadisticas_por_obra_social()');
        return results[0];
    },

    getPorMedico: async () => {
        const [results] = await db.query('CALL sp_estadisticas_por_medico()');
        return results[0];
    },

    getPorPaciente: async () => {
        const [results] = await db.query('CALL sp_estadisticas_por_paciente()');
        return results[0];
    },

    getPorRangoFechas: async (fechaDesde, fechaHasta) => {
        const [results] = await db.query(
            'CALL sp_estadisticas_por_rango_fechas(?, ?)',
            [fechaDesde, fechaHasta]
        );
        return results[0];
    }
};

module.exports = estadisticasRepo;
