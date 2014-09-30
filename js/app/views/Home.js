var HomeView = Backbone.View.extend({
	booIsEditing: false,
	novaProvaPropertiesView: false,
	
	
	initialize: function () {
		this.template = templateManager.views.Home;
		this.collection.fetch({success: _.bind(this.render, this)});
    },
    

    render: function () {
    	var strHtml = Mustache.to_html( this.template );
    	this.$el.html( strHtml );
		
		// force sorting, because we may update a model of this collection on 
		// another view (Prova View)
		this.collection.sort();
    	this.collection.each( function (model) {
    		var itemProvaView = new ItemProvaView({
    			tagName: 'li',
    			className: 'listaProvasLi',
    			id: 'itemProva'+model.get('id'),
    			model: model
    		});
    		$('#listaProvasUl').append( itemProvaView.el );
    	});
		
		// get button width to use on button show/hide transition
		this.intButtonRemoverContainerWidth = parseInt( $('.buttonRemoverProvaContainer').css('width') );
		$('.buttonRemoverProvaContainer').css('width', 0);
		
		//Inform our parent that our size has changed
		//This only works for same domain, look out for CORS issues
		parent.resizeIframe();
		
        return this;
    },
    
    
    events: {
    	// mouse over effects on each prova item
    	'mouseenter .listaProvasLi': 'handleItemProvaMouseEnter',
    	'mouseleave .listaProvasLi': 'handleItemProvaMouseLeave',
    	// button that oppens modal window with new prova properties
    	'click #buttonNovaProva': 'handleClickButtonNovaProva',
    	// button that deletes that prova item
    	'click .buttonRemoverProva': 'handleClickButtonRemoverProva',
    	// button that creates new prova item to collection 'this.collection'
    	'click #buttonCriarNovaProva': 'handleClickButtonCriarNovaProva',
    	'click #buttonFecharNovaProva': 'handleClickButtonFecharNovaProva'
    },
    
    // Rollover effect on each prova item
    handleItemProvaMouseEnter: function (e) {
    	$item = $(e.currentTarget);
    	$('h3', $item).addClass('textLightBlue');
    },
    
    // Rollout effect on each prova item
	handleItemProvaMouseLeave: function (e) {
    	$item = $(e.currentTarget);
    	$('h3', $item).removeClass('textLightBlue');
    },
    
    
    // Opens modal window with new prova "wizard"
	handleClickButtonNovaProva: function (e) {
		$('#modalNovaProvaContent').empty();
		var model = new ProvaModel({}, {collection:this.collection});
		this.novaProvaPropertiesView = new ProvaPropertiesView({
			model: model,
			el: '#modalNovaProvaContent'
		});
		$('#modalNovaProva').modal('show');
		var parentScreenTop = $(window.parent.window).scrollTop();
		$('#modalNovaProva').css('top', parentScreenTop);
		
		//Inform our parent that our size has changed
		//This only works for same domain, look out for CORS issues
		parent.resizeIframe();
	},
	
	
	handleClickButtonCriarNovaProva: function(e) {
		_debug('handleClickButtonCriarNovaProva');
		var me = this;
		this.novaProvaPropertiesView.model.save( this.novaProvaPropertiesView.formToJson(), {
			success: function(model, response, options) {
				_debug('new prova saved');
				me.novaProvaPropertiesView.destroy();
				app.navigate( 'provas/'+model.get('id'), {trigger: true});
			}
		});
	},
	
	
	handleClickButtonFecharNovaProva: function(e) {
		this.novaProvaPropertiesView.destroy();
	},
    
    handleClickButtonRemoverProva: function(e) {
    	_debug('handleClickButtonRemoverProva');
    	$button = $(e.currentTarget);
    	var modelId = $button.attr('data-id');
    	var model = this.collection.get(modelId);
    	if (model) {
    		var me = this;
    		model.destroy({
    			wait: true,
    			success: function(model, response, options) {
    				var strItemSelector = '#itemProva' + modelId;
			    	$(strItemSelector).fadeOut('fast');
    			}, 
    			error: function(model, xhr, options) {
    				_debug('error', model, xhr, options);
    			}
    		});
    	}
    }
    
});