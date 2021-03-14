const router = require("express").Router();

// ? controllers
const homeController = require("../controllers/homeController");
const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const gruposController = require("../controllers/gruposController");
const meetiController = require("../controllers/meetiController");

const meetiControllerFE = require("../controllers/frontend/meetiControllerFE");
const usuariosControllerFE = require("../controllers/frontend/usuariosControllerFE");
const gruposControllerFE = require("../controllers/frontend/gruposControllerFE");
const comentariosControllerFE = require("../controllers/frontend/comentariosControllerFE");

router
	// ! area publica
	.get("/", homeController.home)
	.get("/busqueda",homeController.buscador)
	// * muestra cada meeti
	.get("/meeti/:slug", meetiControllerFE.mostrarMeeti)
	// * agregar un comentario al meeti
	.post("/meeti/:id", comentariosControllerFE.agregarComentario)
	.post("/eliminar-comentario",comentariosControllerFE.eliminarComentario)
	// * confirma asistencia a meeti
	.post("/confirma-asistencia/:slug", meetiControllerFE.confirmarAsistencia)
	.get("/asistentes/:slug",meetiControllerFE.muestraAsistentes)
	// * mostrar info usuario
	.get("/usuarios/:id",usuariosControllerFE.muestraPerfil)
	// * mostrar grupos
	.get("/grupos/:id",gruposControllerFE.mostrarGrupo)
	// * mostrar grupos por categorias
	.get("/categoria/:categoria",meetiControllerFE.mostrarCategoria)
	// * crear cuenta
	.get("/crear-cuenta", usuariosController.formCrearCuenta)
	.post(
		"/crear-cuenta",
		usuariosController.validarUsuario,
		usuariosController.crearNuevaCuenta
	)
	// * confirmar cuenta
	.get("/confirmar-cuenta/:correo", usuariosController.confirmarCuenta)
	// * iniciar sesion
	.get("/iniciar-sesion", usuariosController.formIniciarSesion)
	.post("/iniciar-sesion", authController.autenticarUsuario)
	// * cerrar sesion
	.get(
		"/cerrar-sesion",
		authController.usuarioAutenticado,
		authController.cerrarSesion
	)
	// ! area privada
	// ? panel de administracion
	.get(
		"/administracion",
		authController.usuarioAutenticado,
		adminController.panelAdministracion
	)

	// * nuevos grupos
	.get(
		"/nuevo-grupo",
		authController.usuarioAutenticado,
		gruposController.formNuevoGrupo
	)
	.post(
		"/nuevo-grupo",
		authController.usuarioAutenticado,
		gruposController.subirImagen,
		gruposController.crearGrupo
	)
	// * editar grupo
	.get(
		"/editar-grupo/:id",
		authController.usuarioAutenticado,
		gruposController.formEditarGrupo
	)
	.post(
		"/editar-grupo/:id",
		authController.usuarioAutenticado,
		gruposController.editarGrupo
	)
	// * editar a imagen del grupo
	.get(
		"/imagen-grupo/:id",
		authController.usuarioAutenticado,
		gruposController.formEditarImagen
	)
	.post(
		"/imagen-grupo/:id",
		authController.usuarioAutenticado,
		gruposController.subirImagen,
		gruposController.editarImagen
	)
	// * eliminar grupo
	.get(
		"/eliminar-grupo/:id",
		authController.usuarioAutenticado,
		gruposController.FormEliminarGrupo
	)
	.post(
		"/eliminar-grupo/:id",
		authController.usuarioAutenticado,
		gruposController.eliminarGrupo
	)

	// ? meetis
	.get(
		"/nuevo-meeti",
		authController.usuarioAutenticado,
		meetiController.formNuevoMeeti
	)
	.post(
		"/nuevo-meeti",
		authController.usuarioAutenticado,
		meetiController.validarMeeti,
		meetiController.nuevoMeeti
	)
	// * editar Meeti
	.get(
		"/editar-meeti/:slug",
		authController.usuarioAutenticado,
		meetiController.formEditarMeeti
	)
	.post(
		"/editar-meeti/:slug",
		authController.usuarioAutenticado,
		meetiController.validarMeeti,
		meetiController.editarMeeti
	)
	.get(
		"/eliminar-meeti/:slug",
		authController.usuarioAutenticado,
		meetiController.formEliminarMeeti
	)
	.post(
		"/eliminar-meeti/:slug",
		authController.usuarioAutenticado,
		meetiController.eliminarMeeti
	)

	// ? perfil
	// * editar
	.get(
		"/editar-perfil/",
		authController.usuarioAutenticado,
		usuariosController.formEditarPerfil
	)
	.post(
		"/editar-perfil/",
		authController.usuarioAutenticado,
		usuariosController.editarPerfil
	)
	// * modifica el password
	.get(
		"/editar-password",
		authController.usuarioAutenticado,
		usuariosController.formCambiarPassword
	)
	.post(
		"/editar-password",
		authController.usuarioAutenticado,
		usuariosController.cambiarPassword
	)
	// * imagen de perfil
	.get(
		"/imagen-perfil",
		authController.usuarioAutenticado,
		usuariosController.formSubirImagen
	)
	.post(
		"/imagen-perfil",
		authController.usuarioAutenticado,
		usuariosController.subirImagen,
		usuariosController.guardarImagen
	);

module.exports = router;
