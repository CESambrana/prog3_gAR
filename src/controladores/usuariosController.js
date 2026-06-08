const usuariosService = require('../servicios/usuariosService');

const usuariosController = {
    getUsuarios: async (req, res) => {
        try {
            const data = await usuariosService.getAll();
            res.json({ status: true, data });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al obtener usuarios", error: error.message });
        }
    },

    getUsuarioById: async (req, res) => {
        try {
            const data = await usuariosService.getById(parseInt(req.params.id));
            if (!data) return res.status(404).json({ status: false, mensaje: "Usuario no encontrado" });
            res.json({ status: true, data });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al obtener usuario", error: error.message });
        }
    },

    crearUsuario: async (req, res) => {
        try {
            const id_usuario = await usuariosService.create(req.body);
            res.status(201).json({ status: true, mensaje: "Creado correctamente", id_usuario });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al crear usuario", error: error.message });
        }
    },

    editarUsuario: async (req, res) => {
        try {
            const affected = await usuariosService.update(parseInt(req.params.id), req.body);
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Usuario no encontrado para actualizar" });
            res.json({ status: true, mensaje: "Usuario actualizado correctamente" });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al actualizar", error: error.message });
        }
    },

    eliminarUsuario: async (req, res) => {
        try {
            const affected = await usuariosService.delete(parseInt(req.params.id));
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Usuario no encontrado para eliminar" });
            res.json({ status: true, mensaje: "Usuario dado de baja (lógica)" });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al eliminar", error: error.message });
        }
    },

    patchFoto: async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ status: false, mensaje: "No se recibió ninguna imagen" });
            const foto_path = `uploads/fotos/${req.file.filename}`;
            const affected = await usuariosService.updateFoto(parseInt(req.params.id), foto_path);
            if (affected === 0) return res.status(404).json({ status: false, mensaje: "Usuario no encontrado" });
            res.json({ status: true, mensaje: "Foto actualizada correctamente", foto_path });
        } catch (error) {
            res.status(500).json({ status: false, mensaje: "Error al actualizar foto", error: error.message });
        }
    }
};

module.exports = usuariosController;
