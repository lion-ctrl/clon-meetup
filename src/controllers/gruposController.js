const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const fs = require("fs");

const Categorias = require("../models/Categorias");
const Grupos = require("../models/Grupos");

const configuracionMulter = {
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, path.join(__dirname + "/../public/uploads/grupos"));
		},
		filename: (req, file, next) => {
			const extension = file.mimetype.split("/")[1];
			next(null, `${shortid.generate()}.${extension}`);
		},
	}),
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype === "image/jpeg" ||
			file.mimetype === "image/png" ||
			file.mimetype === "image/jpg"
		) {
			cb(null, true);
			// % el callback se ejecuta como true o false : true cuando la imagen se acepta
		} else {
			cb(new Error("Formato no Valido"));
		}
	},
	limits: { fileSize: 100000 },
};

const upload = multer(configuracionMulter).single("imagen");

exports.subirImagen = (req, res, next) => {
	upload(req, res, function (error) {
		if (error) {
			if (error instanceof multer.MulterError) {
				if (error.code === "LIMIT_FILE_SIZE") {
					req.flash("error", "Imagen muy pesada, maximo 100kb");
				} else {
					req.flash("error", error.message);
				}
			} else if (error.hasOwnProperty("message")) {
				req.flash("error", error.message);
			}
			return res.redirect("back");
		}
		next();
	});
};

exports.formNuevoGrupo = async (req, res) => {
	const categorias = await Categorias.findAll();
	res.render("grupos/nuevo-grupo", {
		nombrePagina: "Crea un nuevo Grupo",
		categorias,
	});
};

exports.crearGrupo = async (req, res) => {
	const grupo = req.body;
	grupo.usuarioId = req.user.id;

	// * leer la imagen
	if (req.file) {
		grupo.imagen = req.file.filename;
	}

	try {
		await Grupos.create(grupo);
		req.flash("exito", "Se ha creado el grupo correctamente");
		res.redirect("/administracion");
	} catch (error) {
		// console.log(error);
		let erroresSequelize = error.errors.map((err) => err.message);
		req.flash("error", erroresSequelize);
		res.redirect("/nuevo-grupo");
	}
};

exports.formEditarGrupo = async (req, res) => {
	try {
		const [grupo, categorias] = await Promise.all([
			Grupos.findOne({
				where: { id: req.params.id, usuarioId: req.user.id },
			}),
			Categorias.findAll(),
		]);
		res.render("grupos/editar-grupo", {
			nombrePagina: `Editar Grupo : ${grupo.nombre}`,
			grupo,
			categorias,
		});
	} catch (error) {
		req.flash("error", "Operacion no valida");
		res.redirect("/administracion");
		return;
	}
};

exports.editarGrupo = async (req, res) => {
	// * sino existe ese grupo o no es el dueño
	const grupo = await Grupos.findOne({
		where: { id: req.params.id, usuarioId: req.user.id },
	});

	if (!grupo) {
		req.flash("error", "Operacion no valida");
		res.redirect("/administracion");
		return;
	}

	// * asignar los valores
	grupo.nombre = req.body.nombre;
	grupo.descripcion = req.body.descripcion;
	grupo.categoriaId = req.body.categoriaId;
	grupo.url = req.body.url;

	await grupo.save();

	req.flash("exito", "Cambios Almacenados Correctamente");
	res.redirect("/administracion");
};

// * editar imagen del grupo
exports.formEditarImagen = async (req, res) => {
	const grupo = await Grupos.findOne({
		where: { id: req.params.id, usuarioId: req.user.id },
	});

	if (!grupo) {
		req.flash("error", "Operacion no valida");
		res.redirect("/administracion");
		return;
	}

	res.render("grupos/imagen-grupo", {
		nombrePagina: `Editar Imagen Grupo : ${grupo.nombre}`,
		grupo,
	});
};

exports.editarImagen = async (req, res) => {
	const grupo = await Grupos.findOne({
		where: { id: req.params.id, usuarioId: req.user.id },
	});

	if (!grupo) {
		req.flash("error", "Operacion no valida");
		res.redirect("/administracion");
		return;
	}

	// * verificar que el archivo sea nuevo
	if (req.file && grupo.imagen) {
		const imagenAnteriorPath = path.resolve(
			`./src/public/uploads/grupos/${grupo.imagen}`
		);
		// * eliminar archivo
		fs.unlink(imagenAnteriorPath, (error) => {
			if (error) {
				console.log(error);
			}
			return;
		});
	}

	// * si la imagen es nueva
	if (req.file) {
		grupo.imagen = req.file.filename;
	}

	// * guardar
	await grupo.save();
	req.flash("exito", "Cambios almacenados Correctamente");
	res.redirect("/administracion");
};

// * eliminar grupo
exports.FormEliminarGrupo = async (req, res) => {
	const grupo = await Grupos.findOne({
		where: { id: req.params.id, usuarioId: req.user.id },
	});

	if (!grupo) {
		req.flash("error", "Operacion no valida");
		res.redirect("/administracion");
		return;
	}

	res.render("grupos/eliminar-grupo", {
		nombrePagina: `Eliminar Grupo : ${grupo.nombre}`,
	});
};

exports.eliminarGrupo = async (req, res) => {
	const grupo = await Grupos.findOne({
		where: { id: req.params.id, usuarioId: req.user.id },
	});

	if (!grupo) {
		req.flash("error", "Operacion no valida");
		res.redirect("/administracion");
		return;
	}

	if (grupo.imagen) {
		const imagenAnteriorPath = path.resolve(
			`./src/public/uploads/grupos/${grupo.imagen}`
		);
		// * eliminar archivo
		fs.unlink(imagenAnteriorPath, (error) => {
			if (error) {
				console.log(error);
			}
			return;
		});
	}

	await Grupos.destroy({ where: { id: req.params.id } });

	req.flash("exito", "Grupo Eliminado");
	res.redirect("/administracion");
};
