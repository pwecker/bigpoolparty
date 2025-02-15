export function extendmap(Creative) {
	return class extends Creative {
		constructor() {
			super();

			window.document.getElementById('map').setAttribute('data-dynamic', '');

			this.map = L.map('map',{
				attributionControl: false,
				maxZoom: 18,
				zoomControl: false
			});

			// L.control.zoom({
			// 	hide: true,
			//   position: 'bottomright'
			// })
			// .addTo(this.map);

			L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {})
			.addTo(this.map);
			this.map.setView([40.776676, -73.971321], 13);
		}
	}
}