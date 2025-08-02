//Initialise functions
{
	function printMapmodeCodeEditor () {
		//Declare local instance variables
		var codemirror_el = document.getElementById("codemirror-editor");
		
		//Initialise CodeMirror Editor
		main.map_codemirror_obj = CodeMirror.fromTextArea(codemirror_el, {
			lineNumbers: true,
			mode: "javascript",
			theme: "nord"
		});
		main.map_codemirror_obj.setSize(null, "100%");
		
		//Handle Mapmode UI
	}
}