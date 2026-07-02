const jwt = require('jsonwebtoken');
const authRepo = require('../repositorios/authRepo');

const authService = {
    login: async (email, contrasenia) => {
        const usuario = await authRepo.findByEmailAndPassword(email, contrasenia);
        if (!usuario) return null;
        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, nombres: usuario.nombres, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return token;
    }
};

module.exports = authService;
