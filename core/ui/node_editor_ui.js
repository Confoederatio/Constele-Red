{
	function getBaklavaScale () {
		var nodeContainer = document.querySelector('#node-editor .node-container');
		if (!nodeContainer) return 1;
		var match = nodeContainer.style.transform.match(/scale\(([\d.]+)\)/);
		return match ? parseFloat(match[1]) : 1;
	}
	
	function initialiseBaklava () {
		global.viewModel = BaklavaJS.createBaklava(document.getElementById("node-editor"));
		
		const ScriptNode = BaklavaJS.Core.defineNode({
			type: "Script Node",
			
			inputs: {
				input_dependency: () => HTMLInterface(`Input (Dependency)`, { has_node: true }),
				
				file_controls: () => HTMLInterface(`
					<button id = "add-file" class = "baklava-button">Add File</button>
					<button id = "remove-file" class = "baklava-button">Remove File</button>
					<button id = "save-file" class = "baklava-button">Save File</button>
				`, {
					special_function: function (element) {
						var node_el = getParentNodeFromElement(element);
						
						//Add File
						node_el.querySelector(`#add-file`).addEventListener("click", (e) => {
							console.log(e);
							addFileToNode(node_el);
						});
					}
				}),
				select_file_tab: () => new BaklavaJS.RendererVue.SelectInterface("selected_file_name", "", []).setPort(false),
				file_name: () => new BaklavaJS.RendererVue.TextInputInterface("file_name", "test.js").setPort(false),
				
				codemirror_editor: () => HTMLInterface(``, {
					special_function: function (element) {
						console.log(element);
						CodeMirrorInterface({
							element: element
						});
					}
				}),
			},
			outputs: {
				output: () => HTMLInterface(`Output`, { has_node: true }),
				initialisation: () => HTMLInterface(``, {
					special_function: function (element) {
						var node_el = getParentNodeFromElement(element);
						var node_obj = {};
						
						var node_logic_loop = setInterval(function(){
							var file_name_el = node_el.querySelector(`.baklava-input[title="file_name"]`);
							var selected_file_el = node_el.querySelector(`.baklava-select[title="selected_file_name"]`);
							var selected_file_value =  selected_file_el.getAttribute("modelvalue");
							
							//.onchange handler for selected_file_value
							if (node_obj.selected_file != selected_file_value) {
								file_name_el.value = selected_file_value;
								
								//Set tracker
								node_obj.selected_file = selected_file_value;
							}
						}, 100);
						
						console.log(node_el);
					}
				})
			},
			
			//Rubbish collection
			onDestroy: function (e) {
				cleanCustomNodesOnDestroy(this);
			}
		});
		viewModel.editor.registerNodeType(ScriptNode);
		
		const TestNode = BaklavaJS.Core.defineNode({
			type: "Test Node",
			inputs: {
				a: () => new BaklavaJS.RendererVue.TextareaInputInterface("Hello", "world")
			},
			outputs: {
				b: () => new BaklavaJS.RendererVue.TextareaInputInterface("Hello", "world")
			}
		});
		viewModel.editor.registerNodeType(TestNode);
		
		//Logic loop handler
		global.baklava_logic_loop = setInterval(function(){
			var all_nodes_in_graph = document.querySelectorAll(`.baklava-node:not([class*="--palette"])`);
			var all_non_resizable_nodes_in_graph = document.querySelectorAll(`.baklava-node:not([class*="--palette"]):not(.resizable)`);
			var node_map_obj = global.main.nodes.map;
			
			for (let i = 0; i < all_nodes_in_graph.length; i++) {
				var all_local_components = all_nodes_in_graph[i].querySelectorAll(`div[node] .baklava-input`);
				
				for (let x = 0; x < all_local_components.length; x++) {
					var local_title = all_local_components[x].getAttribute("title");
					
					if (local_title.startsWith("html-interface-")) {
						var local_key = local_title.replace("html-interface-", "");
						
						if (node_map_obj[local_key]) {
							var local_node = node_map_obj[local_key];
							
							all_local_components[x].replaceWith(local_node.element);
						}
					}
				}
			}
			
			//Update trackers
			main.nodes.graph = getGraphConnections();
			
			//[WIP] - Experimental drag optioning. Doesn't work currently
			/*for (let i = 0; i < all_non_resizable_nodes_in_graph.length; i++)
				elementDragHandler(all_non_resizable_nodes_in_graph[i], {
					allow_overflow: true,
					draggable: false,
					is_resizable: true,
					unbounded: true
				});*/
		}, 100);
	}
}