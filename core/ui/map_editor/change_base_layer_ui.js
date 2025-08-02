//Initialise functions
{
	function printChangeBaseLayer () {
		//Declare local instance variables
		var margin_px = 4;
		
		//Declare windows
		if (window.change_base_layer_window)
			if (!window.change_base_layer_window.element.isConnected)
				delete window.change_base_layer_window;
		if (!window.change_base_layer_window_state)
			window.change_base_layer_window_state = {
				change_theme: "carto_dark"
			};
		if (!window.change_base_layer_window)
			window.change_base_layer_window = new ve.Window({
				id: "change-base-layer-window",
				name: "Change Base Layer",
				x: 200,
				y: 200,
				
				can_rename: false,
				
				interface: {
					change_projection: {
						name: "Change Projection:",
						type: "select",
						
						options: {
							"EPSG:4326": "Equirectangular",
							"EPSG:3857": "Mercator",
						},
						onclick: (e) => {
							map.setSpatialReference({
								projection: e.target.value
							});
						},
						onload: (e) => {
							var spatial_reference_obj = map.getSpatialReference();
							
							var select_el = e.querySelector("select");
							select_el.value = spatial_reference_obj.options.projection;
						}
					},
					change_theme: {
						name: "Change Theme",
						type: "select",
						
						options: {
							//MapTiler
							"aquarelle": "Aquarelle",
							"backdrop": "Backdrop",
							"basic": "Basic",
							"bright": "Bright",
							"dataviz": "Dataviz",
							"landscape": "Landscape",
							"openstreetmap": "Maptiler OSM",
							"ocean": "Ocean",
							"outdoor": "Outdoor",
							"satellite": "Satellite",
							"streets": "Streets",
							"toner": "Toner",
							"topo": "Topo",
							"winter": "Winter",
							
							//Carto
							"carto_dark": "Carto Dark",
							"carto_light": "Carto Light",
							
							//ESRI
							"esri_satellite": "Esri (Satellite)",
							
							//OSM
							"osm": "OpenStreetMap",
						},
						onload: (e) => {
							var state_obj = window.change_base_layer_window_state;
							
							if (state_obj && state_obj.change_theme != undefined)
								e.querySelector(`select`).value = state_obj.change_theme;
						}
					},
					opacity: {
						name: "Opacity",
						type: "range",
						
						attributes: {
							min: "0",
							max: "1",
							step: "0.01",
							value: "1"
						},
						onload: (e) => {
							var state_obj = window.change_base_layer_window_state;
							
							if (state_obj && state_obj.opacity != undefined)
								e.querySelector("input[type='range']").value = state_obj.opacity;
						}
					},
					projection_resolution: {
						name: "Projection Resolution:",
						type: "select",
						
						options: {
							"256/": "256",
							"": "512"
						},
						onload: (e) => {
							var select_el = e.querySelector("select");
							var state_obj = window.change_base_layer_window_state;
							
							if (state_obj && state_obj.projection_resolution != undefined) {
								select_el.value = state_obj.projection_resolution;
							} else {
								select_el.value = "";
							}
						}
					},
					confirm: {
						name: "Confirm",
						type: "button",
						
						onclick: (e) => {
							var state_obj = window.change_base_layer_window.getState();
								window.change_base_layer_window_state = state_obj;
							console.log(state_obj);
							
							//Declare local instance variables
							var url_string;
							
							//Carto/ESRI/OSM processing
							if (state_obj.change_theme == "carto_dark") {
								url_string = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png";
							} else if (state_obj.change_theme == "carto_light") {
								url_string = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
							} else if (state_obj.change_theme == "esri_satellite") {
								url_string = "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg";
							} else if (state_obj.change_theme == "osm") {
								url_string = `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`;
							} else {
								url_string = `https://api.maptiler.com/maps/${state_obj.change_theme}/${state_obj.projection_resolution}{z}/{x}/{y}.png?key=${global.maptiler_key}`;
							}
							
							console.log(url_string);
							
							var new_base_layer = new maptalks.TileLayer("base", {
								opacity: parseFloat(state_obj.opacity),
								urlTemplate: url_string,
								spatialReference: {
									projection: "EPSG:3857"
								},
								subdomains: ["a", "b", "c"],
								repeatWorld: false
							});
							
							map.setBaseLayer(new_base_layer);
						}
					}
				}
			});
	}
}