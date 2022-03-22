
@import "./modules/marked.min.js";

import sideBar from "./modules/sideBar"
import contentView from "./modules/contentView"

const manual = {
	init() {
		sideBar.init(manual, contentView);
		contentView.init(manual, sideBar);
	},
	dispatch(event) {
		let Self = manual,
			file;
		switch (event.type) {
			// system events
			case "window.init":
				defiant.shell("fs -ur '~/help/Welcome.md'")
					.then(cmd => Self.dispatch({ type: "parse-file", file: cmd.result }));
				break;
			case "open.file":
				event.open({ responseType: "text" })
					.then(file => {
						Self.dispatch({ type: "parse-file", file });
					});
				break;
			case "parse-file":
				if (event.file.data.slice(0,5).toLowerCase() === "[toc]") {
					// shows sidebar toggler in the toolbar
					window.find(".tool-sidebar-toogle").show();

					// sidebar parse toc
					sideBar.dispatch({
						type: "parse-toc",
						path: event.file.path,
						data: event.file.data,
					});
				} else {
					// hides sidebar toggler in the toolbar
					window.find(".tool-sidebar-toogle").hide();

					// sidebar parse file
					contentView.dispatch({
						type: "parse-markdown",
						data: event.file.data,
						path: event.file.path,
					});
				}
				break;
			// custom events
			case "sidebar-toggle-view":
			case "sidebar-select-article":
				return sideBar.dispatch(event);
		}
	}
};

window.exports = manual;
