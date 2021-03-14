document.addEventListener("DOMContentLoaded",() => {
    const ubicacionMeeti = document.getElementById("ubicacion-meeti");
    if (ubicacionMeeti) {
        const lat = document.querySelector("#lat").value || "10.6417";
        const lng = document.querySelector("#lng").value || "-71.629";
        const direccion = document.querySelector("#direccion").value || "Maracaibo";
        mostrarMapa(lat,lng,direccion);
    }
})

function mostrarMapa(lat,lng,direccion) {
    map = L.map("ubicacion-meeti").setView([lat,lng], 15);
    markers = new L.featureGroup().addTo(map);
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([lat,lng])
        .addTo(map)
        .bindPopup(direccion)
        .openPopup()
}

