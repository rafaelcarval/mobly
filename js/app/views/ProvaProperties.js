var ProvaPropertiesView = Backbone.View.extend({
	
	initialize: function () {
		this.template = templateManager.views.ProvaProperties;
		this.render();
	},
	
	render: function() {
		var strHtml = Mustache.to_html( this.template, this.model.toJSON() );
    	this.$el.html( strHtml );
    	
    	this.initDisciplinaSelectList();
    	this.initNivelSelectList();
    	this.initDificuldadeSelectList();
    	this.handleChangeDisciplinaSelectList();
    	this.handleChangeNivelSelectList();
    	this.handleChangeTituloInput();
    	
    	// bootstrap tooltips
    	$('#inputTitulo', this.$el).tooltip();
    	$('#inputDescricao', this.$el).tooltip();
    	
    	return this;
	},
	
	
	events: {
		'change #selectDisciplina': 'handleChangeDisciplinaSelectList',
		'change #selectNivel': 'handleChangeNivelSelectList',
		'change #inputTitulo': 'handleChangeTituloInput',
		'change #inputDescricao': 'handleChangeDescricaoInput',
	},
	
	 
	initDisciplinaSelectList: function() {
		var me = this;
		$.each( this.model.arrDisciplinas, function(key, value) {   
			$('#selectDisciplina', me.$el)
				.append( 
					$("<option></option>")
					.attr('value', value)
					.text(value)
				);
		});
		$('#selectDisciplina', this.$el).val( this.model.get('disciplina') );
	},
	
	
	handleChangeDisciplinaSelectList: function(e) {
		var strDisciplina = $('#selectDisciplina', this.$el).val();
	},
	
	
	initNivelSelectList: function() {
		var me = this;
		$.each( this.model.objNiveis, function(key, value) {   
			$('#selectNivel', me.$el)
				.append( 
					$("<option></option>")
					.attr('value', key)
					.text(value.nome)
				);
		});
		$('#selectNivel', this.$el).val( this.model.get('nivel') );
	},
	
	
	handleChangeNivelSelectList: function() {
		var strNivel = $('#selectNivel', this.$el).val();
		
		// init Ano select list
		var objAnos = this.model.objNiveis[strNivel].anos;
		$('#selectAno', this.$el).empty();
		var me = this;
		$.each( objAnos, function(key, value) {
			$('#selectAno', me.$el)
				.append(
					$("<option></option>")
					.attr('value', value)
					.text(key)
				);
		});
		//Select 'Todos' by default
		$('#selectAno', this.$el).val(0);
	},
	
	
	initDificuldadeSelectList: function() {
		var me = this;
		$('input:radio[name=radioDificuldade]:nth('+this.model.get('dificuldade')+')').prop("checked", true); 
	},
	
	
	handleChangeTituloInput: function(e) {
		var strTitulo = $('#inputTitulo', this.$el).val();
		strTitulo = $.trim(strTitulo);
		$('#inputTitulo', this.$el).val(strTitulo);
		if (strTitulo.length==0) {
			strTitulo = this.model.defaults.titulo;
			$('#inputTitulo', this.$el).val(strTitulo);
		}
	},
	
	
	handleChangeDescricaoInput: function(e) {
		var strDescricao = $('#inputDescricao', this.$el).val();
		strDescricao = $.trim(strDescricao);
		$('#inputDescricao', this.$el).val(strDescricao);
	},
	
	
	formToJson: function () {
		return {
			disciplina: $('#selectDisciplina', this.$el).val(),
			titulo: $('#inputTitulo', this.$el).val(),
			descricao: $('#inputDescricao', this.$el).val(),
			nivel: $('#selectNivel', this.$el).val(), 
			ano: $('#selectAno', this.$el).val(),
			dificuldade: $('input[name=radioDificuldade]:checked').val()
		}
	},
	
	destroy: function () {
		_debug('destroy prova properties view');
		this.stopListening();
	}
	
});