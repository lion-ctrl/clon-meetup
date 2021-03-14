import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
	const formsEliminar = document.querySelectorAll(".eliminar-comentario");

	if (formsEliminar.length) {
		formsEliminar.forEach((form) => {
			form.addEventListener("submit", eliminarComentario);
		});
	}
});

function eliminarComentario(e) {
	e.preventDefault();

	Swal.fire({
		title: "¿Eliminar Comentario?",
		text: "Un comentario Eliminado no se puede recuperar",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Si, Borrar",
		cancelButtonText: "No, Cancelar",
	}).then((result) => {
		if (result.isConfirmed) {
			const datos = {
				comentarioId: e.target.dataset.comentarioid,
			};

			fetch(e.target.action, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(datos),
			})
				.then((res) => res.json())
				.then((data) => {
                    Swal.fire(data.titulo, data.msg, data.tipo);
                    if (data.tipo === "success") {
                        e.target.parentElement.parentElement.remove();
                    }
				})
				.catch((data) => {
                    console.log(data);
                });
		}
	});
}
