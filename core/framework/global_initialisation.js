//Initialise functions
{
	function initialiseGlobal () {
		//Declare local instance variables
		if (!global.main) global.main = {};
		
		if (!main.codemirror) main.codemirror = {};
			if (!main.codemirror.files) main.codemirror.files = {}; //Maps file paths to raw code
			if (!main.codemirror.map) main.codemirror.map = {};
		if (!main.map) main.map = {};
			if (!main.map.codemirror) main.map.codemirror = {};
		if (!main.nodes) main.nodes = {};
			if (!main.nodes.graph) main.nodes.graph = {};
			if (!main.nodes.map) main.nodes.map = {};
	};
}