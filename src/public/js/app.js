import { OpenStreetMapProvider } from "leaflet-geosearch";
import asistencia from "./asistencia"
import eliminarComentario from "./eliminarComentario"

let marker;
let map;
let markers;

let lat;
let lng;
document.addEventListener("DOMContentLoaded", () => {
	// Inicializar y obtener la propiedad del mapa
	const mapa = document.getElementById("mapa");
	if (mapa) {
		lat = document.querySelector("#lat").value || "10.6417";
		lng = document.querySelector("#lng").value || "-71.6295";
		const direccion = document.querySelector("#direccion").value || "";

		map = L.map("mapa").setView([lat, lng], 15);
		markers = new L.featureGroup().addTo(map);

		// * colocar el pin en edicion de meeti
		if (lat && lng) {
			markers.clearLayers();
			// * agregar el pin
			marker = new L.marker([lat,lng], {
				draggable: true,
				autoPan: true,
			})
				.addTo(map)
				.bindPopup(direccion)
				.openPopup();

				marker.on("moveend", function (e) {
					marker = e.target;
					const posicion = marker.getLatLng();
					map.panTo(new L.LatLng(posicion.lat, posicion.lng));
	
					// * reverse cuando el usuario mueve el pin
					// geocodeService
					// 	.reverse()
					// 	.latlng(posicion, 15)
					// 	.run(function (err, result) {
					// 		console.log(result);
					// 	});
				});
			markers.addLayer(marker);
		}

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(map);
	}

	const buscador = document.querySelector("#formbuscador");
	buscador && buscador.addEventListener("input", buscarDireccion);
});

// ? funciones
function buscarDireccion(e) {
	if (e.target.value.length > 8) {
		// * limpiar pin anterior
		markers.clearLayers();

		// * Utiliza el provider y el revere geocode
		// console.log(L.esri);
		// const geocodeService = L.esri.Geocoding.geocodeService();
		const provider = new OpenStreetMapProvider();
		provider.search({ query: e.target.value }).then((res) => {
			// geocodeService
			// 	.reverse()
			// 	.latlng(res[0].bounds[0], 15)
			// 	.run(function (err, result) {
			// 		// console.log(result);
			// 	});
			// * mostrar el mapa
			map.setView(res[0].bounds[0], 15);
			// * agregar el pin
			marker = new L.marker(res[0].bounds[0], {
				draggable: true,
				autoPan: true,
			})
				.addTo(map)
				.bindPopup(res[0].label)
				.openPopup();

			llenarInputs(res[0]);

			// * detetar movimiento del marker
			marker.on("moveend", function (e) {
				marker = e.target;
				const posicion = marker.getLatLng();
				map.panTo(new L.LatLng(posicion.lat, posicion.lng));

				// * reverse cuando el usuario mueve el pin
				// geocodeService
				// 	.reverse()
				// 	.latlng(posicion, 15)
				// 	.run(function (err, result) {
				// 		console.log(result);
				// 	});
			});

			// * asignar al contenedor markers
			markers.addLayer(marker);
		});
	}
}

function llenarInputs(res) {
	document.querySelector("#direccion").value = res.label || "";
	document.querySelector("#lat").value = res.bounds[0][0] || "";
	document.querySelector("#lng").value = res.bounds[0][1] || "";
}
