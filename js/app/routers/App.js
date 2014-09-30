var AppRouter = Backbone.Router.extend({
	homeView: null,
	provaView: null,
	
	routes: {
		'': 'goToHome',
		'provas/:id': 'goToProva'
	},
    
    
    goToHome: function() {
    	_debug('goToHome');
    	this.destroyViews();
    	this.homeView = new HomeView({
    		className: 'container appcontainer',
    		collection: new ProvasCollection()
    	});
    	$('body').append( this.homeView.el );
    },
	
	
    goToProva: function(provaId) {
    	_debug('goToProva');
    	this.destroyViews();
    	this.provaView =  new ProvaView({
    		className: 'container appcontainer',
    		provaId: provaId, // custom option, available as "this.options.provaId" no prova view
    		collection: new ProvasCollection()
    	});
    	$('body').append( this.provaView.el );
    },
    
    
    destroyViews: function() {
    	if (this.homeView) {
    		this.homeView.remove();
    		this.homeView = null;
    	}
    	if (this.provaView) {
    		this.provaView.remove();
    		this.provaView = null;
    	}
    }
});
