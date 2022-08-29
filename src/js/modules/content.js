
{
	init() {
		
	},
	async dispatch(event) {
		let APP = manual,
			Self = APP.spawn.content,
			Spawn = event.spawn,
			path,
			file,
			htm,
			text,
			el;
		switch (event.type) {
			// system events
			case "spawn.blur":
				Self.el = false;
				break;
			case "spawn.focus":
				Self.el = Spawn.find("content > .markdown-body");
				break;
				
			// custom events
			case "load-markdown-file":
				// load file
				karaqu.shell(`fs -o '${event.path}' null`)
					.then(async exec => {
						let fHandle = exec.result,
							file = await fHandle.open({ responseType: "text" });
						Self.dispatch({ type: "parse-file", file });
					});
				break;
			case "parse-file":
				file = event.file;
				
				// post-parse file
				path = file.path.startsWith("/app/ant/") ? file.path.match(/\/app\/ant\/(.+?)\//i)[1] : "";
				text = file.data.replace(/~\//g, `/app/ant/${path}/`);

				// modify links to add target="_blank"
				let renderer = new window.marked.Renderer();
				let linkRenderer = renderer.link;
				renderer.link = (href, title, text) => {
					let html = linkRenderer.call(renderer, href, title, text);
					return html.replace(/^<a /, '<a target="_blank" ');
				};

				// htm = rendermarkdown
				htm = window.marked(text, { renderer });
				Self.el.html(htm);
				break;
		}
	}
}
