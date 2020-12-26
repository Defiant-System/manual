
@import "./modules/marked.min.js";

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
				if (event.text) {
					file = event;
				} else {
					file = await event.open();
				}
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
			case "sidebar-toggle-view":
			case "sidebar-select-article":
				return sideBar.dispatch(event);
		}
	}
};

window.exports = manual;
