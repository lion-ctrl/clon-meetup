const Usuarios = require("../../models/Usuarios");
const Grupos = require("../../models/Grupos");

// * mustrar pefil usuario
exports.muestraPerfil = async (req, res) => {
	const [usuario,grupos] = await Promise.all([
		Usuarios.findOne({ where: { id: req.params.id } }),
		Grupos.findAll({ where: { usuarioId: req.params.id } }),
	]);

    if (!usuario) {
        res.redirect("/");
        return;
    }

    res.render("usuario/mostrar-perfil",{
        nombrePagina:`Perfil Usuario: ${usuario.nombre}`,
        usuario,
        grupos
    })
};
