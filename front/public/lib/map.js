export function extendmap(Creative) {
	return class extends Creative {
		constructor() {
			super();

			this.map = L.map('map',{
				attributionControl: false,
				maxZoom: 18,
				zoomControl: false
			});

			L.control.zoom({
			  position: 'bottomright'
			})
			.addTo(this.map);

			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {})
			.addTo(this.map);

			this.map.setView([40.776676, -73.971321], 13);
		}
	}
}