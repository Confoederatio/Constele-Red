//Initialise functions
{
	function addFileToNode (arg0_baklava_node_el, arg1_file_name) {
		//Convert from parameters
		var baklava_node_el = arg0_baklava_node_el;
		var file_name = (arg1_file_name) ? arg1_file_name : "";
		
		//Declare local instance variables
		var graph_obj = viewModel.displayedGraph;
		var node_obj = graph_obj.findNodeById(baklava_node_el.id);
		var selected_file_el = baklava_node_el.querySelector(`.baklava-select[title="selected_file_name"]`);
		var selected_obj = [];
		
		//Iterate over all items in selected_file_el .__dropdown
		var all_items = selected_file_el.querySelectorAll(`.__dropdown .item:not(.--header)`);
		
		for (let i = 0; i < all_items.length; i++)
			selected_obj.push({ text: all_items[i].innerHTML, value: all_items[i].innerHTML });
		
		//Add element if it doesn't already exist
		var new_file_exists = false;
		
		for (let i = 0; i < selected_obj.length; i++)
			if (selected_obj[i].value == file_name)
				new_file_exists = true;
		
		if (!new_file_exists)
			selected_obj.push({ text: file_name, value: file_name });
		
		//Set select component
		node_obj.inputs.select_file_tab.items = selected_obj;
		node_obj.inputs.select_file_tab._value = file_name;
		
		//Switch code file
		try {
			switchCodeFileOnNode(baklava_node_el, file_name);
		} catch (e) {
			console.error(e);
		}
	}
	
	function cleanCustomNodesOnDestroy (arg0_baklava_node_obj) {
		//Convert from parameters
		var baklava_node_obj = arg0_baklava_node_obj;
		
		//Declare local instance variables
		var node_map_obj = main.nodes.map;
		
		//Clean .inputs/.outputs
		if (baklava_node_obj.inputs) {
			var all_input_keys = Object.keys(baklava_node_obj.inputs);
			
			for (let i = 0; i < all_input_keys.length; i++) {
				var local_input = baklava_node_obj.inputs[all_input_keys[i]];
				
				if (local_input.node) delete main.nodes.map[local_input.node.key];
			}
		}
		if (baklava_node_obj.outputs) {
			var all_output_keys = Object.keys(baklava_node_obj.outputs);
			
			for (let i = 0; i < all_output_keys.length; i++) {
				var local_output = baklava_node_obj.outputs[all_output_keys[i]];
				
				if (local_output.node) delete main.nodes.map[local_output.node.key];
			}
		}
	}
	
	function getCodeMirrorFromNode (arg0_baklava_node_el, arg1_code) {
		//Convert from parameters
		var baklava_node_el = arg0_baklava_node_el;
		var code = (arg1_code) ? arg1_code : "";
		
		//Declare local instance variables
		var codemirror_map_obj = main.codemirror.map;
		var dummy_codemirror_el = baklava_node_el.querySelector(`[id*="html-interface"]:has(.CodeMirror)`);
		
		//Iterate over all_codemirrors
		var all_codemirrors = Object.keys(main.codemirror.map);
		
		for (let i = 0; i < all_codemirrors.length; i++) {
			var local_codemirror = codemirror_map_obj[all_codemirrors[i]];
			
			if (local_codemirror.dummy_el.isEqualNode(dummy_codemirror_el))
				//Return statement
				return local_codemirror;
		}
	}
	
	function getParentNodeFromElement (arg0_element) {
		//Convert from parameters
		var element = arg0_element;
		
		//Return statement
		return element.parentElement.parentElement.parentElement.parentElement.parentElement;
	}
	
	function moveFile (arg0_input_file_path, arg1_output_file_path) {
		//Convert from parameters
		var input_file_path = arg0_input_file_path;
		var output_file_path = arg1_output_file_path;
		
		//Declare local instance variables
		var absolute_input_path = path.join(__dirname, "scripts", input_file_path);
		var absolute_output_path = path.join(__dirname, "scripts", output_file_path);
		
		if (absolute_input_path == absolute_output_path) return;
		if (fs.existsSync(absolute_output_path))
			if (!window.confirm(`${absolute_output_path} already exists. Would you like to overwrite it?`)) {
				console.error(`${absolute_output_path} already exists. Address this conflict manually.`);
				return;
			}
		
		fs.mkdirSync(path.dirname(absolute_output_path), { recursive: true });
		fs.renameSync(absolute_input_path, absolute_output_path);
		
		removeEmptyFolders(path.join(__dirname, "scripts"));
	}
	
	function removeEmptyFolders (arg0_file_path) {
		//Convert from parameters
		var file_path = arg0_file_path;
		
		//Declare local instance variables
		var files;
			try {
				files = fs.readdirSync(file_path);
			} catch (e) { return false; } //Return statement
		
		//Process all subdirectories first
		for (var local_file of files) {
			var full_path = path.join(file_path, local_file);
			var local_stat = fs.lstatSync(full_path);
			
			if (local_stat.isDirectory())
				removeEmptyFolders(full_path);
		}
		
		//Re-read directory after processing subfolders
		var remaining_files = fs.readdirSync(file_path);
		
		//Remove directory if empty
		if (remaining_files.length == 0) {
			fs.rmdirSync(file_path);
			
			//Return statement
			return true;
		}
		return false;
	}
	
	function removeFileFromNode (arg0_baklava_node_el, arg1_file_name) {
		//Convert from parameters
		var baklava_node_el = arg0_baklava_node_el;
		var file_name = (arg1_file_name) ? arg1_file_name : "";
		
		//Declare local instance variables
		var graph_obj = viewModel.displayedGraph;
		var node_obj = graph_obj.findNodeById(baklava_node_el.id);
		var selected_file_el = baklava_node_el.querySelector(`.baklava-select[title="selected_file_name"]`);
		var selected_index = -1;
		var selected_items = node_obj.inputs.select_file_tab.items;
		
		//Find selected_index; Iterate over all items in node_obj.inputs.select_file_tab.items
		for (let i = 0; i < selected_items.length; i++) {
			var local_item = selected_items[i];
			
			if (local_item.value == node_obj.inputs.select_file_tab._value) {
				selected_index = i;
				break;
			}
		}
		
		if (selected_items.length > 1) {
			//Attempt to see if a backwards item exists
			if (selected_items[selected_index - 1]) {
				switchCodeFileOnNode(baklava_node_el, selected_items[selected_index - 1].value);
			}
			//Attempt to see if a forwards item exists
			else if (selected_items[selected_index + 1]) {
				switchCodeFileOnNode(baklava_node_el, selected_items[selected_index + 1].value);
			}
		} else {
			setCodeFileOnNode(baklava_node_el, undefined);
		}
		if (selected_index != -1)
			node_obj.inputs.select_file_tab.items.splice(selected_index, 1);
		removeEmptyFolders(path.join(__dirname, "scripts"));
	}
	
	function saveScriptFile (arg0_file_path, arg1_code) {
		//Convert from parameters
		var file_path = arg0_file_path;
		var code = arg1_code;
		
		//Declare local instance variables
		var absolute_file_path = path.join(__dirname, "scripts", file_path);
		
		//Create file if it doesn't exist
		if (!fs.existsSync(absolute_file_path)) {
			fs.mkdirSync(path.dirname(absolute_file_path), { recursive: true });
			fs.writeFileSync(absolute_file_path, "");
		}
		
		if (code)
			fs.writeFileSync(absolute_file_path, code);
	}
	
	function setCodeFileOnNode (arg0_baklava_node_el, arg1_file_path) {
		//Convert from parameters
		var baklava_node_el = arg0_baklava_node_el;
		var file_path = arg1_file_path;
		
		//Declare local instance variables
		var graph_obj = viewModel.displayedGraph;
		
		var codemirror_obj = getCodeMirrorFromNode(baklava_node_el);
		var node_obj = graph_obj.findNodeById(baklava_node_el.id);
		var selected_file_component = node_obj.inputs.select_file_tab;
		
		//Set value
		if (file_path) {
			main.codemirror.map[codemirror_obj.key].file = file_path;
			selected_file_component._value = file_path;
		} else {
			console.log(codemirror_obj)
			main.codemirror.map[codemirror_obj.key].file = undefined;
			selected_file_component._value = "";
		}
	}
	
	function setCodeOnNode (arg0_baklava_node_el, arg1_code) {
		//Convert from parameters
		var baklava_node_el = arg0_baklava_node_el;
		var code = (arg1_code) ? arg1_code : "";
		
		//Declare local instance variables
		var codemirror_obj = getCodeMirrorFromNode(baklava_node_el);
		
		//Set value
		main.codemirror.map[codemirror_obj.key].editor.setValue(code);
	}
	
	function switchCodeFileOnNode (arg0_baklava_node_el, arg1_file_path) {
		//Convert from parameters
		var baklava_node_el = arg0_baklava_node_el;
		var file_path = arg1_file_path;
		
		//Declare local instance variables
		console.log(file_path);
		var absolute_file_path = path.join(__dirname, "scripts", file_path);
		
		//Create file if it doesn't exist
		saveScriptFile(file_path, undefined);
		
		//Set file content
		//console.log(global.test = fs.statSync(absolute_file_path));
		var file_content = fs.readFileSync(absolute_file_path, "utf8");
		
		setCodeOnNode(baklava_node_el, file_content);
		setCodeFileOnNode(baklava_node_el, file_path);
	}
}

