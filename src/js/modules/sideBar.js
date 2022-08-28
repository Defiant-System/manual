
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
				setTimeout(() => Spawn.find(`.toolbar-tool_[data-click="sidebar-toggle-view"]`).trigger("click"), 300);
				break;
				
			// custom events
			case "parse-toc":
				let nodes = [];
				let indent;

				// parse markdown toc into XML structure
				event.file.data.slice(6).split("\n")
					.map((line, index) => {
						if (!line.trim()) return;

						let parts = line.match(/(.+)\[(.+?)\]\((.+?)\)/i);
						let lineIndent;
						if (parts) {
							nodes.push(`<item name="${parts[2]}" path="${event.file.path}/${parts[3]}"/>`);
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

				window.render({
					data,
					template: "sideBar",
					match: `//data`,
					target: Self.el
				});

				// auto-click the file document
				Self.el.find("[data-path]:first legend").trigger("click");
				break;
			case "sidebar-toggle-view":
				pEl = Self.el.parents("sidebar");
				isOn = pEl.hasClass("hidden");
				pEl.toggleClass("hidden", isOn);
				return isOn;
			case "sidebar-select-article":
				el = $(event.target).parents("legend:first");
				
				if (el.length && el.find(".arrow").length) {
					pEl = el.parent();
					pEl.toggleClass("expanded", pEl.hasClass("expanded"));
					return;
				}

				// turn off previous active
				Self.el.find(".active").removeClass("active");

				el = $(event.target).parents("li:first");
				if (el.length) {
					el.addClass("active")

					// show file in contentView
					console.log({
						type: "load-markdown-file",
						path: el.attr("data-path"),
					});
				}
				break;
		}
	}
}
