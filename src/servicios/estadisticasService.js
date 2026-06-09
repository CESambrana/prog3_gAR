const db = require('../db/db');

const estadisticasService = {
    getEstadisticas: async () => {
        const [results] = await db.query('CALL sp_estadisticas_atenciones()');
        return {
            resumen: results[0][0],
            por_medico: results[1],
            por_obra_social: results[2]
        };
    }
};

module.exports = estadisticasService;
