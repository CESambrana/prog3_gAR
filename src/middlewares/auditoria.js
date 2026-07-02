const auditoriaRepo = require('../repositorios/auditoriaRepo');

const METODOS_AUDITABLES = ['POST', 'PUT', 'PATCH', 'DELETE'];

const registrarAuditoria = (req, res, next) => {
    if (!METODOS_AUDITABLES.includes(req.method)) {
        return next();
    }

    res.on('finish', () => {
        if (!req.usuario) return;

        auditoriaRepo
            .registrar({
                id_usuario: req.usuario.id_usuario,
                metodo: req.method,
                ruta: req.originalUrl,
                status_code: res.statusCode
            })
            .catch((error) => console.error('No se pudo registrar la auditoría:', error.message));
    });

    next();
};

module.exports = registrarAuditoria;
