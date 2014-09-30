var templateManager = {
	
	/*
	 * List of available views
	 * Each view should be added to "tpl" folder with name convention <ViewName>.html
	 */ 
	views: {
		'Home': null,
		'ItemProva': null,
		'Prova': null,
		'ListaAtividades': null,
		'ItemAtividade': null,
		'ProvaProperties': null,
		'ProvaVerAtividade': null,
		'ProvaVisualizar': null,
		'ProvaImprimir': null
	},
	
	
	/*
	 * Load all templates from tpl folder listed on "views" attribute
	 */
	loadAll: function( fncCallback ) {
		var arrDeferreds = [];

		$.each(this.views, function(strViewName) {
		    arrDeferreds.push($.get('tpl/' + strViewName + '.html', function(data) {
		            templateManager.views[strViewName] = data;
			}));
		});

		$.when.apply(null, arrDeferreds).done( fncCallback );
	}
	
};
