document.addEventListener("DOMContentLoaded", () => {
	const asistencia = document.querySelector("#confirmar-asistencia");
	asistencia && asistencia.addEventListener("submit", confirmarAsistencia);
});

function confirmarAsistencia(e) {
	e.preventDefault();

	const btn = document.querySelector(
		"#confirmar-asistencia input[type='submit']"
	);
	let accion = btn.dataset.accion;
	const mensaje = document.querySelector("#mensaje");
	while (mensaje.firstChild) {
		mensaje.removeChild(mensaje.firstChild);
	}


	let datos = {
		accion,
	};

	fetch(this.action, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(datos),
	})
		.then((res) => res.text())
		.then((data) => {
			if (accion === "confirmar") {
				// modifica los elementos del boton
				btn.dataset.accion = "cancelar";
				btn.value = "Cancelar";
				btn.classList.replace("btn-azul", "btn-rojo");
			} else {
				btn.dataset.accion = "confirmar";
				btn.value = "Si";
				btn.classList.replace("btn-rojo", "btn-azul");
			}
			mensaje.append(document.createTextNode(data));
		});
}
