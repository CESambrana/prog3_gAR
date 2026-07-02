const obrasSocialesRepo = require('../repositorios/obrasSocialesRepo');

const obrasSocialesService = {
    getAll: () => obrasSocialesRepo.getAll(),
    getById: (id) => obrasSocialesRepo.getById(id),
    create: (data) => obrasSocialesRepo.create(data),
    update: (id, data) => obrasSocialesRepo.update(id, data),
    delete: (id) => obrasSocialesRepo.softDelete(id)
};

module.exports = obrasSocialesService;
