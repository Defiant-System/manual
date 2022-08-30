
// manual.spawn

{
	init() {

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
				(event.files || [event]).map(async fHandle => {
					let file = await fHandle.open({ responseType: "text" });
					if (file.data.slice(0,5).toLowerCase() === "[toc]") {
						Self.sidebar.dispatch({ type: "parse-toc", spawn: Spawn, file });
					} else {
						Self.content.dispatch({ type: "parse-file", spawn: Spawn, file });
					}
				});
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
	sidebar: @import "./sidebar.js",
	content: @import "./content.js",
}
