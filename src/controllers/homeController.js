const Sequelize = require("sequelize");
const Op = require("sequelize").Op;

const Categorias = require("../models/Categorias");
const Meeti = require("../models/Meeti");
const Grupos = require("../models/Grupos");
const Usuarios = require("../models/Usuarios");

exports.home = async (req, res) => {
	const [categorias, meetis] = await Promise.all([
		Categorias.findAll(),
		Meeti.findAll({
			where: { fecha: { [Op.gte]: new Date() } },
			limit: 3,
			attributes: ["slug", "titulo", "fecha", "hora"],
			order: [["fecha", "ASC"]],
			include: [
				{ model: Grupos, attributes: ["imagen"] },
				{ model: Usuarios, attributes: ["nombre", "imagen"] },
			],
		}),
	]);
	// % attributes: propiedad para solo traerte los campos requiridos como un select
	// % include: join pasandole los atributos que se quieren traer de la otra tabla

	res.render("home", { nombrePagina: "Inicio", categorias, meetis });
};

exports.buscador = async (req, res) => {
	// console.log(req.query);
	// % cuando se usa un formulario con el metodo GET se usa req.query

	const { categoria, titulo, ciudad, pais } = req.query;

	let query = "";
	if (categoria !== "") {
		query = `where: { categoriaId: categoria }`;
	}

	const meetis = await Meeti.findAll({
		where: {
			titulo: { [Op.iLike]: `%${titulo}%` },
			ciudad: { [Op.iLike]: `%${ciudad}%` },
			pais: { [Op.iLike]: `%${pais}%` },
			// % iLike: para que no sea case sensitive solo valido es postgres
		},
		include: [
			{ model: Grupos, query },
			{ model: Usuarios, attributes: ["id", "nombre", "imagen"] },
		],
	});

	res.render("buscador", { nombrePagina: "Resultados Busqueda", meetis });
};
