//Initialise functions
{
	function addFileToNode (arg0_baklava_node_el) {
		//Convert from parameters
		var baklava_node_el = arg0_baklava_node_el;
		
		//Declare local instance variables
		var graph_obj = viewModel.displayedGraph;
		var node_obj = graph_obj.findNodeById(baklava_node_el.id);
		
		var file_name_el = baklava_node_el.querySelector(`.baklava-input[title="file_name"]`);
		var selected_file_el = baklava_node_el.querySelector(`.baklava-select[title="selected_file_name"]`);
		var selected_obj = [];
		
		//Iterate over all items in selected_file_el .__dropdown
		var all_items = selected_file_el.querySelectorAll(`.__dropdown .item:not(.--header)`);
		
		for (let i = 0; i < all_items.length; i++)
			selected_obj.push({ text: all_items[i].innerHTML, value: all_items[i].innerHTML });
		
		//Add element if it doesn't already exist
		var new_file_exists = false;
		
		for (let i = 0; i < selected_obj.length; i++)
			if (selected_obj[i].value == file_name_el.value)
				new_file_exists = true;
		
		if (!new_file_exists)
			selected_obj.push({ text: file_name_el.value, value: file_name_el.value });
		
		node_obj.inputs.select_file_tab.items = selected_obj;
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
	
	function getGraphConnections () {
		//Declare local instance variables
		var all_connections = viewModel.displayedGraph._connections;
		var return_obj = {};
		
		//Iterate over all_connections
		for (var i = 0; i < all_connections.length; i++) {
			var local_from_connection = all_connections[i].from.id;
			var local_to_connection = all_connections[i].to.id;
			
			if (!return_obj[local_from_connection]) return_obj[local_from_connection] = {
				outputs: []
			};
			return_obj[local_from_connection].outputs.push(local_to_connection);
		}
		
		//Return statement
		return return_obj;
	}
	
	function getParentNodeFromElement (arg0_element) {
		//Convert from parameters
		var element = arg0_element;
		
		//Return statement
		return element.parentElement.parentElement.parentElement.parentElement.parentElement;
	}
	
	function switchFileOnNode (arg0_baklava_node_el) { //[WIP] - Finish function body
	
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
			file: options.input_file_path
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