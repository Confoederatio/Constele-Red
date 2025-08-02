//Initialise functions
{
	function printMapmodeCodeEditor () { //[WIP] - This could break because ve.Interface returns HTMLElement, and not its instance
		//Declare local instance variables
		var codemirror_el = document.getElementById("codemirror-editor");
		
		//Initialise CodeMirror Editor
		main.map_codemirror_obj = {
			editor: CodeMirror.fromTextArea(codemirror_el, {
				lineNumbers: true,
				mode: "javascript",
				theme: "nord"
			}),
			file: "default"
		};
		var codemirror_obj = main.map_codemirror_obj;
			codemirror_obj.editor.setSize(null, "100%");
			codemirror_obj.file = "default"; //Missing .js suffix by default
		
		//Handle Mapmode UI
		window.mapmode_ui = new ve.Interface({
			anchor: "#right-sidebar-form",
			can_close: false,
			class: "ve-transparent",
			
			add_mapmode: {
				name: "Add Mapmode",
				type: "button",
				x: 0,
				y: 0,
				
				onclick: (e) => {
					//If it doesn't already exist, create a new file
					var mapmode_name =  window.mapmode_ui.querySelector(`#mapmode_name input[type='text']`).value;
					
					var absolute_file_path = path.join(__dirname, "mapmodes", mapmode_name);
						absolute_file_path = `${absolute_file_path.replace(/\\/gm, "/")}.js`;
					var code = readMapmodeFile(absolute_file_path); //Dummy function to create file
					var select_mapmode_el = window.mapmode_ui.querySelector(`#select_mapmode select`);
						select_mapmode_el.value = codemirror_obj.file;
						
					//Update CodeMirror
					main.map_codemirror_obj.file = mapmode_name;
					fs.writeFileSync(absolute_file_path, main.map_codemirror_obj.editor.getValue());
					
					setTimeout(() => {
						refreshSelectMapmode();
					}, 100);
				}
			},
			remove_mapmode: {
				name: "Remove Mapmode",
				type: "button",
				x: 1,
				y: 0,
				
				onclick: (e) => {
					//Confirmation prompt
					var absolute_file_path = window.mapmode_ui.querySelector(`#select_mapmode select`).value;
					
					if (fs.existsSync(absolute_file_path))
						if (window.confirm(`Are you sure you want to delete ${absolute_file_path}?`)) {
							fs.unlinkSync(absolute_file_path);
							refreshSelectMapmode();
						}
				}
			},
			
			select_mapmode: {
				name: "Select Mapmode:<br><br>",
				type: "select",
				x: 0,
				y: 1,
				
				options: {
					"default": "Default"
				},
				onclick: (e) => {
					var selected_text = e.target.options[e.target.selectedIndex].text;
					
					main.map_codemirror_obj.file = selected_text;
					refreshSelectMapmode();
					try {
						codemirror_obj.editor.setValue(readMapmodeFile(e.target.value));
					} catch (e) { console.error(e); }
				},
				onload: (e) => {
					setTimeout(() => {
						try {
							refreshSelectMapmode();
							
							//Check code
							var code = readMapmodeFile(e.querySelector("select").value);
							
							if (code.length > 0)
								main.map_codemirror_obj.editor.setValue(code);
						} catch (e) { console.error(e); }
					});
				}
			},
			run_mapmode: {
				name: "Run Mapmode",
				type: "button",
				x: 1,
				y: 1,
				
				onclick: (e) => {
					try {
						eval(main.map_codemirror_obj.editor.getValue());
					} catch (e) {
						console.error(e);
					}
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