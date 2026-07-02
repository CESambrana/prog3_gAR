const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const mensaje = err.mensaje || err.message || 'Error interno del servidor';
    res.status(status).json({ status: false, mensaje });
};

module.exports = errorHandler;
