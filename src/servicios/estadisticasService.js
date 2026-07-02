const PDFDocument = require('pdfkit');
const estadisticasRepo = require('../repositorios/estadisticasRepo');

const rangoPorDefecto = () => {
    const hasta = new Date();
    const desde = new Date();
    desde.setMonth(desde.getMonth() - 1);
    const toISODate = (d) => d.toISOString().slice(0, 10);
    return { fechaDesde: toISODate(desde), fechaHasta: toISODate(hasta) };
};

const estadisticasService = {
    getPorEspecialidad: () => estadisticasRepo.getPorEspecialidad(),
    getPorObraSocial: () => estadisticasRepo.getPorObraSocial(),
    getPorMedico: () => estadisticasRepo.getPorMedico(),
    getPorPaciente: () => estadisticasRepo.getPorPaciente(),

    getPorRangoFechas: (fechaDesde, fechaHasta) => {
        if (!fechaDesde || !fechaHasta) {
            const rango = rangoPorDefecto();
            return estadisticasRepo.getPorRangoFechas(rango.fechaDesde, rango.fechaHasta);
        }
        return estadisticasRepo.getPorRangoFechas(fechaDesde, fechaHasta);
    },

    generarPdf: async (fechaDesde, fechaHasta) => {
        const rango = (!fechaDesde || !fechaHasta) ? rangoPorDefecto() : { fechaDesde, fechaHasta };
        const turnos = await estadisticasRepo.getPorRangoFechas(rango.fechaDesde, rango.fechaHasta);
        const porObraSocial = await estadisticasRepo.getPorObraSocial();

        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 40 });
            const buffers = [];

            doc.on('data', (chunk) => buffers.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);

            // --- Encabezado ---
            doc.fontSize(18).font('Helvetica-Bold')
                .text('Informe de Atenciones - Clínica Médica', { align: 'center' });
            doc.fontSize(10).font('Helvetica')
                .text(`Generado: ${new Date().toLocaleString('es-AR')}`, { align: 'center' });
            doc.text(`Período: ${rango.fechaDesde} al ${rango.fechaHasta}`, { align: 'center' });
            doc.moveDown();
            doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
            doc.moveDown();

            // --- Detalle de turnos ---
            doc.fontSize(13).font('Helvetica-Bold').text('Detalle de turnos');
            doc.moveDown(0.3);

            if (turnos.length === 0) {
                doc.fontSize(10).font('Helvetica').text('No se registraron turnos en el período seleccionado.');
            } else {
                const cols = [40, 70, 165, 250, 335, 420, 500];
                const headers = ['ID', 'Fecha', 'Médico', 'Especialidad', 'Paciente', 'Obra social', 'Valor'];

                doc.fontSize(8).font('Helvetica-Bold');
                headers.forEach((h, i) => doc.text(h, cols[i], doc.y, { width: 90, continued: i < headers.length - 1 }));
                doc.moveDown(0.4);
                doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
                doc.moveDown(0.3);

                let totalGeneral = 0;
                let atendidos = 0;

                doc.font('Helvetica').fontSize(7.5);
                turnos.forEach((t) => {
                    const y = doc.y;
                    if (y > 720) doc.addPage();

                    const fecha = new Date(t.fecha_hora).toLocaleString('es-AR', {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    });
                    const medico = `${t.medico_apellido}, ${t.medico_nombres}`.substring(0, 20);
                    const paciente = `${t.paciente_apellido}, ${t.paciente_nombres}`.substring(0, 20);

                    doc.text(String(t.id_turno_reserva), cols[0], y, { width: 25 });
                    doc.text(fecha, cols[1], y, { width: 90 });
                    doc.text(medico, cols[2], y, { width: 80 });
                    doc.text(t.especialidad, cols[3], y, { width: 80 });
                    doc.text(paciente, cols[4], y, { width: 80 });
                    doc.text(t.obra_social, cols[5], y, { width: 75 });
                    doc.text(`$${Number(t.valor_total).toFixed(2)}`, cols[6], y, { width: 55 });

                    totalGeneral += Number(t.valor_total);
                    if (t.atendido === 1) atendidos++;
                    doc.moveDown(1.1);
                });

                doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
                doc.moveDown(0.5);
                doc.fontSize(9).font('Helvetica-Bold');
                doc.text(`Total de turnos: ${turnos.length}    Atendidos: ${atendidos}    Pendientes: ${turnos.length - atendidos}`);
                doc.text(`Facturación total del período: $${totalGeneral.toFixed(2)}`);
            }

            // --- Resumen por obra social ---
            doc.moveDown(1.5);
            doc.fontSize(13).font('Helvetica-Bold').text('Resumen por obra social');
            doc.moveDown(0.3);

            const colsOS = [40, 250, 400];
            doc.fontSize(9).font('Helvetica-Bold');
            doc.text('Obra social', colsOS[0], doc.y, { width: 200, continued: true });
            doc.text('Turnos', colsOS[1], doc.y, { width: 130, continued: true });
            doc.text('Facturación', colsOS[2], doc.y, { width: 130 });
            doc.moveDown(0.3);
            doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
            doc.moveDown(0.3);

            doc.font('Helvetica').fontSize(9);
            porObraSocial.forEach((os) => {
                const y = doc.y;
                doc.text(os.obra_social, colsOS[0], y, { width: 200 });
                doc.text(String(os.cantidad_turnos), colsOS[1], y, { width: 130 });
                doc.text(`$${Number(os.facturacion_total).toFixed(2)}`, colsOS[2], y, { width: 130 });
                doc.moveDown(0.6);
            });

            doc.end();
        });
    }
};

module.exports = estadisticasService;
