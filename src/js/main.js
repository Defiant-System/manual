
@import "./modules/marked.min.js";

import sideBar from "./modules/sideBar"
import contentView from "./modules/contentView"

const manual = {
	init() {
		sideBar.init(manual, contentView);
		contentView.init(manual, sideBar);
	},
	dispatch(event) {
		let file;
		switch (event.type) {
			case "open.file":
				event.open({ responseType: "text" })
					.then(file => {
						if (file.data.slice(0,5).toLowerCase() === "[toc]") {
							// shows sidebar toggler in the toolbar
							window.find(".tool-sidebar-toogle").show();

							// sidebar parse toc
							sideBar.dispatch({
								type: "parse-toc",
								path: file.path,
								data: file.data,
							});
						} else {
							// hides sidebar toggler in the toolbar
							window.find(".tool-sidebar-toogle").hide();

							// sidebar parse file
							contentView.dispatch({
								type: "parse-markdown",
								data: file.data,
								path: file.path,
							});
						}
					});
				break;
			case "sidebar-toggle-view":
			case "sidebar-select-article":
				return sideBar.dispatch(event);
		}
	}
};

window.exports = manual;
