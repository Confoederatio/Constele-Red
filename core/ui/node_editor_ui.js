global.custom_node_map = {};

function HTMLInterface (arg0_el, arg1_function) {
	//Convert from parameters
	var element = arg0_el;
	var local_function = arg1_function;
	
	//Declare local instance variables
	var node_id = generateRandomID(global.custom_node_map);
	
	var output_interface = new BaklavaJS.RendererVue.TextInputInterface(`html-interface-${node_id}`, "Loading ..");
	
	setTimeout(() => {
		var local_output_els = document.querySelectorAll(`
			[node="[object Object]"] [title="html-interface-${node_id}"]
		`);
		
		if (typeof element == "object") {
			local_output_els[0].replaceWith(element);
		} else if (typeof element == "string") {
			local_output_els[0].outerHTML = element;
		}
		
		//Call callback function
		if (local_function)
			local_function(local_output_els[0]);
	});
	
	//Return statement
	return output_interface;
}

const viewModel = BaklavaJS.createBaklava(document.getElementById("node-editor"));
const CustomNode = BaklavaJS.Core.defineNode({
	type: "Custom Node",
	inputs: {
		a: () => HTMLInterface(`Input`),
	},
	outputs: {
		b: () => HTMLInterface(`Output`),
	},
});
viewModel.editor.registerNodeType(CustomNode);

const TestNode = BaklavaJS.Core.defineNode({
	type: "TestNode",
	inputs: {
		a: () => new BaklavaJS.RendererVue.TextareaInputInterface("Hello", "world")
	},
	outputs: {
		b: () => new BaklavaJS.RendererVue.TextareaInputInterface("Hello", "world")
	}
});
viewModel.editor.registerNodeType(TestNode);