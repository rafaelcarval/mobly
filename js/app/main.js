var baseUrl = 'index.php';
var app;

$(document).ready(function() {
	// load all templates (on tpl folder)
	templateManager.loadAll( function() {
		// start app
		app = new AppRouter();
		Backbone.history.start();
	});
});
