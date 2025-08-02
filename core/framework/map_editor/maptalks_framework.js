//Initialise functions
{
	function initialiseMaptalks () {
		//Declare local instance variables
		global.maptiler_key = "xWbyIIrJg1lF1fmQFByp";
		
		global.map = new maptalks.Map("map", {
			center: [51.505, -0.09],
			zoom: 5,
			baseLayer: new maptalks.TileLayer('base', {
				spatialReference: {
					projection:'EPSG:3857'
				},
				urlTemplate: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png`,
					subdomains: ["a","b","c"],
				//urlTemplate: 'https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=xWbyIIrJg1lF1fmQFByp',
				attribution: `Generated with Constele Red`,
				repeatWorld: false
			})
		});
		map.setSpatialReference({
			projection: "EPSG:4326"
		});
	}
}