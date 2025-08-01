//Initialise functions
{
	function initialiseBaklavaJSToolbar () {
		//Declare local instance variables
		var toolbar_el = document.querySelector(`.baklava-toolbar`);
		
		var save_button_el = document.createElement("button");
			save_button_el.setAttribute("class", `baklava-toolbar-entry baklava-toolbar-button`);
			save_button_el.innerHTML = "Save";
			save_button_el.addEventListener("click", (e) => {
				saveState();
			});
			
		//Append buttons
		document.querySelector(`.baklava-toolbar`).appendChild(save_button_el);
	}
}