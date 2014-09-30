var AtividadesCollection = Backbone.QueryCollection.extend({
    model: AtividadeModel,
    url: function() {
    	return baseUrl+'/atividades';
    }
});
