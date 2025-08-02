//Initialise functions
{
	function printMapmodeCodeEditor () {
		//Declare local instance variables
		var codemirror_el = document.getElementById("codemirror-editor");
		
		//Initialise CodeMirror Editor
		main.map_codemirror_obj = CodeMirror.fromTextArea(codemirror_el, {
			lineNumbers: true,
			mode: "javascript",
			theme: "nord"
		});
		main.map_codemirror_obj.setSize(null, "100%");
		
		//Handle Mapmode UI
		window.mapmode_ui = new ve.Interface({
			anchor: "#right-sidebar-form",
			class: "ve-transparent",
			
			add_mapmode: {
				name: "Add Mapmode",
				type: "button",
				x: 0,
				y: 0,
				
				onclick: (e) => {
					console.log(e);
				}
			},
			remove_mapmode: {
				name: "Remove Mapmode",
				type: "button",
				x: 1,
				y: 0
			},
			
			
			select_mapmode: {
				name: "Select Mapmode:<br><br>",
				type: "select",
				x: 1,
				y: 1,
				
				options: {
					"default": "Default"
				},
				onload: (e) => {
				
				}
			},
			mapmode_name: {
				name: "Mapmode Name:",
				type: "text",
				x: 0,
				y: 2,
				
				attributes: {
					value: "default"
				}
			}
		});
	}
}