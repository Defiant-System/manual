
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
			value,
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
			case "history-go":
				if (event.arg === "-1") Spawn.data.history.goBack();
				else Spawn.data.history.goForward();
				// put rendered text into view
				Self.el.html(Spawn.data.history.current.htm);
				// update toolbar tools
				Self.dispatch({ ...event, type: "update-toolbar" });
				break;
			case "update-toolbar":
				// update toolbar buttons
				value = Spawn.data.history.canGoBack;
				Spawn.find(`.toolbar-tool_[data-click="history-go"][data-arg="-1"]`).toggleClass("tool-disabled_", value);

				value = Spawn.data.history.canGoForward;
				Spawn.find(`.toolbar-tool_[data-click="history-go"][data-arg="1"]`).toggleClass("tool-disabled_", value);

				value = Spawn.data.hasToc;
				Spawn.find(`.toolbar-tool_[data-click="sidebar-toggle-view"]`).toggleClass("tool-disabled_", value);
				break;
			case "load-markdown-file":
				// load file
				karaqu.shell(`fs -o '${event.path}' null`)
					.then(async exec => {
						let fHandle = exec.result,
							file = await fHandle.open({ responseType: "text" });
						Self.dispatch({ type: "parse-file", spawn: Spawn, file });
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
				// add entry to history
				Spawn.data.history.push({ path, htm });
				// update toolbar tools
				Self.dispatch({ ...event, type: "update-toolbar" });
				break;
		}
	}
}
