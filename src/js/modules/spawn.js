
// manual.spawn

{
	init() {
		// references
		this.data = {};
	},
	dispatch(event) {
		let APP = manual,
			Self = APP.spawn,
			Spawn = event.spawn,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "spawn.open":
				Spawn.data.history = new window.History;

				// DEV-ONLY-START
				Test.init(APP, Spawn);
				// DEV-ONLY-END
				break;
			case "spawn.init":
				break;
			case "spawn.blur":
			case "spawn.focus":
				// forward event to all sub-objects
				Object.keys(Self)
					.filter(i => typeof Self[i].dispatch === "function")
					.map(i => Self[i].dispatch(event));
				break;
			case "open.file":
				// proxy event if URL is to be opened
				if (event.url) return Self.dispatch({ ...event, type: "open-url" });

				(event.files || [event]).map(async fHandle => {
					let file = await fHandle.open({ responseType: "text" });

					if (file.path.startsWith("/app/")) {
						let [a, ns, app] = file.path.match(/\/app\/(\w+)\/(\w+)/i);
						// save reference to app
						APP.spawn.data.ns = ns;
						APP.spawn.data.app = app;
						// spawn origins
						APP.spawns[`${ns}:${app}`] = Spawn;
						Spawn.data.file = file;
					}
					Self.dispatch({ ...event, type: "file-parse", file });
				});
				break;
			case "open-url":
				event.url.map(async path => {
					let data = await window.fetch(path),
						file = { path, data };
					Self.dispatch({ ...event, type: "file-parse", file });
				});
				break;
			case "file-parse":
				// Reset app
				Spawn.find("layout").removeClass("show-blank-view");
				Spawn.find(".blank-view").remove();

				if (event.file.data.slice(0,5).toLowerCase() === "[toc]") {
					Self.sidebar.dispatch({ type: "parse-toc", spawn: Spawn, file: event.file });
				} else {
					Self.content.dispatch({ type: "parse-file", spawn: Spawn, file: event.file });
				}
				break;

			// proxy events
			case "history-go":
				return Self.content.dispatch(event);
				break;
			case "sidebar-toggle-view":
				return Self.sidebar.dispatch(event);
			
			default:
				if (event.el) {
					let pEl = event.el.parents(`[data-area]`);
					if (pEl.length) {
						let name = pEl.data("area");
						Self[name].dispatch(event);
					}
				}
		}
	},
	blankView: @import "./blankView.js",
	sidebar: @import "./sidebar.js",
	content: @import "./content.js",
}