//Initialise pseudo-classes
{
	/**
	 * Creates a CodeMirrorInterface, dependent on HTMLInterface().
	 * @param {Object} arg0_options
	 *  @param {HTMLElement} arg0_options.element
	 *  @param {string} arg0_options.input_file_path
	 */
	function CodeMirrorInterface (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};
		
		//Initialise options
		if (!options.element) options.element = document.createElement("div");
		if (!options.input_file_path) options.input_file_path = `test.js`;
		
		//Declare local instance variables
		var codemirror_el = document.createElement("div");
		var codemirror_overlay_el = document.getElementById("codemirror-overlay");
			codemirror_overlay_el.appendChild(codemirror_el);
		var codemirror_map_obj = main.codemirror.map;
		
		var codemirror_id = generateRandomID(codemirror_map_obj);
			
		//Dummy editor (not visible)
		var codemirror_dummy_editor = CodeMirror(options.element, {
			lineNumbers: true,
			mode: "javascript",
			theme: "nord",
			value: "//Below Interface - You should never see this."
		});
		
		//Actual editor
		var codemirror_editor = CodeMirror(codemirror_el, {
			lineNumbers: true,
			mode: "javascript",
			theme: "nord",
			value: "//Actual Interface"
		});
		
		codemirror_map_obj[codemirror_id] = {
			dummy_editor: codemirror_dummy_editor,
			dummy_el: options.element,
			editor: codemirror_editor,
			element: codemirror_el,
			file: options.input_file_path,
			key: codemirror_id
		};
		
		//Local instance functions
		{
			function close () {
				//Remove overlay from DOM; clean up CodeMirror instance
				if (codemirror_el.parentNode)
					codemirror_el.parentNode.removeChild(codemirror_el);
				if (codemirror_editor)
					codemirror_editor.toTextArea && codemirror_editor.toTextArea();
				
				//Delete from codemirror_map_obj
				delete codemirror_map_obj[codemirror_id];
			}
			
			function loadFileContent () {
				//Initialise file if it doesn't exist
				
				//Load file content
			}
			
			function syncOverlay () {
				if (!codemirror_map_obj[codemirror_id]) return;
				if (!options.element.isConnected)
					close();
				
				var rect = options.element.getBoundingClientRect();
				var scale = getBaklavaScale();
				
				// Overlay matches the node's on-screen size
				codemirror_el.style.position = "absolute";
				codemirror_el.style.left = rect.left + "px";
				codemirror_el.style.top = rect.top + "px";
				codemirror_el.style.width = rect.width + "px";
				codemirror_el.style.height = rect.height + "px";
				codemirror_el.style.overflow = "hidden";
				
				// CodeMirror fills the overlay, font-size matches scale
				var cmRoot = codemirror_el.querySelector('.CodeMirror');
				if (cmRoot) {
					cmRoot.style.width = "100%";
					cmRoot.style.height = "100%";
					cmRoot.style.fontSize = (scale * 100) + "%";
				}
				codemirror_editor.refresh();
				
				requestAnimationFrame(syncOverlay);
			}
		}
		
		syncOverlay();
	}
	
	function HTMLInterface (arg0_el, arg1_options) {
		//Convert from parameters
		var element = arg0_el;
		var options = (arg1_options) ? arg1_options : {};
		
		//Declare local instance variables
		var node_id = generateRandomID(global.main.nodes.map);
		
		var output_interface = new BaklavaJS.RendererVue.TextInputInterface(`html-interface-${node_id}`, "Loading ..");
			output_interface.allowMultipleConnections = true;
		if (options.has_node != true)
			output_interface.setPort(false);
		
		setTimeout(() => {
			try {
				var local_key = `html-interface-${node_id}`;
				var local_selector = `[node="[object Object]"] [title="${local_key}"]`;
				
				var local_output_els = document.querySelectorAll(local_selector);
				var new_element = document.createElement("div");
				
				if (typeof element == "object") {
					new_element = element;
				} else if (typeof element == "string") {
					new_element.innerHTML = element;
				}
				new_element.setAttribute("id", local_key);
				local_output_els[0].replaceWith(new_element);
				
				//Call callback function
				if (options.special_function)
					options.special_function(new_element);
				
				//Add to global.main.nodes.map
				global.main.nodes.map[node_id] = {
					key: node_id,
					selector: local_selector,
					element: new_element
				};
				output_interface.node = global.main.nodes.map[node_id];
			} catch (e) {
				console.warn(e);
			}
		});
		
		//Return statement
		return output_interface;
	}
}