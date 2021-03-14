const Comentarios = require("../../models/Comentarios");
const Meeti = require("../../models/Meeti");

exports.agregarComentario = async (req, res) => {
	await Comentarios.create({
		mensaje: req.body.comentario,
		usuarioId: req.user.id,
		meetiId: req.params.id,
	});

	res.redirect("back");
};

exports.eliminarComentario = async (req, res, next) => {
	const { comentarioId } = req.body;

	const comentario = await Comentarios.findOne({ where: { id: comentarioId } });

	if (!comentario) {
		res
			.status(404)
			.json({ msg: "Accion no valida", tipo: "error", titulo: "Error" });
		return next();
	}

    // * consultar el meeti al que pertenece el comentario para eliminarlo el dueño del meeti
    const meeti = await Meeti.findOne({where:{id:comentario.meetiId}});

	if (comentario.usuarioId === req.user.id || meeti.usuarioId === req.user.id) {
		await Comentarios.destroy({
			where: {
				id: comentario.id,
			},
		});
		res
			.status(200)
			.json({
				msg: "Eliminado Correctamente",
				tipo: "success",
				titulo: "Eliminado",
			});
	} else {
		res
			.status(400)
			.json({ msg: "Accion no valida", tipo: "error", titulo: "Error" });
	}
};
