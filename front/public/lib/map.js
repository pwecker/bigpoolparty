export function extendmap(Creative, params) {
	return class extends Creative {
		constructor() {
			super();
			const map = window.document.getElementById('map');
			map.setAttribute('data-dynamic', '');
			this.staticMap();
			this.markers = [];
		}

		realMap() {
			this.map = L.map('map',{
				attributionControl: false,
				maxZoom: 18,
				zoomControl: false
			});

			// L.control.zoom({
			//   position: 'bottomright'
			// })
			// .addTo(this.map);

			L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {})
			.addTo(this.map);
			this.map.setView([40.776676, -73.971321], 13);
		}

		createMarker(param) {
			const starIcon = L.icon({
		    iconUrl: param.icon,
		    iconSize: [32, 32],
		    iconAnchor: [16, 16],
		    popupAnchor: [0, -20]      
			});

			const marker = L.marker(param.coords, { icon: starIcon }).addTo(this.map);

			const tooltip = L.tooltip({
	      permanent: false,
	      opacity: 0.9,
	      offset: [0, -20]
	    }).setContent(param.name);

	    marker.on('mouseover', function (e) {
        marker.bindTooltip(tooltip).openTooltip();
	    });

	    marker.on('mouseout', function (e) {
	      marker.closeTooltip();
	    });

	    marker.on('touchstart', function (e) {
        marker.bindTooltip(tooltip).openTooltip();
        setTimeout(() => marker.closeTooltip(), 3000);
	    });

	    return marker;
		}

		fitMap() {
			const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));
			this.map.fitBounds(bounds, {padding: [20, 20]})
		}

		debounce(fnc, delay) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fnc.apply(this, args), delay);
      };
    }

		staticMap() {
	    this.map = L.map('map', {
        attributionControl: false,
        maxZoom: 10,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        touchZoom: false,
        renderer: L.canvas()
	    });

	    const image = '/img/map.png';

	    const imageBounds = [
        [61.7731, -27.7734],
        [1.7575, -165.5859]
	    ];

	    L.imageOverlay(image, imageBounds, {
        opacity: 1,
        interactive: false
	    }).addTo(this.map);

	    this.markers = params.markers.map((marker) => {
	    	return this.createMarker(marker);
	    });

	    this.handleResize = this.debounce(this.fitMap.bind({markers: this.markers, map: this.map}), 100);
      window.addEventListener('resize', this.handleResize);

      this.fitMap();
    }
	}
}