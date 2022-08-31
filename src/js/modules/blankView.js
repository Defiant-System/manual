
// manual.spawn.blankView

{
	init() {
		
	},
	async dispatch(event) {
		let APP = manual,
			Self = APP.spawn.blankView,
			Spawn = event.spawn,
			el;
		switch (event.type) {
			case "open-filesystem":
				Spawn.dialog.open({
					md: item => APP.spawn.dispatch(item),
				});
				break;
			case "select-sample":
				el = $(event.target);
				if (!el.hasClass("sample")) return;

				APP.spawn.dispatch({
					type: "open-url",
					url: [el.data("url")],
					spawn: Spawn,
				});
				break;
			case "render-blank-view":
				// fast and direct references
				el = Spawn.find("content .blank-view");
				// render blank view
				window.render({
					template: "blank-view",
					match: `//Data`,
					target: el,
				});
				// show blank view
				Spawn.find("layout").addClass("show-blank-view");
				break;
		}
	}
}
