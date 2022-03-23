
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
		}
	}
}
