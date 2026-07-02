const medicosRepo = require('../repositorios/medicosRepo');
const usuariosRepo = require('../repositorios/usuariosRepo');

const medicosService = {
    getAll: () => medicosRepo.getAll(),
    getAllByEspecialidad: (id_especialidad) => medicosRepo.getAllByEspecialidad(id_especialidad),
    getById: (id) => medicosRepo.getById(id),
    create: (data) => medicosRepo.create(data),
    update: (id, data) => medicosRepo.update(id, data),

    delete: async (id) => {
        const medico = await medicosRepo.getIdUsuario(id);
        if (!medico) return 0;
        return usuariosRepo.softDelete(medico.id_usuario);
    },

    asociarObraSocial: (id_medico, id_obra_social) => medicosRepo.asociarObraSocial(id_medico, id_obra_social),
    getObrasSociales: (id_medico) => medicosRepo.getObrasSociales(id_medico)
};

module.exports = medicosService;
