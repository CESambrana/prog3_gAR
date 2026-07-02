const usuariosService = require('../servicios/usuariosService');

const usuariosController = {
    getUsuarios: async (req, res, next) => {
        try {
            const data = await usuariosService.getAll();
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    },

    getUsuarioById: async (req, res, next) => {
        try {
            const data = await usuariosService.getById(parseInt(req.params.id));
            if (!data) return res.status(404).json({ status: false, mensaje: "Usuario no encontrado" });
            res.json({ status: true, data });
        } catch (error) {
            next(error);
        }
    },

    crearUsuario: async (req, res, next) => {
        try {
            const id_usuario = await usuariosService.create(req.body);
            res.status(201).json({ status: true, mensaje: "Creado correctamente", id_usuario });
        } catch (error) {
            next(error);
        }
    },

    editarUsuario: async (req, res, next) => {
        try {
            const affected = await usuariosService.update(parseInt(req.params.id), req.body);
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Usuario no encontrado para actualizar" });
            res.json({ status: true, mensaje: "Usuario actualizado correctamente" });
        } catch (error) {
            next(error);
        }
    },

    eliminarUsuario: async (req, res, next) => {
        try {
            const affected = await usuariosService.delete(parseInt(req.params.id));
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Usuario no encontrado para eliminar" });
            res.json({ status: true, mensaje: "Usuario dado de baja (lógica)" });
        } catch (error) {
            next(error);
        }
    },

    patchFoto: async (req, res, next) => {
        try {
            if (!req.file) return res.status(400).json({ status: false, mensaje: "No se recibió ninguna imagen" });
            const foto_path = `uploads/fotos/${req.file.filename}`;
            const affected = await usuariosService.updateFoto(parseInt(req.params.id), foto_path);
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Usuario no encontrado" });
            res.json({ status: true, mensaje: "Foto actualizada correctamente", foto_path });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = usuariosController;
