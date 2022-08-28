
{
	init() {
		
	},
	async dispatch(event) {
		let APP = manual,
			Self = APP.spawn.sidebar,
			Spawn = event.spawn,
			isOn;
		switch (event.type) {
			// system events
			case "spawn.blur":
				Self.el = false;
				break;
			case "spawn.focus":
				Self.el = Spawn.find("sidebar > div");
				break;
				
			// custom events
			case "parse-toc":
				break;
		}
	}
}
