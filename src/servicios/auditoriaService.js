const auditoriaRepo = require('../repositorios/auditoriaRepo');

const auditoriaService = {
    getAll: () => auditoriaRepo.getAll(),
    getByUsuario: (id_usuario) => auditoriaRepo.getByUsuario(id_usuario)
};

module.exports = auditoriaService;
