
let manual;
let sidebar;

let contentView = {
	init(_manual, _sidebar) {
		// fast and direct references
		manual = _manual;
		sidebar = _sidebar;

		this.el = window.find("content > .markdown-body");
	},
	async dispatch(event) {
		let el,
			file,
			isOn,
			htm,
			text;
		switch (event.type) {
			case "load-markdown-file":
				// load file
				file = await defiant.shell(`fs -r "${event.path}"`);
				text = file.result.text;
			case "parse-markdown":
				text = text || event.text;
				htm = window.marked(text);
				this.el.html(htm);
				break;
			case "content-toggle-lights":
				el = window.find("layout");
				isOn = el.hasClass("inverted");
				el.toggleClass("inverted", isOn);
				return isOn;
		}
	}
};

export default contentView;
