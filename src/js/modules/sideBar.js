
{
	init() {
		// fast and direct references
		this.el = window.find("sidebar > div");
	},
	async dispatch(event) {
		let APP = manual,
			Self = APP.sidebar,
			el,
			pEl,
			isOn;
		switch (event.type) {
			case "parse-toc":
				let nodes = [];
				let indent;

				// parse markdown toc into XML structure
				event.data.slice(6).split("\n")
					.map((line, index) => {
						if (!line.trim()) return;

						let parts = line.match(/(.+)\[(.+?)\]\((.+?)\)/i);
						let lineIndent;
						if (parts) {
							nodes.push(`<item name="${parts[2]}" path="${event.path}${parts[3]}"/>`);
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
					target: this.el
				});

				// auto-click the file document
				this.el.find("[data-path]:first").trigger("click");
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
				this.el.find(".active").removeClass("active");

				if (el.length) {
					pEl = el.parent();
					pEl.toggleClass("active", pEl.hasClass("active"));

					// show file in contentView
					contentView.dispatch({
						type: "load-markdown-file",
						path: pEl.attr("data-path"),
					});
					return;
				}

				el = $(event.target).parents("li:first");
				if (el.length) {
					el.addClass("active")

					// show file in contentView
					contentView.dispatch({
						type: "load-markdown-file",
						path: el.attr("data-path"),
					});
				}
				break;
		}
	}
}
