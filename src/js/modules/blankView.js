
let blankView = {
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
		let Self = blankView,
			el;
		switch (event.type) {
			case "parse-toc":
				break;
		}
	}
};

export default blankView;
