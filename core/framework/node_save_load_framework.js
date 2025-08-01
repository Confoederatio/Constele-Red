//Initialise functions
{
	function loadBaklavaJS () {
		//Internal guard clause if ./database_baklava.js does not exist
		if (!fs.existsSync(`./database_baklava.js`)) return;
		
		//Declare local instance variables
		var baklava_load_string = fs.readFileSync(`./database_baklava.js`, "utf8");
		console.log(baklava_load_string);
		
		//Load BaklavaJS
		viewModel.editor.load(JSON.parse(baklava_load_string));
	}
	
	function loadBaklavaJSState () {
		//Internal guard clause if ./database_baklava_state.js does not exist
		if (!fs.existsSync(`./database_baklava_state.js`)) return;
		
		//Declare local instance variables
		var graph_obj = viewModel.displayedGraph;
		var state_obj = JSON.parse(fs.readFileSync(`./database_baklava_state.js`, "utf8"));
		
		//Iterate over all_state_keys
		var all_state_keys = Object.keys(state_obj);
		
		for (let i = 0; i < all_state_keys.length; i++) {
			var local_state = state_obj[all_state_keys[i]];
			var node_obj = graph_obj.findNodeById(all_state_keys[i]);
			
			if (node_obj) try {
				var node_select_file_tab = node_obj.inputs.select_file_tab;
				var state_select_file_tab = local_state.select_file_tab;
				
				if (state_select_file_tab.items)
					node_select_file_tab.items = state_select_file_tab.items;
				if (state_select_file_tab._value)
					node_select_file_tab._value = state_select_file_tab._value;
			} catch (e) { console.error(e); }
		}
	}
	function loadState () {
		loadBaklavaJS();
		setTimeout(() => {
			loadBaklavaJSState();
		}, 1000);
	}
	
	function saveBaklavaJS () {
		//Declare local instance variables
		var baklava_save_string = JSON.stringify(viewModel.editor.save());
		
		//Save BaklavaJS
		fs.writeFileSync(`./database_baklava.js`, baklava_save_string);
	}
	
	function saveBaklavaJSState () {
		//[WIP] - Select inputs need to be saved and loaded back in
		//Declare local instance variables
		var all_node_els = document.querySelectorAll(`.baklava-node`);
		var graph_obj = viewModel.displayedGraph;
		var return_obj = {};
		
		//Iterate over all_node_els
		for (let i = 0; i < all_node_els.length; i++) {
			if (!all_node_els[i].getAttribute("id")) continue;
			return_obj[all_node_els[i].id] = {};
			
			if (all_node_els[i].getAttribute("data-node-type") == "Script Node") {
				var node_obj = graph_obj.findNodeById(all_node_els[i].id);
				var save_node_obj = return_obj[all_node_els[i].id];
				
				save_node_obj.select_file_tab = {
					items: node_obj.inputs.select_file_tab.items,
					_value: node_obj.inputs.select_file_tab._value
				};
			}
		}
		
		//Save return_obj
		fs.writeFileSync(`./database_baklava_state.js`, JSON.stringify(return_obj));
	}
	
	function saveState () {
		saveBaklavaJS();
		saveBaklavaJSState();
	}
}