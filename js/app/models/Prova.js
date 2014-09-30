var ProvaModel = Backbone.Model.extend({
	defaults: {
		titulo: 'Nova atividade',
		last_update: Math.floor( new Date() / 1000 ), // now timestamp (seconds)
		descricao: '',
		nivel: 'Todos', // Não especificado
		ano: 0, // Todos
		dificuldade: 0, // Todos
		atividades: [], // lista de ids das atividades
		atividadesModels: [], // lista com os models, correspondentes aos ids da lista atividades
		disciplina_abbrev: function(){
			var lookup_abbrev = {
				'Geografia':'GEO', 
				'História':'HIS', 
				'Matemática':'MAT', 
				'Ciências':'CIE', 
				'Língua Portuguesa':'LPT', 
				'Inglês':'ING', 
				'Espanhol':'ESP', 
				'Química':'QUI', 
				'Física':'FIS', 
				'Biologia':'BIO', 
				'Filosofia':'FIL', 
				'Sociologia':'SOC'
			}
	     return lookup_abbrev[this.disciplina];
	   },
	   dificuldade_calc: function(){
	   		if (this.atividadesModels.length == 0) {
		   		return false;
	   		}
	   		var diff_sum = _.reduce(this.atividadesModels, function(memo, amodel){ 
	   			var adif = parseFloat(amodel.dificuldade);
	   			if (adif == 0) {
	   				//Unclassified are counted as Medium
		   			adif = 2.0;
	   			}
	   			return memo + adif; 
	   		}, 0);
	   		return Math.round( diff_sum / (this.atividadesModels.length));
	   }
	},
	
	initialize: function() {
		// add last update date based on timestamp
		var strLastUpdate = this._timestampToDateString( this.get('last_update')*1000 );
		var strFormDownloadUrl = baseUrl + '/provas/' + this.get('id') + '/download';
		var strFormSendToEmailUrl = baseUrl + '/provas/' + this.get('id') + '/email';
		
		// get disciplinas and niveis from global ftdGasp_User array
		this.arrDisciplinas = ftdGasp_User.disciplinas;
		for (var i in ftdGasp_User.niveis){
			this.objNiveis[ftdGasp_User.niveis[i]] = this.objNiveisTpl[ftdGasp_User.niveis[i]];
		}
		
		this.set({
			'last_update_date': strLastUpdate,
			'form_download_url': strFormDownloadUrl,
			'form_send_to_email_url': strFormSendToEmailUrl,
		}, {silent:true} );
	},
	
	_timestampToDateString: function (intTimestamp) {
		var date = new Date(intTimestamp);
		var day = date.getUTCDate();
		var month = date.getUTCMonth()+1;
		var year = date.getUTCFullYear();
		day = (day<10) ? '0' + day : day;
		month = (month<10) ? '0' + month : month;
		return day + '/' + month + '/' + year;
	},

	// available disciplinas
	arrDisciplinas: [
		//Will be populated by initialize function
	],
	
	objNiveis: {
		//Will be populated by initialize function
	},
	
	objNiveisTpl: {
		//TODO: modify to only apply to segments indicated in ftdGasp_User.niveis
		/*'Todos': {
			'nome': 'Todos',
			'anos': {
				'Todos': 0, 
			}
		},*/
		'F1': {
			'nome': 'Fundamental I',
			'anos': {
				'Todos': 0,
				1: 1,
				2: 2,
				3: 3,
				4: 4,
				5: 5
			}
		},
		'F2': {
			'nome': 'Fundamental II',
			'anos': {
				'Todos': 0,
				6: 6,
				7: 7,
				8: 8,
				9: 9
			}
		},
		'EM': {
			'nome': 'Ensino médio',
			'anos': {
				'Todos': 0,
				1: 1,
				2: 2,
				3: 3
			}
		}
	},
	
	
	objDificuldades: {
		0: 'Todas',
		1: 'Fácil',
		2: 'Média',
		3: 'Difícil'
	}

});