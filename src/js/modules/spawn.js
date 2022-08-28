
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
					console.log( file );
					if (file.data.slice(0,5).toLowerCase() === "[toc]") {
						Self.sidebar.dispatch({ type: "parse-toc", file });
					} else {
						Self.content.dispatch({ type: "parse-file", file });
					}
				});
				break;
		}
	},
	sidebar: @import "./sidebar.js",
	content: @import "./content.js",
}
