//Initialise functions
{
	/**
	 * Creates a CodeMirrorInterface, dependent on HTMLInterface().
	 * @param {Object} arg0_options
	 *  @param {string} arg0_options.input_file_path
	 */
	function CodeMirrorInterface (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		
	}
	
	function HTMLInterface (arg0_el, arg1_options) {
		//Convert from parameters
		var element = arg0_el;
		var options = (arg1_options) ? arg1_options : {};
		
		//Declare local instance variables
		var node_id = generateRandomID(global.main.nodes.node_map);
		
		var output_interface = new BaklavaJS.RendererVue.TextInputInterface(`html-interface-${node_id}`, "Loading ..");
		if (options.has_node != true)
			output_interface.setPort(false);
		
		setTimeout(() => {
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
			
			//Add to global.main.nodes.node_map
			global.main.nodes.node_map[node_id] = {
				selector: local_selector,
				element: new_element
			};
		});
		
		//Return statement
		return output_interface;
	}
}