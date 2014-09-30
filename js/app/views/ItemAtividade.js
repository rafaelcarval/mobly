var ItemAtividadeView = Backbone.View.extend({
	initialize: function () {
		this.template = templateManager.views.ItemAtividade;
		this.render();
	},
	
	render: function() {
		var strHtml = Mustache.to_html( this.template, this.model.toJSON() );
    	this.$el.html( strHtml );
    	
    	return this;
	}
});