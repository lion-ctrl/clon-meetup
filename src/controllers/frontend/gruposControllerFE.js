const Grupos = require("../../models/Grupos");
const Meeti = require("../../models/Meeti");

exports.mostrarGrupo = async (req, res, next) => {
	const [grupo, meetis] = await Promise.all([
		Grupos.findOne({ where: { id: req.params.id } }),
		Meeti.findAll({
			where: { grupoId: req.params.id },
			order: [["fecha", "ASC"]],
		}),
	]);

	if (!grupo) {
		res.redirect("/");
		return;
	}

	res.render("grupos/mostrar-grupo", {
		nombrePagina: `Informacion Grupo ${grupo.nombre}`,
		grupo,
		meetis,
	});
};
