const pacientesRepo = require('../repositorios/pacientesRepo');
const usuariosRepo = require('../repositorios/usuariosRepo');

const pacientesService = {
    getAll: () => pacientesRepo.getAll(),
    getById: (id) => pacientesRepo.getById(id),
    create: (data) => pacientesRepo.create(data),
    update: (id, data) => pacientesRepo.update(id, data),

    delete: async (id) => {
        const paciente = await pacientesRepo.getIdUsuario(id);
        if (!paciente) return 0;
        return usuariosRepo.softDelete(paciente.id_usuario);
    },

    asociarObraSocial: (id, id_obra_social) => pacientesRepo.asociarObraSocial(id, id_obra_social)
};

module.exports = pacientesService;
