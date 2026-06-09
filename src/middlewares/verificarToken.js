const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Espera: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ status: false, mensaje: "Token requerido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // { id_usuario, nombres, rol }
        next();
    } catch (error) {
        return res.status(403).json({ status: false, mensaje: "Token inválido o expirado" });
    }
};

module.exports = verificarToken;
