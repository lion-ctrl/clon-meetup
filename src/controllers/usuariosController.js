const { check, validationResult } = require("express-validator");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const fs = require("fs");

const enviarEmail = require("../handlers/email");

const Usuarios = require("../models/Usuarios");

const configuracionMulter = {
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, path.join(__dirname + "/../public/uploads/perfiles"));
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

exports.formCrearCuenta = (req, res) => {
	res.render("crear-cuenta", { nombrePagina: "Crea tu Cuenta" });
};

exports.validarUsuario = [
	check("repetir_password", "Confirmar contraseña no puede estar vacia")
		.escape()
		.not()
		.isEmpty(),
	check("repetir_password").custom((value, { req }) => {
		if (value !== req.body.password) {
			// console.log(req.body.password, req.body.c_password);
			throw new Error("Las Contraseñas no son iguales");
		}
		return true;
	}),
	function (req, res, next) {
		const errores = validationResult(req);
		if (!errores.isEmpty()) {
			req.flash(
				"error",
				errores.array().map((error) => error.msg)
			);
			res.redirect("/crear-cuenta");
			return;
		}

		next();
	},
];

exports.crearNuevaCuenta = async (req, res) => {
	const usuario = req.body;
	try {
		await Usuarios.create(usuario);

		// * crear url
		const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

		// * enviar email de confirmacion
		await enviarEmail.enviarEmail({
			usuario,
			url,
			subject: "Confirma tu cuenta de Meeti",
			archivo: "confirmar-cuenta",
		});

		req.flash("exito", "Hemos enviado un correo, Confirma tu cuenta");
		res.redirect("/iniciar-sesion");
	} catch (error) {
		let erroresSequelize = [];
		if (error.hasOwnProperty("parent")) {
			if (error.parent.code === "23505") {
				erroresSequelize.push("Usuario ya Registrado");
			}
		} else {
			erroresSequelize = error.errors.map((err) => err.message);
		}
		req.flash("error", erroresSequelize);
		res.redirect("/crear-cuenta");
	}
};

exports.confirmarCuenta = async (req, res, next) => {
	// * Verificar que el usuario existe
	const usuario = await Usuarios.findOne({
		where: { email: req.params.correo },
	});

	// * sino existe, redireccionar
	if (!usuario) {
		req.flash("error", "No existe esa cuenta");
		res.redirect("/crear-cuenta");
		return next();
	}
	// * si existe, confirmar suscripcion y redireccionar
	usuario.activo = 1;
	await usuario.save();
	req.flash("exito", "La cuenta se ha confirmado, ya puedes iniciar sesion");
	res.redirect("/iniciar-sesion");
};

exports.formIniciarSesion = (req, res) => {
	res.render("iniciar-sesion", { nombrePagina: "Iniciar Sesion" });
};

// * editar Perfil
exports.formEditarPerfil = async (req, res) => {
	const usuario = await Usuarios.findByPk(req.user.id);

	res.render("editar-perfil", {
		nombrePagina: "Editar Perfil",
		usuario,
	});
};

exports.validarEditarPerfil = [
	check("nombre").escape(),
	check("email").escape(),
];

exports.editarPerfil = async (req, res) => {
	const usuario = await Usuarios.findByPk(req.user.id);

	const { nombre, descripcion, email } = req.body;

	usuario.nombre = nombre;
	usuario.descripcion = descripcion;
	usuario.email = email;

	await usuario.save();

	req.flash("exito", "Cambios Guardados Correctamente");
	res.redirect("/administracion");
};

// * cambiar password
exports.formCambiarPassword = (req, res) => {
	res.render("cambiar-password", {
		nombrePagina: "Cambiar Contraseña",
	});
};

exports.cambiarPassword = async (req,res,next) => {
	const usuario = await Usuarios.findByPk(req.user.id);

	if(!usuario.validarPassword(req.body.anterior)) {
		req.flash("error","La contraseña actual es incorrecta");
		res.redirect("/administracion");
		return next();
	}

	const hash = usuario.hashPassword(req.body.nueva);
	usuario.password = hash;

	await usuario.save();
	req.logout();
	req.flash("exito","Contraseña Modificada Correctamente, vuelve a iniciar Sesion");
	res.redirect("/iniciar-sesion");
}

// * subir imagen
exports.formSubirImagen = async (req,res) => {
	const usuario = await Usuarios.findByPk(req.user.id);

	res.render("imagen-perfil",{
		nombrePagina:"Subir Imagen de Perfil",
		usuario
	})
}

exports.guardarImagen = async (req,res) => {
	const usuario = await Usuarios.findByPk(req.user.id);

	// * verificar que el archivo sea nuevo
	if (req.file && usuario.imagen) {
		const imagenAnteriorPath = path.resolve(
			`./src/public/uploads/perfiles/${usuario.imagen}`
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
		usuario.imagen = req.file.filename;
	}

	// * guardar
	await usuario.save();
	req.flash("exito", "Cambios almacenados Correctamente");
	res.redirect("/administracion");
}