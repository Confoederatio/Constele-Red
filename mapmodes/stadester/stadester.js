function calculateRadius(area) {
	const radius = Math.sqrt(Math.abs(area) / Math.PI);
	return radius;
}

global.loadStadester = function () {
	try {
		var fs = global.fs;
		var path = global.path;
		
		var stadester_geometries = [];
		var label_geometries = [];
		global.uud_file_path = `./mapmodes/stadester/flattened_stadester_cities.json`;
		global.uud_obj = JSON.parse(fs.readFileSync(uud_file_path, "utf8"));
		
		//Iterate over all_countries
		var all_countries = Object.keys(uud_obj);
		var center = new maptalks.Coordinate(0, 0);
		
		if (global.year == undefined) global.year = 1975;
		
		for (let i = 0; i < all_countries.length; i++) {
			var local_city = uud_obj[all_countries[i]];
			
			//Check if year is in domain
			if (local_city.population) {
				var all_population_keys = Object.keys(local_city.population).map(Number) // Convert keys to numbers
				.sort((a, b) => a - b); // Sort numbers in ascending order;
				var end_year = all_population_keys[all_population_keys.length - 1];
				var start_year = all_population_keys[0];
				
				if ((global.year >= start_year && global.year <= end_year) || (end_year >= 1975 && global.year >= 1975))
					if (local_city.coords) {
						var local_population = 0;
						
						//Iterate over all_population_keys
						for (let y = 0; y < all_population_keys.length; y++)
							if (all_population_keys[y] <= global.year)
								local_population = local_city.population[all_population_keys[y]];
						
						if (local_population) {
							//console.log(local_city.coords);
							stadester_geometries.push(new maptalks.Circle(center.add([
								returnSafeNumber(local_city.coords[1]),
								returnSafeNumber(local_city.coords[0])
							]), calculateRadius(local_population*10000), {
								symbol: {
									lineColor: '#34495e',
									lineWidth: 2,
									polygonFill: (local_population > 0) ? '#34cc48' :`rgb(240, 60, 60)` ,
									polygonOpacity: 0.2
								},
							}));
							label_geometries.push(new maptalks.Label((local_city.name) ? `${local_city.name} (${parseNumber(local_population)})` : "Unknown City", [
								returnSafeNumber(local_city.coords[1]),
								returnSafeNumber(local_city.coords[0]),
								0
							], {
								'boxStyle' : {
									'padding' : [2, 2],
									'verticalAlignment' : 'top',
									'horizontalAlignment' : 'center',
									'symbol' : {
										'markerType' : 'square',
										'markerFill' : 'rgb(0, 0, 0)',
										'markerFillOpacity' : 0.3
									}
								},
								'textSymbol': {
									'textFaceName' : 'Karla',
									'textFill' : 'rgba(255, 255, 255, 0.85)',
									'textSize' : 12,
									'textWeight' : 300,
									'textHorizontalAlignment': 'center',
									'textVerticalAlignment' : 'top'
								}
							}))
						}
					}
			}
		}
		
		console.log(stadester_geometries);
		var stadester_cities_layer = new maptalks.VectorLayer("stadester_cities")
		.addGeometry(stadester_geometries.concat(label_geometries))
		.addTo(map);
	} catch (e) {
		console.error(e);
	}
	
}
loadStadester();
document.getElementById("mapmode-preview-name-input").innerHTML = `
	Stadestér<br><span style = "font-size: 0.85rem;">(Estimated urban populations, 1 hectare = 1 inhabitant, metro-adjusted)</span>
`;