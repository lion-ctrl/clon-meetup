const Op = require("sequelize").Op;

const Grupos = require("../models/Grupos");
const Meeti = require("../models/Meeti");

exports.panelAdministracion = async (req, res) => {
	// console.log(new Date());
	const [grupos, meetis,anteriores] = await Promise.all([
		Grupos.findAll({ where: { usuarioId: req.user.id } }),
		Meeti.findAll({
			where: { usuarioId: req.user.id, fecha: { [Op.gte]: new Date() } },
			order:[["fecha","DESC"]]
		}),
		Meeti.findAll({
			where: { usuarioId: req.user.id, fecha: { [Op.lt]: new Date() } },
		}),
	]);
	res.render("administracion", {
		nombrePagina: "Panel de Administracion",
		grupos,
		meetis,
		anteriores
	});
};
