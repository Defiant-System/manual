
// manual.blankView

{
	init() {
		// fast and direct references
		this.el = window.find("content .blank-view");
		// render blank view
		window.render({
			template: "blank-view",
			match: `//Data`,
			target: this.el,
		});
	},
	async dispatch(event) {
		let APP = manual,
			Self = APP.blankView,
			el;
		switch (event.type) {
			case "open-filesystem":
				APP.dispatch({ type: "open-file" });
				break;
			case "select-sample":
				el = $(event.target);
				if (!el.hasClass("sample")) return;

				let url = el.data("url"),
					parts = url.slice(url.lastIndexOf("/") + 1),
					[ name, kind ] = parts.split("."),
					file = new defiant.File({ name, kind });
				// fetch file
				window.fetch(url, { responseType: "text" })
					// forward event to app
					.then(file => APP.dispatch({ type: "parse-file", file }));
				break;
		}
	}
}
