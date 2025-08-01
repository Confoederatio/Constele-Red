//Import statements
var { ipcRenderer } = require("electron");

//Initialise functions
{
	function getConnectionNodeID (arg0_connection_id) {
		//Convert from parameters
		var connection_id = arg0_connection_id;
		
		//Declare local instance variables
		var connection_el = document.getElementById(connection_id);
		
		//Return statement
		return connection_el.parentElement.parentElement.parentElement.id;
	}
	
	function getGraphConnections () {
		//Declare local instance variables
		var all_connections = viewModel.displayedGraph._connections;
		var return_obj = {};
		
		//Iterate over all_connections
		for (var i = 0; i < all_connections.length; i++) {
			var local_from_connection = getConnectionNodeID(all_connections[i].from.id);
			var local_to_connection = getConnectionNodeID(all_connections[i].to.id);
			
			if (!return_obj[local_from_connection]) return_obj[local_from_connection] = {
				outputs: []
			};
			return_obj[local_from_connection].outputs.push(local_to_connection);
		}
		
		//Return statement
		return return_obj;
	}
	
	function getNodeCode (arg0_baklava_node_el) {
		//Convert from parameters
		var baklava_node_el = arg0_baklava_node_el;
		
		//Declare local instance variables
		var all_file_paths = [];
		var codemirror_obj = getCodeMirrorFromNode(baklava_node_el);
		var node_obj = viewModel.displayedGraph.findNodeById(baklava_node_el.id);
		var return_code = [];
		
		//Iterate over all_file_items
		var all_file_items = node_obj.inputs.select_file_tab.items;
		var selected_file_item = node_obj.inputs.select_file_tab._value;
		
		for (let i = 0; i < all_file_items.length; i++)
			if (all_file_items[i].value.length > 0) {
				var local_absolute_path = path.join(__dirname, "scripts", all_file_items[i].value);
				
				if (!fs.existsSync(local_absolute_path)) continue; //Internal guard clause to make sure file exists
				if (all_file_items[i].value == selected_file_item) {
					try {
						return_code.push(codemirror_obj.editor.getValue());
					} catch (e) { console.error(e); }
				} else {
					try {
						var file_code_value = fs.readFileSync(local_absolute_path, "utf8");
						
						if (file_code_value)
							return_code.push(file_code_value);
					} catch (e) { console.error(e); }
				}
			}
		
		//Return statement
		return return_code.join("\n");
	}
	
	global.runDAGFromNode = async function (arg0_start_node_el) {
		//Convert from parameters
		var start_node_el = arg0_start_node_el;
		
		//Declare local instance variables
		var graph_obj = getGraphConnections();
		
		async function processNode (arg0_node_id, arg1_args) {
			//Convert from parameters
			var node_id = arg0_node_id;
			var args = (arg1_args) ? arg1_args : {};
			
			//Declare local instance variables
			var actual_args = { ...args };
			var code_string = getNodeCode(document.getElementById(node_id));
				await runTask(code_string, actual_args);
			
			console.log(`Finished processing:`, node_id, code_string, actual_args, graph_obj);
			
			var graph_node_obj = graph_obj[node_id];
			if (!graph_node_obj || !graph_node_obj.outputs || graph_node_obj.outputs.length == 0) return; //Guard clause if node has no outputs
			
			//Process each output node sequentially
			for (var child_id of graph_node_obj.outputs)
				await processNode(child_id, actual_args);
		}
		
		//Start the process
		await processNode(start_node_el.id, {});
	};
	
	global.runTask = async function (arg0_code, arg1_args) {
		//Convert from parameters
		var code = arg0_code;
		var args = (arg1_args) ? arg1_args : {};
		
		//Wait for result
		var result = await ipcRenderer.invoke("run-task", code, args);
		console.log(result);
	}
}