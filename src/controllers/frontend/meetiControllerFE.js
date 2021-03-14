const Sequelize = require("sequelize");

const Meeti = require("../../models/Meeti");
const Grupos = require("../../models/Grupos");
const Usuarios = require("../../models/Usuarios");
const Categorias = require("../../models/Categorias");
const Comentarios = require("../../models/Comentarios");

exports.mostrarMeeti = async (req, res, next) => {
	const meeti = await Meeti.findOne({
		where: {
			slug: req.params.slug,
		},
		include: [
			{ model: Grupos },
			{ model: Usuarios, attributes: ["id", "nombre", "imagen"] },
		],
	});

	if (!meeti) {
		res.redirect("/");
	} else {
		// * consultar meetis cercanos
		// % no se pudo ya que las funciones mostradas en el video estan obsoletas

		const comentarios = await Comentarios.findAll({
			where: { meetiId: meeti.id },
			include: [
				{
					model: Usuarios,
					attributes: ["id", "nombre", "imagen"],
				},
			],
		});

		res.render("meetis/mostrar-meeti", {
			nombrePagina: meeti.titulo,
			meeti,
			comentarios,
		});
	}
};

// * confirma o cancela si el usuario asistira al meeti
exports.confirmarAsistencia = async (req, res) => {
	const { accion } = req.body;

	if (accion == "confirmar") {
		Meeti.update(
			{
				interesados: Sequelize.fn(
					"array_append",
					Sequelize.col("interesados"),
					req.user.id
				),
			},
			{ where: { slug: req.params.slug } }
		);
		// % fn: funcion que utiliza la siguiente funcion de postgres para agregar contenido al array de la columna preestablecida
		res.status(200).send("Has confirmado tu asistencia");
	} else {
		Meeti.update(
			{
				interesados: Sequelize.fn(
					"array_remove",
					Sequelize.col("interesados"),
					req.user.id
				),
			},
			{ where: { slug: req.params.slug } }
		);
		res.status(200).send("Has cancelado tu asistencia");
	}
};

exports.muestraAsistentes = async (req, res) => {
	const meeti = await Meeti.findOne({
		where: { slug: req.params.slug },
		attributes: ["interesados"],
	});
	// * extraer interesados
	const { interesados } = meeti;
	const asistentes = await Usuarios.findAll({
		attributes: ["nombre", "imagen"],
		where: { id: interesados },
	});

	res.render("meetis/asistentes-meetis", {
		nombrePagina: "Listado Asistentes Meeti",
		asistentes,
	});
};

// * mostrar categoria
exports.mostrarCategoria = async (req, res) => {
	const categoria = await Categorias.findOne({
		where: { slug: req.params.categoria },
		attributes: ["id", "nombre"],
	});

	const meetis = await Meeti.findAll({
		include: [
			{
				model: Grupos,
				where: { categoriaId: categoria.id },
			},
			{
				model: Usuarios,
			},
		],
		order: [["fecha", "DESC"]],
	});

	res.render("categorias/categoria", {
		nombrePagina: `Categoria: ${categoria.nombre}`,
		meetis,
	});
};
