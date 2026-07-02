const estadisticasService = require('../servicios/estadisticasService');

const estadisticasController = {
    getPorEspecialidad: async (req, res, next) => {
        try {
            const data = await estadisticasService.getPorEspecialidad();
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    },

    getPorObraSocial: async (req, res, next) => {
        try {
            const data = await estadisticasService.getPorObraSocial();
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    },

    getPorMedico: async (req, res, next) => {
        try {
            const data = await estadisticasService.getPorMedico();
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    },

    getPorPaciente: async (req, res, next) => {
        try {
            const data = await estadisticasService.getPorPaciente();
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    },

    getPorRangoFechas: async (req, res, next) => {
        try {
            const { desde, hasta } = req.query;
            const data = await estadisticasService.getPorRangoFechas(desde, hasta);
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    },

    getEstadisticasPdf: async (req, res, next) => {
        try {
            const { desde, hasta } = req.query;
            const pdfBuffer = await estadisticasService.generarPdf(desde, hasta);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=informe_atenciones.pdf');
            res.send(pdfBuffer);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = estadisticasController;
