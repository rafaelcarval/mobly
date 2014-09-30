var ItemProvaView = Backbone.View.extend({
	initialize: function () {
		this.booCanClick = true;
		this.template = templateManager.views.ItemProva;
		this.listenTo(this.model, "change", this.render);
		this.render();
	},
	
	events: {
		'click': 'handleClick',
		'mouseenter .buttonRemoverProva': 'handleMouseEnterButtonRemoverProva',
		'mouseleave .buttonRemoverProva': 'handleMouseLeaveButtonRemoverProva',
	},
	
	render: function() {
		var objModelData = this.model.toJSON();
		// format unix timestamp to date (dd/mm/yyyy). Also, unix timestamp in js is in milliseconds
		var date = new Date( objModelData.last_update*1000 );
		var day = date.getUTCDate();
		var month = date.getUTCMonth()+1;
		var year = date.getUTCFullYear();
		day = (day<10) ? '0'+day : day;
		month = (month<10) ? '0'+month : month;
		objModelData.last_update = day + '/' + month + '/' + year;
		var strHtml = Mustache.to_html( this.template, objModelData );
    	this.$el.html( strHtml );
    	return this;
	},
	
	handleClick: function() {
		if (this.booCanClick) {
			var strRoute = 'provas/' + this.model.get('id');
			app.navigate( strRoute, {trigger: true});
		}
		
	},
	
	// to prevent opening prova when cursor is over button "remover" (action handled on Home view)
	handleMouseEnterButtonRemoverProva: function(e) {
		this.booCanClick = false;
	},
	
	handleMouseLeaveButtonRemoverProva: function(e) {
		this.booCanClick = true;
	}
	
});