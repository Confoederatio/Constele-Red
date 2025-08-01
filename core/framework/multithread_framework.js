//Import statements
var { ipcRenderer } = require("electron");

//Initialise functions
{
	global.runTask = async function (arg0_code, arg1_args) {
		//Convert from parameters
		var code = arg0_code;
		var args = (arg1_args) ? arg1_args : {};
		
		//Wait for result
		var result = await ipcRenderer.invoke("run-task", code, args);
		console.log(result);
	}
}