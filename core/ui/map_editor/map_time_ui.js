//Initialise functions
{
	function initialiseMapTimeControls () {
		//Declare local instance variables
		var year_el = document.getElementById("year-input");
		
		//Parse .onclick
		year_el.addEventListener("keypress", (e) => {
			if (e.key == "Enter")
				runCurrentMapmode();
		});
	}
}