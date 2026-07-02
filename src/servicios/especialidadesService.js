const especialidadesRepo = require('../repositorios/especialidadesRepo');

const especialidadesService = {
    getAll: () => especialidadesRepo.getAll(),
    getById: (id) => especialidadesRepo.getById(id),
    create: (data) => especialidadesRepo.create(data),
    update: (id, data) => especialidadesRepo.update(id, data),
    delete: (id) => especialidadesRepo.softDelete(id)
};

module.exports = especialidadesService;
