var ListaAtividadesView = Backbone.View.extend({
	
	initialize: function () {
		this.listenTo(this.collection, "add", this.addItemAtividadeView);
		this.listenTo(this.collection, "remove", this.removeItemAtividadeView);
		this.render();
	},
	
	render: function () {
		this.collection.each(this.addItemAtividadeView, this);
    	return this;
	},
	
	// called by listener when a model is added to collection
	addItemAtividadeView: function (model) {
		model.set({
			button_adicionar: this.options.showAddButton, 
			button_remover: this.options.showRemoveButton
		});
		var className = this.options.showRemoveButton ? 'listaAtividadesSelecionadasLi' : 'listaAtividadesLi';
		var itemAtividadeView = new ItemAtividadeView({
			id: model.get('id'),
			tagName: 'li',
			className: className,
			model: model,
			attributes: {
				'data-id': model.get('id')
			}
		});
		this.$el.append(itemAtividadeView.el);
		var strSelector = '#' + this.id + ' li[data-id="' + model.get('id') + '"]';
		//$(strSelector).css('display', 'none');
		//$(strSelector).fadeIn();
	},
	
	// called by listener when a model is removed from collection
	removeItemAtividadeView: function (model) {
		var strSelector = '#' + this.id + ' li[data-id="' + model.get('id') + '"]';
		$(strSelector).remove();
		/*
		$(strSelector).fadeOut('fast', function() {
			$(strSelector).remove();
		});*/
	}
});