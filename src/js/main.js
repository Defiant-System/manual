
defiant.require("./modules/marked.min.js");

import sideBar from "./modules/sideBar"
import contentView from "./modules/contentView"

const manual = {
	init() {
		sideBar.init(manual, contentView);
		contentView.init(manual, sideBar);
	},
	async dispatch(event) {
		let file;
		switch (event.type) {
			case "open.file":
				file = typeof event.open === "function" ? await event.open() : event;
				
				if (file.text.slice(0,5).toLowerCase() === "[toc]") {
					// shows sidebar toggler in the toolbar
					window.find(".tool-sidebar-toogle").show();

					// sidebar parse toc
					sideBar.dispatch({
						type: "parse-toc",
						path: file.path,
						text: file.text,
					});
				} else {
					// hides sidebar toggler in the toolbar
					window.find(".tool-sidebar-toogle").hide();

					// sidebar parse file
					contentView.dispatch({
						type: "parse-markdown",
						text: file.text,
						path: file.path,
					});
				}
				break;
			case "content-toggle-lights":
				return contentView.dispatch(event);
			case "sidebar-toggle-view":
			case "sidebar-select-article":
				return sideBar.dispatch(event);
		}
	}
};

window.exports = manual;
