var ProvasCollection = Backbone.QueryCollection.extend({
    model: ProvaModel,
    url: function() {
    	return baseUrl+'/provas';
    },
    comparator: function(model) {
		// To sort models by last_update (timestamp) desc
		var intLastUpdate = parseInt(model.get('last_update'), 10);
		return -intLastUpdate;
	}
});
