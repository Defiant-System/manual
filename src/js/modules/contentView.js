
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
			app,
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
				
				// post-parse file
				app = event.path.startsWith("/app/ant/") ? event.path.match(/\/app\/ant\/(.+?)\//i)[1] : "";
				text = text.replace(/~\//g, `/app/ant/${app}/`);

				htm = window.marked(text);
				this.el.html(htm);
				break;
		}
	}
};

export default contentView;
