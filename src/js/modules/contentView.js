
{
	init() {
		// fast and direct references
		this.el = window.find("content > .markdown-body");
	},
	async dispatch(event) {
		let APP = manual,
			Self = APP.contentView,
			el,
			app,
			file,
			htm,
			text;
		switch (event.type) {
			case "load-markdown-file":
				// load file
				file = await karaqu.shell(`fs -r "${event.path}"`);
				text = file.result.data;
			case "parse-markdown":
				text = text || event.data;
				
				// post-parse file
				app = event.path.startsWith("/app/ant/") ? event.path.match(/\/app\/ant\/(.+?)\//i)[1] : "";
				text = text.replace(/~\//g, `/app/ant/${app}/`);

				// modify links to add target="_blank"
				let renderer = new window.marked.Renderer();
				let linkRenderer = renderer.link;
				renderer.link = (href, title, text) => {
					let html = linkRenderer.call(renderer, href, title, text);
					return html.replace(/^<a /, '<a target="_blank" ');
				};

				// htm = rendermarkdown
				htm = window.marked(text, { renderer });
				this.el.html(htm);
				break;
		}
	}
}
