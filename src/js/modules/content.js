
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
				// Self.el = false;
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
					if (href.startsWith("$")) {
						let [app, pipe] = href.slice(1).split("|");
						let cmd = app.includes("-") ? app.replace(/\\/g, " ") : `win -o ${app}`;
						pipe = pipe ? `data-pipe="${pipe.replace(/"/g, "'")}"` : "";
						html = `<span data-click="karaqu-shell" data-arg="${cmd}" ${pipe}>${text}</span>`;
					} else {
						html = html.replace(/^<a /, '<a target="_blank" ');
					}				
					return html;
				};

				// htm = rendermarkdown
				htm = window.marked(text, { renderer });
				Self.el.html(htm);
				// add entry to history
				Spawn.data.history.push({ path, htm });
				// update toolbar tools
				Self.dispatch({ ...event, type: "update-toolbar" });
				break;

			case "karaqu-shell":
				// already playing, stop it
				if (APP.player) APP.player?.stop();
				// prepare to play
				el = $(event.target);
				value = el.data("arg");
				text = (el.data("pipe") || "").replace(/'/g, '"');
				let cmd = await karaqu.shell(`${value} ${text}`);

				if (cmd.result && cmd.result.stop) {
					// possible command returned music player - save reference for "window.close"
					APP.player = cmd.result;
					// insert a stop button
					event.el.after(`<i> - <span data-click="stop-player">Stop</span></i>`);
				}
				break;
			case "stop-player":
				// try to stop it
				APP.player?.stop();
				// remove stop button
				event.el.parent().remove();
				break;
		}
	}
}
