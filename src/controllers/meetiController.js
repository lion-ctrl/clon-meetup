const { check, validationResult } = require("express-validator");

const Grupos = require("../models/Grupos");
const Meeti = require("../models/Meeti");

exports.formNuevoMeeti = async (req, res) => {
	const grupos = await Grupos.findAll({ where: { usuarioId: req.user.id } });
	res.render("meetis/nuevo-meeti", {
		nombrePagina: "Crear nuevo Meeti",
		grupos,
	});
};

exports.validarMeeti = [
	check("titulo").escape(),
	check("invitado").escape(),
	check("cupo").escape(),
	check("fecha").escape(),
	check("hora").escape(),
	check("direccion").escape(),
	check("ciudad").escape(),
	check("estado").escape(),
	check("pais").escape(),
	check("lat").escape(),
	check("lng").escape(),
	check("grupoId").escape(),
];

exports.nuevoMeeti = async (req, res) => {
	const meeti = req.body;
	meeti.usuarioId = req.user.id;

	if (meeti.cupo === "") {
		meeti.cupo = 0;
	}

	try {
		await Meeti.create(meeti);
		req.flash("exito", "Se ha creado el Meeti correctamente");
		res.redirect("/administracion");
	} catch (error) {
		console.log(error);
		let erroresSequelize = error.errors.map((err) => err.message);
		req.flash("error", erroresSequelize);
		res.redirect("/nuevo-meeti");
	}
};

exports.formEditarMeeti = async (req, res, next) => {
	const [grupos, meeti] = await Promise.all([
		Grupos.findAll({ where: { usuarioId: req.user.id } }),
		Meeti.findOne({ where: { slug: req.params.slug } }),
	]);

	if (!grupos || !meeti) {
		req.flash("error", "Operacion No valida");
		res.redirect("/administracion");
		return next();
	}
	res.render("meetis/editar-meeti", {
		nombrePagina: `Editar Meeti: ${meeti.titulo}`,
		grupos,
		meeti,
	});
};

exports.editarMeeti = async (req, res, next) => {
	const meeti = await Meeti.findOne({
		where: { slug: req.params.slug, usuarioId: req.user.id },
	});

	if (!meeti) {
		req.flash("error", "Operacion no valida");
		res.redirect("/administracion");
		return next();
	}

	// * asignar los valores
	const {
		grupoId,
		titulo,
		invitado,
		fecha,
		hora,
		cupo,
		descripcion,
		direccion,
		ciudad,
		estado,
		pais,
		lat,
		lng,
	} = req.body;

	meeti.grupoId = grupoId;
	meeti.titulo = titulo;
	meeti.invitado = invitado;
	meeti.fecha = fecha;
	meeti.hora = hora;
	meeti.cupo = cupo;
	meeti.descripcion = descripcion;
	meeti.direccion = direccion;
	meeti.ciudad = ciudad;
	meeti.estado = estado;
	meeti.pais = pais;
	meeti.lat = lat;
	meeti.lng = lng;

	await meeti.save();
	req.flash("exito", "Cambios Guardados Correctamente");
	res.redirect("/administracion");
};

exports.formEliminarMeeti = async (req, res, next) => {
	const meeti = await Meeti.findOne({
		where: { slug: req.params.slug, usuarioId: req.user.id },
	});

	if (!meeti) {
		req.flash("error", "Operacion no valida");
		res.redirect("/administracion");
		return next();
	}

	res.render("meetis/eliminar-meeti", {
		nombrePagina: `Eliminar Meeti: ${meeti.titulo}`,
	});
};

exports.eliminarMeeti = async (req, res, next) => {
	await Meeti.destroy({ where: { slug: req.params.slug } });
    req.flash("exito", "Meeti Eliminado");
	res.redirect("/administracion");
};
