var AtividadeModel = Backbone.Model.extend({
	defaults: {
		has_resolucao: function() {
	     return (this.resolucao.length > 0);
	   },
		has_fonte_ano: function() {
	     return (this.fonte_ano.length > 0);
	   },
	   	has_topicos: function() {
	     return (this.topicos.length > 0);
	   },
	   	dificuldade_translate: function(){
			var lookup_dificuldade = {
				'0':'Não classificada', 
				'1':'Fácil', 
				'2':'Média', 
				'3':'Difícil'
			}
	     return lookup_dificuldade[this.dificuldade];
	   }
	},
	
	initialize: function() {
		// add last update date based on timestamp
		var strLastUpdate = this._timestampToDateString( this.get('last_update')*1000 );
		
		// plain text version of html text
		//var strEnunciado = $('<div />').html( this.get('enunciado_html') ).text();
		//var strResposta = $('<div />').html( this.get('resposta_html') ).text();
		
		this.set({
			'last_update_date': strLastUpdate
			//'enunciado': strEnunciado,
			//'resposta': strResposta,
		}, {silent:true});
	},
	
	_timestampToDateString: function (intTimestamp) {
		var date = new Date(intTimestamp);
		var day = date.getUTCDate();
		var month = date.getUTCMonth()+1;
		var year = date.getUTCFullYear();
		day = (day<10) ? '0' + day : day;
		month = (month<10) ? '0' + month : month;
		return day + '/' + month + '/' + year;
	}
});