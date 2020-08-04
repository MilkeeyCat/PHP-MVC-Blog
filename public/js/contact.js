const coords = [48.164322, 30.593872];

let map = L.map('map').setView(coords, 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker(coords).addTo(map)
    .bindPopup("Это нашая ШКОЛА!!!")
    .openPopup();