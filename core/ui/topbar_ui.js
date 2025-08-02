//Initialise functions
{
	function closeAllTabs () {
		//Declare local instance variables
		var all_tab_container_els = document.querySelectorAll(`#scene > div[tab="true"]`);
		
		//Iterate over all_tab_container_els and set them to visibility-hidden
		for (let i = 0; i < all_tab_container_els.length; i++)
			all_tab_container_els[i].setAttribute("class", "visibility-hidden");
	}
	
	function closeAllTopbarTabs () {
		//Declare local instance variables
		var all_tab_els = document.querySelectorAll(`#topbar .tab`);
		
		//Iterate over all_tab_els
		for (var i = 0; i < all_tab_els.length; i++)
			all_tab_els[i].classList.remove(`active`);
	}
	
	function initialiseTopbar () {
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
					closeAllTopbarTabs();
					
					if (!was_active)
						all_tab_els[i].classList.add("active");
				}
			};
		}
		
		//Populate tab states
		setTimeout(function(){
			var map_editor_button_el = document.getElementById("map-editor-topbar");
			var node_editor_button_el = document.getElementById("node-editor-topbar");
			
			//Toggle tab displays
			map_editor_button_el.addEventListener("click", function (e) {
				closeAllTabs();
				document.querySelector(`#maptalks-editor-container`).setAttribute("class", "active");
			});
			
			node_editor_button_el.addEventListener("click", function (e) {
				closeAllTabs();
				document.querySelector(`#node-editor-container`).setAttribute("class", "active")
			});
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
				closeAllTopbarTabs();
				return;
			}
			
			//Handle Ctrl key combinations
			if (e.ctrlKey && ctrl_toolbar_keybinds.hasOwnProperty(e.key.toLowerCase())) {
				var tab_id = ctrl_toolbar_keybinds[e.key.toLowerCase()];
				var target_tab_el = document.querySelector(`#topbar .tab[id="${tab_id}"]`);
				
				e.preventDefault();
				if (target_tab_el) {
					var was_active = target_tab_el.classList.contains("active");
					
					closeAllTopbarTabs();
					if (!was_active)
						target_tab_el.classList.add("active");
				}
			}
		});
	}*/
}