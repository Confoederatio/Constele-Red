//Initialise functions
{
	function getMapmodeFilesDictionary () {
		//Declare local instance variables
		var mapmode_files = getAllFiles(path.join(__dirname, "mapmodes"));
		var return_obj = {};
		
		//Iterate over all mapmode_files
		for (let i = 0; i < mapmode_files.length; i++)
			return_obj[mapmode_files[i]] = mapmode_files[i]
				.replace(path.join(__dirname, "mapmodes"), "")
				.replace("\\", "")
				.replace(/\\/gm, "/")
				.replace(".js", "");
		return_obj[`${path.join(__dirname, "mapmodes")}\\default.js`] = "default";
		
		//Alphabetically sort return_obj
		var entries = Object.entries(return_obj)
			.sort(([, v1], [, v2]) => v1.localeCompare(v2));
		return_obj = Object.fromEntries(entries);
		
		//Return statement
		return return_obj;
	}
	
	function readMapmodeFile (arg0_file_path) {
		//Convert from parameters
		var file_path = arg0_file_path;
		
		//Create file if it doesn't exist
		if (!fs.existsSync(file_path)) {
			try { fs.mkdirSync(path.dirname(file_path), { recursive: true }); } catch (e) {}
			fs.writeFileSync(file_path, "", "utf8");
		}
		
		//Return statement
		return fs.readFileSync(file_path, "utf8");
	}
	
	function refreshSelectMapmode () {
		//Declare local instance variables
		var html_string = [];
		var mapmode_dictionary = getMapmodeFilesDictionary();
		var select_el = window.mapmode_ui.element.querySelector(`#select_mapmode select`);
		
		//Iterate over all_mapmodes
		var all_mapmodes = Object.keys(mapmode_dictionary);
		
		for (let i = 0; i < all_mapmodes.length; i++) {
			var local_mapmode = mapmode_dictionary[all_mapmodes[i]];
			
			html_string.push(`<option id = "${all_mapmodes[i]}" value = "${all_mapmodes[i]}">${local_mapmode}</option>`);
		}
		
		select_el.innerHTML = html_string.join("");
		
		//Iterate over all select_el.options to set .value to the chosen file
		for (let local_option of select_el.options)
			if (local_option.text == main.map_codemirror_obj.file) {
				select_el.value = local_option.value;
				window.mapmode_ui.element.querySelector(`#mapmode_name input[type="text"]`).value = main.map_codemirror_obj.file;
				
				break;
			}
	}
	
	function runCurrentMapmode () {
		//Execute code
		global.year = parseInt(document.getElementById("year-input").value);
		console.log(`Loading current mapmode for ${global.year}`);
		
		clearMap();
		eval(main.map_codemirror_obj.editor.getValue());
	}
}