// Uso: verificarRol([1, 3]) --> solo médicos y admins
const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ status: false, mensaje: "No autenticado" });
        }
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ status: false, mensaje: "Acceso denegado. Sin permisos suficientes." });
        }
        next();
    };
};

module.exports = verificarRol;
