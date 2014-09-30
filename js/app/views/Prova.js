var ProvaView = Backbone.View.extend({
	// collections
	atividadesCollection: null,
	atividadesFiltradasCollection: null,
	atividadesSelecionadasCollection: null,
	
	// views
	atividadesFiltradasView: null,
	atividadesSelecionadasView: null,
	propertiesView: null,
	visualizarProvaView: null,
	
	// lista com os ids das atividades selecionadas atualmente
	arrAtividadesIdList: [],
	arrFilters: [],
	
	booLoadingProva: false,
	
	
	objAtividades: {
		'Biologia': {
			file: 'http://s3-sa-east-1.amazonaws.com/ftd-gestor/data/biologia.json',
			arrData: null
		},
		'Ciências': {
			file: 'http://s3-sa-east-1.amazonaws.com/ftd-gestor/data/ciencias.json',
			arrData: null
		},
		'Espanhol': {
			file: 'http://s3-sa-east-1.amazonaws.com/ftd-gestor/data/espanhol.json',
			arrData: null
		},
		'Filosofia': {
			file: 'http://s3-sa-east-1.amazonaws.com/ftd-gestor/data/filosofia.json',
			arrData: null
		},
		'Física': {
			file: 'http://s3-sa-east-1.amazonaws.com/ftd-gestor/data/fisica.json',
			arrData: null
		},
		'Geografia': {
			file: 'http://s3-sa-east-1.amazonaws.com/ftd-gestor/data/geografia.json',
			arrData: null
		},
		'História': {
			file: 'http://s3-sa-east-1.amazonaws.com/ftd-gestor/data/historia.json',
			arrData: null
		},
		'Inglês': {
			file: 'http://s3-sa-east-1.amazonaws.com/ftd-gestor/data/ingles.json',
			arrData: null
		},
		'Língua Portuguesa': {
			file: 'http://s3-sa-east-1.amazonaws.com/ftd-gestor/data/lingua_portuguesa.json',
			arrData: null
		},
		'Matemática': {
			file: 'http://s3-sa-east-1.amazonaws.com/ftd-gestor/data/matematica.json',
			arrData: null
		},
		'Química': {
			file: 'http://s3-sa-east-1.amazonaws.com/ftd-gestor/data/quimica.json',
			arrData: null
		},
		'Sociologia': {
			file: 'http://s3-sa-east-1.amazonaws.com/ftd-gestor/data/sociologia.json',
			arrData: null
		}
	},
	
	
	initialize: function () {
		this.template = templateManager.views.Prova;
    	this.model = new ProvaModel({id:this.options.provaId}, {collection:this.collection});
    	this.booLoadingProva = true;
    	this.model.fetch({
    		success: _.bind(this.handleModelFetched, this)
    	});
    },
	
	
	handleModelFetched: function(model, response, options) {
		_debug('handleModelFetched');
		this.arrAtividadesIdList = this.model.get('atividades');
    	this.atividadesSelecionadasCollection = new AtividadesCollection( this.model.get('atividadesModels') );
    	this.loadAtividades();
	},
	
	
	loadAtividades: function() {
		_debug('loadAtividades');
    	// get atividades from current disciplina
    	var strDisciplina = this.model.get('disciplina');
    	if (!this.objAtividades[strDisciplina].arrData) {
    		_debug('load');
    		// If prova is being loaded, the page was not yet rendered, we need to render it
    		// so we can show the loading message modal.
    		if (this.booLoadingProva) {
    			this.render();
    		}
			$.getJSON( 'simple_proxy.php?url='+this.objAtividades[strDisciplina].file, _.bind(this.handleAtividadesLoaded, this));
			$('#modalLoadingAtividades').modal({
				keyboard: false,
				backdrop: 'static'
			});
			
    	} else {
    		_debug('arrData exists');
    		this.booLoadingProva = false;
    		this.atividadesCollection = new AtividadesCollection(this.objAtividades[strDisciplina].arrData);
			this.filterAtividades();
    	}
	},
	
	
	handleAtividadesLoaded: function(arrAtividades) {
		if (this.booLoadingProva) {
			this.booLoadingProva = false;
		}
		$('#modalLoadingAtividades').modal('hide');
		var strDisciplina = this.model.get('disciplina');
		this.objAtividades[strDisciplina].arrData = arrAtividades.contents;
		this.atividadesCollection = new AtividadesCollection(this.objAtividades[strDisciplina].arrData);
		this.filterAtividades();
	},
    
    
    filterAtividades: function() {
		// default filters
		var objDefaultFilters = ['disciplina', 'nivel', 'ano', 'dificuldade'];
		// atividades filters (supplied by users on tag input)
		var objAtividadesFilters = ['enunciado', 'alternativas', 'resposta', 'fonte_nome', 'fonte_ano', 'fonte_fase', 'fonte_nivel', 'fonte_lote', 'fonte_sequencia', 'fonte_colecao', 'acesso_autor', 'topicos', 'marcadores', 'comentario'];
		
		// build query
    	var objQuery = {$and: {}};
    	
    	// adds default filters if their values ​​are different from model's default values
    	for (var i in objDefaultFilters) {
    		var strFilter = objDefaultFilters[i];
    		if (this.model.get(strFilter) != this.model.defaults[strFilter]) {
    			objQuery.$and[strFilter] = this.model.get(strFilter);
    		} else {
    			objAtividadesFilters.push(strFilter);
    		}
    	}
    	
    	// perform query on default filters
    	var arrQueryResults = this.atividadesCollection.query(objQuery);
    	this.atividadesFiltradasCollection = new AtividadesCollection(arrQueryResults);
    	
    	// add user supplied filters
    	if (this.arrFilters.length>0) {
    		objQuery = {$or: {}};
    		for (var i=0; i<this.arrFilters.length; i++) {
    			var strFilterValue = this.arrFilters[i];
    			for (var j in objAtividadesFilters) {
    				var strFilterKey = objAtividadesFilters[j];
    				objQuery.$or[strFilterKey] = {$likeI: strFilterValue};
    			}
    			_debug(objQuery);
    			arrQueryResults = this.atividadesFiltradasCollection.query(objQuery);
    			_debug('arrQueryResults filter', strFilterValue, arrQueryResults.length);
    			this.atividadesFiltradasCollection = new AtividadesCollection(arrQueryResults);
    		}
    	}
    	
    	// check if some activity is already selected by user and, if so, remove it from results
    	_debug('this.atividadesFiltradasCollection.length', this.atividadesFiltradasCollection.length);
    	arrQueryResults = this.atividadesFiltradasCollection.models.slice();
    	for (var i=0; i<arrQueryResults.length; i++) {
    		var model = arrQueryResults[i];
    		if ( this.atividadesSelecionadasCollection.get(model.get('id')) ) {
    			this.atividadesFiltradasCollection.remove(model, {silent:true});
    		}
    	}
    	_debug('this.atividadesFiltradasCollection.length', this.atividadesFiltradasCollection.length);
    	
    	this.render();
    },

	
	render: function () {
		_debug('render');
		
		if (this.booLoadingProva) {
			var strHtml = Mustache.to_html( this.template, {show_prova: false} );
    		this.$el.html( strHtml );
    		return this;
		}
		
		var objModelData = this.model.toJSON();
		objModelData.show_prova = true;
		// objModelData.results = this.atividadesFiltradasCollection.length;
		
    	var strHtml = Mustache.to_html( this.template, objModelData );
    	this.$el.html( strHtml );
		
		// Init da view que lista as atividades filtradas
		this.atividadesFiltradasView = new ListaAtividadesView({
			collection: this.atividadesFiltradasCollection,
			id: 'listaAtividadesUl',
			tagName: 'ul',
			showRemoveButton: false,
			showAddButton: true
		});
		$('#listaAtividadesContainer', this.$el).append( this.atividadesFiltradasView.el );
		
		// Init a view que lista as atividades selecionadas
		this.atividadesSelecionadasView = new ListaAtividadesView({
			collection: this.atividadesSelecionadasCollection,
			id: 'listaAtividadesSelecionadasUl',
			tagName: 'ul',
			showRemoveButton: true,
			showAddButton: false
		});
		$('#listaAtividadesSelecionadasContainer', this.$el).append( this.atividadesSelecionadasView.el );
		
		// search field
		$('#inputSearch').inputTags({
			container: '#listaFiltersUl',
	 		liTemplate: '<li class="listaFiltersLi">{{tag}} <i class="icon-remove-sign listaFiltersLiRemoveButton"></i></li>',
	 		removeButtonSelector: '.listaFiltersLiRemoveButton',
			onTagAdded: _.bind(this.handleTagAddedToFilter, this),
			onTagRemoved: _.bind(this.handleTagRemovedFromFilter, this),
			tags: this.arrFilters
		});
		$('#inputSearch').focus();
		
		this.initUiElements();
		
		//Inform our parent that our size has changed
		//This only works for same domain, look out for CORS issues
		parent.resizeIframe();
		
        return this;
    },
    
    
    handleTagAddedToFilter: function(strTag, arrTags) {
		this.arrFilters = arrTags;
    	this.filterAtividades();
    },
    
    
    handleTagRemovedFromFilter: function(strTag, arrTags) {
    	this.arrFilters = arrTags;
    	this.filterAtividades();
    },
    
    
    initUiElements: function() {
		// jquery ui sortable list of selected atividades
		if ( $('#listaAtividadesSelecionadasUl').data('sortable') ) {
			$('#listaAtividadesSelecionadasUl').sortable('refresh');
			
		} else {
			$el = $('#listaAtividadesSelecionadasUl').sortable({
				placeholder: 'itemAtividadeSelecionadaPlaceHolder',
				axis: 'x'
			});
			$el.disableSelection();
			// http://bugs.jqueryui.com/ticket/6702
			$el.data('sortable').floating = true;
   			$el.data('uiSortable').floating = true;
		}
		
		// bootstrap tooltips on buttons
		$('button').tooltip();
		$('input').tooltip();
		
		// update selected activities list
		this.arrAtividadesIdList = $('#listaAtividadesSelecionadasUl').sortable('toArray');
		
		if (this.arrAtividadesIdList.length>0) {
			$('#buttonDownload').removeClass('disabled');
			$('#buttonSendToEmail').removeClass('disabled');
		} else {
			$('#buttonDownload').addClass('disabled');
			$('#buttonSendToEmail').addClass('disabled');
		}
		
		
		// ... and counter
		this.updateAtividadesSelecionadasCounter();
		
		// filtered activities counter
		$('#listaAtividadesHeader').text(this.atividadesFiltradasCollection.length + ' itens filtrados (termos da busca)');
		
		if (this.arrAtividadesIdList.join() != this.model.get('atividades').join()) {
			$('#buttonSalvar').removeClass('disabled');
		}
	},
	
	
	updateAtividadesSelecionadasCounter: function() {
		$('#listaAtividadeCounter').empty();
		var intCount = this.atividadesSelecionadasCollection.length;
		var strMessage = '';
		switch(true) {
			case (intCount==0):
				strMessage = ' ';
				break;
			case (intCount==1):
				strMessage = '1 item';
				break;
			case (intCount>1):
				strMessage = intCount + ' itens';
				break;
		}
		$('#listaAtividadeCounter').text(strMessage);
	},
    
    
    events: {
    	'click #buttonCancelar': 'handleClickButtonCancelar',
    	'click #buttonVisualizar': 'handleClickButtonVisualizar',
    	'click #buttonDownload': 'handleClickButtonDownload',
    	'click #buttonSendToEmail': 'handleClickButtonSendToEmail',
    	'click #buttonPrint': 'handleClickButtonPrint',
    	'click #buttonSalvar': 'handleClickButtonSalvar',
    	
    	'click #buttonEditarPropriedades': 'handleClickButtonEditarPropriedades',
    	'click #buttonSalvarPropriedades': 'handleClickButtonSalvarPropriedades',
    	'click #buttonCancelarPropriedades': 'handleClickButtonCancelarPropriedades',
    	
    	'click .itemAtividadeButtonVer': 'handleClickButtonVerAtividade',
    	'click .itemAtividadeButtonAdicionar': 'handleClickButtonAdicionarAtividade',
    	'click .itemAtividadeButtonRemover': 'handleClickButtonRemoverAtividade',
    	
    	// modal view prova
    	'click #modalVisualizarProva #buttonDownload': 'handleClickButtonDownloadModalVisualizar',
    	'click #modalVisualizarProva #buttonSendToEmail': 'handleClickButtonSendToEmailModalVisualizar',
    	'click #modalVisualizarProva #buttonPrint': 'handleClickButtonPrintModalVisualizar',
    	
    	// modal download prova
    	'click #buttonSubmitDownload': 'handleClickButtonSubmitDownload',
    	
    	// modal send to email
    	'click #buttonSubmitSendToEmail': 'handleClickButtonSubmitSendToEmail',
    	
    	// modal print
    	'click #buttonSubmitPrint': 'handleClickButtonSubmitPrint',
    	
    	'sortstop #listaAtividadesSelecionadasUl': 'handleSortStopAtividadesSelecionadas'
    },
	
	
	/* Atividade items: view, add, remove and sort */
	
	handleClickButtonVerAtividade: function(e){
		$('#modalVerAtividade').remove();
		var modelId = e.currentTarget.getAttribute('data-id');
		
		var booAtividadeSelecionada = false;
		var model = this.atividadesSelecionadasCollection.get(modelId);
		if (model) {
			booAtividadeSelecionada = true;
		} else {
			model = this.atividadesCollection.get(modelId);
		}
		
		var objModel = model.toJSON();
		if (booAtividadeSelecionada) {
			objModel.button_adicionar = false;
			objModel.button_remover = true;
			
		} else {
			objModel.button_adicionar = true;
			objModel.button_remover = false;
		}
		
		var strHtmlModalAtividade = Mustache.to_html( templateManager.views.ProvaVerAtividade, objModel);
		this.$el.append( strHtmlModalAtividade );
		$('#modalVerAtividade').modal('show');
		var parentScreenTop = $(window.parent.window).scrollTop();
		$('#modalVerAtividade').css('top', parentScreenTop);
	},
	
	
	handleClickButtonAdicionarAtividade: function(e){
		var modelId = e.currentTarget.getAttribute('data-id');
		var model = this.atividadesCollection.get(modelId);
		this.atividadesSelecionadasCollection.push(model);
		this.atividadesFiltradasCollection.remove(model);
		//this.initUiElements();
		this.model.set('atividadesModels', this.atividadesSelecionadasCollection.toArray() );
		this.filterAtividades();
	},
	

	handleClickButtonRemoverAtividade: function(e){
		_debug('handleClickButtonRemoverAtividade');
		var modelId = e.currentTarget.getAttribute('data-id');
		var model = this.atividadesSelecionadasCollection.get(modelId);
		this.atividadesSelecionadasCollection.remove(model);
		//this.initUiElements();
		this.model.set('atividadesModels', this.atividadesSelecionadasCollection.toArray() );
		this.filterAtividades();
	},
	
	
	handleSortStopAtividadesSelecionadas: function() {
		this.initUiElements();
		// Sort atividadesSelecionadasCollection according to ul order.
		// This routine expects that this.arrAtividadesIdList was updated after
		// items being sorted. Check this.initUiElements method.
		var sortedCollection = new AtividadesCollection();
		var modelId;
		for (var i=0; i<this.arrAtividadesIdList.length; i++) {
			modelId = this.arrAtividadesIdList[i];
			sortedCollection.push( this.atividadesSelecionadasCollection.get(modelId) );
		}
		this.atividadesSelecionadasCollection = sortedCollection;
		this.model.set('atividadesModels', this.atividadesSelecionadasCollection.toArray() );
	},
	
	
	/* 
	 * Prova actions: 
	 * - cancelar (back to home view);
	 * - salvar
	 * - visualizar prova
	 * - download as docx/pdf
	 * - send to email (docx and pdf)
	 */
	
	
	handleClickButtonCancelar: function(e) {
		app.navigate('', {trigger: true});
	},
	
	
	handleClickButtonSalvar: function(e) {
		if (this.arrAtividadesIdList.join() != this.model.get('atividades').join()) {
			this.model.save({atividades: this.arrAtividadesIdList}, {
				success: function(model, response, options){
					$('#buttonSalvar').addClass('disabled');
				}
			});
		}
	},
	
	
	handleClickButtonVisualizar: function(e) {
		var objProva = this.provaToJson();
		var strHtmlModalContent = Mustache.to_html( templateManager.views.ProvaVisualizar, objProva );
		$('#modalVisualizarProvaContent').empty();
		$('#modalVisualizarProvaContent').html( strHtmlModalContent );
		$('#modalVisualizarProva').modal('show');
		var parentScreenTop = $(window.parent.window).scrollTop();
		$('#modalVisualizarProva').css('top', parentScreenTop);
	},
	
	
	handleClickButtonDownload: function(e) {
		this.openDownloadModal();
	},
	
	
	handleClickButtonDownloadModalVisualizar: function(e) {
		$('#modalVisualizarProva').modal('hide');
		this.openDownloadModal();
	},
	
	
	openDownloadModal: function() {
		if (this.arrAtividadesIdList.length>0) {
			// reset form first
			$('#formDownloadError').hide();
			$('#formDownload input:checked').prop('checked', false);
			// default values
			$('#formDownload #inputFormatoDocx').prop('checked', true);
			// set list of selected atividades
			$('#formDownload #inputAtividades').val( this.arrAtividadesIdList.join() );
			
			$('#modalDownloadProva').modal('show');
			
			var parentScreenTop = $(window.parent.window).scrollTop();
			$('#modalDownloadProva').css('top', parentScreenTop);
		}
	},
	
	
	handleClickButtonSubmitDownload: function(e) {
		// Check if the user has selected at least one download option
		if ( $('#formDownload input:checkbox:checked').length > 0 ) {
			$('#formDownload').submit();
			
		} else {
			$('#formDownloadErrorMessage').text('Selecione ao menos um item para incluir na prova!');
			$('#formDownloadError').show();
		}
	},
	
	
	handleClickButtonSendToEmail: function(e) {
		this.openSendToEmailModal();
	},
	
	
	handleClickButtonSendToEmailModalVisualizar: function(e) {
		$('#modalVisualizarProva').modal('hide');
		this.openSendToEmailModal();
	},
	
	
	openSendToEmailModal: function() {
		if (this.arrAtividadesIdList.length>0) {
			// reset form first
			$('#formSendToEmailError').hide();
			$('#formSendToEmailSuccess').hide();
			$('#formSendToEmail input:checked').prop('checked', false);
			// set list of selected atividades
			$('#formSendToEmail #inputAtividades').val( this.arrAtividadesIdList.join() );
			$('#modalSendToEmail').modal('show');
			
			var parentScreenTop = $(window.parent.window).scrollTop();
			$('#modalSendToEmail').css('top', parentScreenTop);
		}
	},
	
	
	handleClickButtonSubmitSendToEmail: function(e) {
		// Check if the user has selected at least one download option
		var booPrintProva = $('#formSendToEmail #inputProva').prop('checked');
		var booPrintGabarito = $('#formSendToEmail #inputGabarito').prop('checked');
		var booPrintResolucoes = $('#formSendToEmail #inputResolucoes').prop('checked');
		
		if ( booPrintProva || booPrintGabarito || booPrintResolucoes ) {
			if ( $('#formSendToEmail #inputFormatoDocx').prop('checked') || $('#formSendToEmail #inputFormatoPdf').prop('checked') ) {
				$('#formSendToEmail').submit();
				$('#formSendToEmailSuccess').show();
				$('#formSendToEmailError').hide();
				
			} else {
				$('#formSendToEmailErrorMessage').text('Selecione ao menos um formato para a prova!');
				$('#formSendToEmailError').show();
			}
			
		} else {
			$('#formSendToEmailErrorMessage').text('Selecione ao menos um item para incluir na prova!');
			$('#formSendToEmailError').show();
		}
	},
	
	
	handleClickButtonPrint: function(e) {
		this.openPrintModal();
	},


	handleClickButtonPrintModalVisualizar: function(e) {
		$('#modalVisualizarProva').modal('hide');
		this.openPrintModal();
	},
	
	
	openPrintModal: function() {
		if (this.arrAtividadesIdList.length>0) {
			// reset form first
			$('#formPrintError').hide();
			$('#formPrint input:checked').prop('checked', false);
			
			var objProva = this.provaToJson();
			var strHtml = Mustache.to_html( templateManager.views.ProvaImprimir, objProva );
			$('#containerPrint').empty();
			$('#containerPrint').html( strHtml );

			var strHtmlResolucoes = $.trim( $("#containerPrint #containerResolucao .content").text() );
			if (strHtmlResolucoes.length>0) {
				$('#formPrint #inputResolucoes').parent().show();
				
			} else {
				$('#formPrint #inputResolucoes').parent().hide();
			}
			
			$('#modalPrintProva').modal('show');
			
			var parentScreenTop = $(window.parent.window).scrollTop();
			$('#modalPrintProva').css('top', parentScreenTop);
		}
	},
	
	
	handleClickButtonSubmitPrint: function(e) {
		// Check if the user has selected at least one download option
		var booPrintProva = $('#formPrint #inputProva').prop('checked');
		var booPrintGabarito = $('#formPrint #inputGabarito').prop('checked');
		var booPrintResolucoes = $('#formPrint #inputResolucoes').prop('checked');
		
		if ( booPrintProva || booPrintGabarito || booPrintResolucoes ) {
			
			if (booPrintProva) {
				$('#containerPrint #containerProva').removeClass('hide');
			} else {
				$('#containerPrint #containerProva').addClass('hide');
				
			}
			
			if (booPrintGabarito) {
				if (booPrintProva) {
					$('#containerPrint #containerGabarito').addClass('pageBreakBefore');
				} else {
					$('#containerPrint #containerGabarito').removeClass('pageBreakBefore');
				}
				$('#containerPrint #containerGabarito').removeClass('hide');
			} else {
				$('#containerPrint #containerGabarito').addClass('hide');
				
			}
			
			if (booPrintResolucoes) {
				if (booPrintProva || booPrintGabarito) {
					$('#containerPrint #containerResolucao').addClass('pageBreakBefore');
				} else {
					$('#containerPrint #containerResolucao').removeClass('pageBreakBefore');
				}
				$('#containerPrint #containerResolucao').removeClass('hide');
			} else {
				$('#containerPrint #containerResolucao').addClass('hide');
				
			}
			
			var strTitulo = this.model.get('titulo');			
			$('#containerPrint').printThis({
				printContainer: false,
				titlePage: strTitulo
			});

		} else {
			$('#formPrintErrorMessage').text('Selecione ao menos um item para incluir na impressão!');
			$('#formPrintError').show();
		}
	},
	
	
	provaToJson: function() {
		var arrAtividadesSelecionadas = this.atividadesSelecionadasCollection.toArray();
		var strNumeroQuestao;
		var atividadeModel;
		var strResolucao;
		var arrAtividades = [];
		var arrGabarito = [];
		var arrResolucao = [];
		for (var i=0; i<arrAtividadesSelecionadas.length; i++) {
			atividadeModel = arrAtividadesSelecionadas[i];
			strNumeroQuestao = 'Questão ' + String(i+1);
			arrAtividades.push({
				numero: strNumeroQuestao,
				enunciado_html: atividadeModel.get('enunciado_html')
			});
			arrGabarito.push({
				numero: strNumeroQuestao,
				resposta_html: atividadeModel.get('resposta_html')
			});
			// add resolucao if it is not empty
			strResolucao = atividadeModel.get('resolucao');
			if (strResolucao.length>0) {
				arrResolucao.push({
					numero: strNumeroQuestao,
					resolucao_html: strResolucao
				});	
			}
		}
		return {
			atividades: arrAtividades,
			gabarito: arrGabarito,
			resolucao: arrResolucao
		};
	},

	
	handleClickButtonEditarPropriedades: function() {
		$('#modalPropriedadesProvaContent').empty();
		this.propertiesView = new ProvaPropertiesView({
			model: this.model, 
			el: '#modalPropriedadesProvaContent'
		});
		$('#modalPropriedadesProva').modal('show');
		var parentScreenTop = $(window.parent.window).scrollTop();
		$('#modalPropriedadesProva').css('top', parentScreenTop);
	},
	
	
	handleClickButtonSalvarPropriedades: function() {
		var objProperties = this.propertiesView.formToJson();
		var booChanged = false;
		for (var strKey in objProperties) {
			var value = objProperties[strKey];
			if ( this.model.get(strKey) != value ){
				booChanged = true;
				break;
			}
		}
		if (booChanged) {
			// after saving, call method loadAtividades and undelegate the callback to 'sync' event
			this.model.once('sync', this.loadAtividades, this);
			this.model.save(objProperties, {
				success: _.bind(this.hidePropertiesView, this)
			});
		} else {
			this.hidePropertiesView();
		}
	},
	
	
	hidePropertiesView: function() {
		$('#modalPropriedadesProva').modal('hide');
		this.propertiesView.stopListening();
		this.propertiesView = null;
	},
	
	
	handleClickButtonCancelarPropriedades: function() {
		this.hidePropertiesView();
	},
	
	
	destroy: function() {
		this.stopListening();
	},
	
	
});