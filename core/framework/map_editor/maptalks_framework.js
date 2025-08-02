//Initialise functions
{
	function initialiseMaptalks () {
		//Declare local instance variables
		global.map = new maptalks.Map("map", {
			center: [-0.113049,51.498568],
			zoom: 14,
			baseLayer: new maptalks.TileLayer('base', {
				urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
				subdomains: ["a","b","c","d"],
				attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
			})
		});
	}
}