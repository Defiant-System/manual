
{
	init() {

	},
	async dispatch(event) {
		let APP = manual,
			Self = APP.spawn.sidebar,
			Spawn = event.spawn,
			isOn,
			pEl,
			el;
		switch (event.type) {
			// system events
			case "spawn.blur":
				Self.el = false;
				break;
			case "spawn.focus":
				Self.el = Spawn.find("sidebar > div");

				// temp
				setTimeout(() => {
					let el = Spawn.find(`.toolbar-tool_[data-click="sidebar-toggle-view"]`);
					if (!el.hasClass("tool-active_")) el.trigger("click");
				}, 400);
				break;
				
			// custom events
			case "parse-toc":
				let nodes = [];
				let indent;

				if (!event.file.dir) {
					let dir = event.file.path.split("/");
					dir[dir.length-1] = "";
					event.file.dir = dir.join("/");
				}
				// parse markdown toc into XML structure
				event.file.data.slice(6).split("\n")
					.map((line, index) => {
						if (!line.trim()) return;
						let parts = line.match(/(.+)\[(.+?)\]\((.+?)\)/i),
							dir = event.file.dir,
							lineIndent;
						if (parts) {
							nodes.push(`<item name="${parts[2]}" path="${dir}${parts[3]}"/>`);
							if (index !== 0) lineIndent = parts[1];
						} else {
							parts = line.match(/(.+?\b)(.+?)$/i);
							if (lineIndent !== indent) nodes.push(`</item>`);
							nodes.push(`<item name="${parts[2]}">`);
						}
						indent = lineIndent;
					});
				nodes.push(`</item>`);

				let data = $.xmlFromString(`<data>${nodes.join("")}</data>`);
				// return console.log( data.documentElement );

				window.render({
					data,
					template: "sideBar",
					match: `//data`,
					target: Self.el
				});

				// property to enable toolbar sidebar toggle-button
				Spawn.data.hasToc = true;
				// auto-click the file document
				Self.el.find("[data-path]:nth(0) legend").trigger("click");
				// temp
				Self.el.find(".icon-arrow-right:nth(0)").trigger("click");
				break;
			case "sidebar-toggle-view":
				pEl = Self.el.parents("sidebar");
				isOn = pEl.hasClass("hidden");
				pEl.toggleClass("hidden", isOn);
				return isOn;
			case "sidebar-select-article":
				el = $(event.target);
				el = el.prop("nodeName") === "LI" ? el : el.parents("li:first");
				// handles arrow icon
				if (el.find("> legend .icon-arrow-right").length) {
					return el.toggleClass("expanded", el.hasClass("expanded"));
				}
				// handles node matching a file
				if (el.length && el.data("path")) {
					// reset active element
					Self.el.find(".active").removeClass("active");
					// make current active
					el.addClass("active")
					// show file in contentView
					APP.spawn.content.dispatch({
						type: "load-markdown-file",
						path: el.attr("data-path"),
						spawn: Spawn,
					});
				}
				break;
		}
	}
}
