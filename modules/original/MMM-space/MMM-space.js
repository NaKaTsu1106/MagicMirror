/* MagicMirror²
 * Module: HelloWorld
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 */
Module.register("MMM-space", {
	// Default module config.
	defaults: {
		text: "　"
	},

	getTemplate: function () {
		return "MMM-space.njk";
	},

	getTemplateData: function () {
		return this.config;
	}
});
