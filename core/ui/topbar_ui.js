//Initialise functions
{
	function closeAllToolbarTabs () {
		//Declare local instance variables
		var all_tab_els = document.querySelectorAll(`#topbar .tab`);
		
		//Iterate over all_tab_els
		for (var i = 0; i < all_tab_els.length; i++)
			all_tab_els[i].classList.remove(`active`);
	}
	
	function initialiseToolbar () {
		//Declare local instance variables
		var all_tab_els = document.querySelectorAll(`#topbar .tab`);
		
		//Iterate over all_tab_els and set .onclick handlers
		for (let i = 0; i < all_tab_els.length; i++) {
			let local_title_el = all_tab_els[i].querySelector(`.title`);
			
			all_tab_els[i].onclick = function (e) {
				//Declare local instance variables
				var was_active = all_tab_els[i].classList.contains("active");
				
				//Stop the click event from propagating to the document listener; close all toolbar tabs
				var is_dropdown_item = false;
				try { is_dropdown_item = (e.target.classList.contains("dropdown-item")); } catch (e) {}
				
				if (!is_dropdown_item) {
					e.stopPropagation();
					closeAllToolbarTabs();
					
					if (!was_active)
						all_tab_els[i].classList.add("active");
				}
			};
		}
		
		//Populate tab states
		setTimeout(function(){
			/*
			var split_screen_button_el = document.getElementById("split-screen-button");
			if (editor.isSplitScreen())
				split_screen_button_el.classList.add("active");
			split_screen_button_el.onclick = function (e) {
				closeAllToolbarTabs();
				toggleSplitScreen();
			};
			 */
		}, 100);
	}
	
	/*function initialiseToolbarKeybinds () {
		//Declare local instance variables
		var ctrl_toolbar_keybinds = {
			"f": "file-topbar",
			"e": "settings-topbar",
			"v": "view-topbar"
		};
		
		//Instantiate document keybind handler
		document.addEventListener("keydown", (e) => {
			//Handle Escape key to close any open menu
			if (e.key == "Escape") {
				closeAllToolbarTabs();
				return;
			}
			
			//Handle Ctrl key combinations
			if (e.ctrlKey && ctrl_toolbar_keybinds.hasOwnProperty(e.key.toLowerCase())) {
				var tab_id = ctrl_toolbar_keybinds[e.key.toLowerCase()];
				var target_tab_el = document.querySelector(`#topbar .tab[id="${tab_id}"]`);
				
				e.preventDefault();
				if (target_tab_el) {
					var was_active = target_tab_el.classList.contains("active");
					
					closeAllToolbarTabs();
					if (!was_active)
						target_tab_el.classList.add("active");
				}
			}
		});
	}*/
}