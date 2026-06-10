const estadisticasService = require('../servicios/estadisticasService');
const PDFDocument = require('pdfkit');

const estadisticasController = {
    getEstadisticas: async (req, res) => {
        try {
            const data = await estadisticasService.getEstadisticas();
            res.json({ status: true, ...data });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al obtener estadísticas", error: error.message });
        }
    },

    getEstadisticasPdf: async (req, res) => {
        try {
            const { resumen, por_medico, por_obra_social } = await estadisticasService.getEstadisticas();

            const doc = new PDFDocument({ margin: 50 });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=estadisticas_atenciones.pdf');
            doc.pipe(res);

            doc.fontSize(18).font('Helvetica-Bold').text('Estadísticas de Atenciones', { align: 'center' });
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica').text(`Generado: ${new Date().toLocaleString('es-AR')}`, { align: 'center' });
            doc.moveDown(2);

            doc.fontSize(14).font('Helvetica-Bold').text('Resumen General');
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica');
            doc.text(`Total de turnos: ${resumen.total_turnos}`);
            doc.text(`Turnos atendidos: ${resumen.turnos_atendidos}`);
            doc.text(`Turnos pendientes: ${resumen.turnos_pendientes}`);
            doc.text(`Total de ingresos: $${resumen.total_ingresos}`);
            doc.moveDown(1.5);

            doc.fontSize(14).font('Helvetica-Bold').text('Turnos por Médico');
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica');
            por_medico.forEach(m => {
                doc.text(`${m.medico}  |  Turnos: ${m.total_turnos}  |  Atendidos: ${m.atendidos}  |  Ingresos: $${m.ingresos}`);
            });
            doc.moveDown(1.5);

            doc.fontSize(14).font('Helvetica-Bold').text('Turnos por Obra Social');
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica');
            por_obra_social.forEach(os => {
                doc.text(`${os.obra_social}  |  Turnos: ${os.total_turnos}  |  Ingresos: $${os.ingresos}`);
            });

            doc.end();
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al generar PDF", error: error.message });
        }
    }
};

module.exports = estadisticasController;
