

@import "./modules/marked.min.js";
@import "./modules/test.js";


const manual = {
	init() {
		this.spawns = {};
		// listen to system event
		window.on("sys:window.closed", this.dispatch);
		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init());
	},
	dispatch(event) {
		let Self = manual,
			spawn,
			el;
		// proxy spawn events
		if (event.spawn) return Self.spawn.dispatch(event);

		// console.log(event);
		switch (event.type) {
			// system events
			case "window.close":
				if (Self.player?.stop) Self.player.stop();
				break;
			case "window.closed":
				if (Self.spawns[event.detail]) {
					Self.spawns[event.detail].close();
				}
				break;
			case "window.init":
				// fallback on system docs (!?)
				spawn = window.open("spawn");
				Self.spawn.blankView.dispatch({ type: "render-blank-view", spawn });
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
