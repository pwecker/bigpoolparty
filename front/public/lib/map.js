export function extendmap(Creative, params) {
	return class extends Creative {
		constructor() {
			super();
			this.map = window.document.getElementById('map');
			this.map.setAttribute('data-dynamic', '');
			this.markers = [];
			this.waitForElementDimensions().then(() => this.staticMap());
		}

		async waitForElementDimensions() {
	    return new Promise((resolve) => {
	      const checkDimensions = () => {
	        if (this.map.offsetWidth > 0 && this.map.offsetHeight > 0) {
	          resolve();
	        } else {
	          window.requestAnimationFrame(checkDimensions);
	        }
	      };
	      checkDimensions();
	    });
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
			this.map.setView(params.center, 13);
		}

		createMarker(param) {
			const starIcon = L.icon({
		    iconUrl: param.icon,
		    iconSize: [32, 32],
		    iconAnchor: [16, 18],    
			});

			let latLng;

			if (param.coords) {
				latLng = param.coords
			} else if (param.pos) {
				const {lat, lng} = this.map.containerPointToLatLng([param.pos.x, param.pos.y]);
				latLng = [lat, lng];
			}

			const marker = L.marker(latLng, { icon: starIcon }).addTo(this.map);

			const tooltip = L.tooltip({
	      permanent: false,
	      opacity: 0.9,
	      offset: [16, -1]
	    }).setContent(param.name);

	    marker._icon.style.filter = 'drop-shadow(0 0 0.75rem rgb(58,58,58))'

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
			this.map.fitBounds(bounds, {padding: [5, 1]})
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

	    this.map.setView(params.center, 10);

	    const image = params.map_img;
	    const imageBounds = params.bounds;
	    L.imageOverlay(image, imageBounds, {
        opacity: 1,
        interactive: false
	    }).addTo(this.map);

	    this.markers = params.markers.map((marker) => {
	    	return this.createMarker(marker);
	    });

	    this.handleResize = this.debounce(this.fitMap.bind({markers: this.markers, map: this.map}), 100);
      window.addEventListener('resize', this.handleResize);

      this.handleResize();
    }
	}
}