
/*

TODO:
 - Fix TOC
 - Toggle sidebar button, if TOC exists

*/

@import "./modules/marked.min.js";


const manual = {
	init() {
		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init());
	},
	dispatch(event) {
		let Self = manual,
			spawn,
			el;
		// console.log(event);
		// proxy spawn events
		if (event.spawn) return Self.spawn.dispatch(event);

		switch (event.type) {
			// system events
			case "window.init":
				spawn = window.open("spawn");
				Self.spawn.dispatch({ ...event, type: "spawn.init", spawn });
				break;
			case "open.file":
				spawn = window.open("spawn");
				Self.spawn.dispatch({ ...event, spawn });
				break;
		}
	},
	spawn: @import "./modules/spawn.js",
};

window.exports = manual;
