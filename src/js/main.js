
/*

TODO:
 - Fix TOC
 - Toggle sidebar button, if TOC exists

*/

@import "./modules/marked.min.js";


const manual = {
	init() {
		// fast references
		this.els = {
			layout: window.find("layout"),
			blankView: window.find(".blank-view"),
			toolbar: {
				sidebar: window.find(`.toolbar-tool_[data-click="sidebar-toggle-view"]`),
				prev: window.find(`.toolbar-tool_[data-click="go-prev"]`),
				next: window.find(`.toolbar-tool_[data-click="go-next"]`),
			}
		};
		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init(this));

	},
	dispatch(event) {
		let Self = manual,
			file;
		switch (event.type) {
			// system events
			case "window.init":
				// reset app by default - show initial view
				Self.dispatch({ type: "reset-app" });
				// karaqu.shell("fs -ur '~/help/Welcome.md'")
				// 	.then(cmd => {
				// 		Self.dispatch({ type: "parse-file", file: cmd.result });
				// 	});
				break;
			case "open.file":
				event.open({ responseType: "text" })
					.then(file => {
						Self.dispatch({ type: "parse-file", file });
					});
				break;
			// custom events
			case "open-file":
				window.dialog.open({ md: item => Self.dispatch(item) });
				break;
			case "reset-app":
			case "close-file":
				// hide sidebar, if needed
				if (!Self.sidebar.el.parent().hasClass("hidden")) {
					Self.els.toolbar.sidebar
						.prop({ className: "toolbar-tool_" })
						.trigger("click");
				}
				// enable tools & click on show sidebar
				Self.els.toolbar.prev.addClass("tool-disabled_");
				Self.els.toolbar.next.addClass("tool-disabled_");
				Self.els.toolbar.sidebar.addClass("tool-disabled_");
				// show blank view
				Self.els.layout.addClass("show-blank-view");
				break;
			case "setup-workspace":
				// hide blank view
				Self.els.layout.removeClass("show-blank-view");
				// enable tools & click on show sidebar
				// Self.els.toolbar.prev.removeClass("tool-disabled_");
				// Self.els.toolbar.next.removeClass("tool-disabled_");
				Self.els.toolbar.sidebar.removeClass("tool-disabled_");
				break;
			case "parse-file":
				if (event.file.data.slice(0,5).toLowerCase() === "[toc]") {
					// shows sidebar toggler in the toolbar
					window.find(".tool-sidebar-toogle").show();
					// sidebar parse toc
					Self.sidebar.dispatch({
						type: "parse-toc",
						path: event.file.path,
						data: event.file.data,
					});
				} else {
					// hides sidebar toggler in the toolbar
					window.find(".tool-sidebar-toogle").hide();
					// sidebar parse file
					Self.contentView.dispatch({
						type: "parse-markdown",
						data: event.file.data,
						path: event.file.path,
					});
				}
				// show file
				Self.dispatch({ type: "setup-workspace" });
				break;
			// proxy events
			case "sidebar-toggle-view":
				return Self.sidebar.dispatch(event);
			
			default:
				if (event.el) {
					let pEl = event.el.parents(`div[data-area]`);
					if (pEl.length) {
						let name = pEl.data("area");
						Self[name].dispatch(event);
					}
				}
		}
	},
	blankView: @import "modules/blankView.js",
	contentView: @import "modules/contentView.js",
	sidebar: @import "modules/sidebar.js",
};

window.exports = manual;
