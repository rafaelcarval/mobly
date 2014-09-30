
<div class="row">
	<div class="col-md-6">
		<a style="position:absolute" href="#" class="btn btn-default">voltar</a>
		<div class="thumbnail">
		   	<a href="#produto?id={{produto.id}}"><img border="0" class="img-responsive" ng-src="images/{{produto.image}}"></a>	   	
		</div>
	</div>
	<div class="col-md-6">
		<ol class="breadcrumb">
			<li ng-repeat="categoria in produto.category">{{categoria.name}}</li>
		</ol>
		<h3>{{produto.name}}</h3>
		<h4>Descrição</h4>
	   	<p>{{produto.description}}</p>
	   	<h4>Características</h4>
	   	<p>{{produto.characteristics}}</p>
	   	<h3>{{produto.price | currency : 'R$ '}}</h3>
	   	<button ng-class="{true: 'btn btn-primary btn-sm', false: 'btn btn-success btn-sm'}[!produto.state]" ng-click="setCarrinho(produto);" style="position:absolute; margin-left: 135px; margin-top:-40px"><span class="glyphicon glyphicon-shopping-cart"></span> {{produto.text}}</button>
			
	</div>	
	
</div>