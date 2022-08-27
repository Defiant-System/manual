
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
			case "spawn.blur":
			case "spawn.focus":
				break;
			case "open.file":
				(event.files || [event]).map(async fHandle => {
					let file = await fHandle.open({ responseType: "text" });
					console.log(file);
				});
				break;
		}
	}
}
