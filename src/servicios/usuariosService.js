const usuariosRepo = require('../repositorios/usuariosRepo');

const usuariosService = {
    getAll: () => usuariosRepo.getAll(),
    getById: (id) => usuariosRepo.getById(id),
    create: (data) => usuariosRepo.create(data),
    update: (id, data) => usuariosRepo.update(id, data),
    delete: (id) => usuariosRepo.softDelete(id),
    updateFoto: (id, foto_path) => usuariosRepo.updateFoto(id, foto_path)
};

module.exports = usuariosService;
