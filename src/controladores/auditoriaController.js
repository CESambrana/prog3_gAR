const auditoriaService = require('../servicios/auditoriaService');

const auditoriaController = {
    getAuditoria: async (req, res, next) => {
        try {
            const data = await auditoriaService.getAll();
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    },

    getAuditoriaPorUsuario: async (req, res, next) => {
        try {
            const data = await auditoriaService.getByUsuario(parseInt(req.params.id_usuario));
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = auditoriaController;
