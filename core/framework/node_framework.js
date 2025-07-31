//Initialise functions
{
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
		
		//Declare local instance variables
		var codemirror_editor = CodeMirror(options.element, {
			lineNumbers: true,
			mode: "javascript",
			theme: "nord",
			value: "//test"
		});
	}
	
	function HTMLInterface (arg0_el, arg1_options) {
		//Convert from parameters
		var element = arg0_el;
		var options = (arg1_options) ? arg1_options : {};
		
		//Declare local instance variables
		var node_id = generateRandomID(global.main.nodes.map);
		
		var output_interface = new BaklavaJS.RendererVue.TextInputInterface(`html-interface-${node_id}`, "Loading ..");
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