<div>
    <div style="float:left">
        <pagination first-text="primeira" last-text="última" previous-text="anterior" next-text="próxima" total-items="TotalItems" items-per-page="entryLimit" ng-click="calcCurrentPage(currentPage,entryLimit)" ng-model="currentPage" max-size="maxSize" boundary-links="true" rotate="true" num-pages="noOfPages"></pagination>
    </div>
    <div style="position:absolute"><p class="text-muted"><strong>{{TotalItems|number}} produtos disponíveis. </strong></p></div>
    <div style="float:right; margin-top:20px">
        <select class="form-control" ng-change="calcCurrentPage(currentPage,entryLimit)" ng-options="item.value as item.qtd for item in currentItems" ng-model="entryLimit">
           <option style="display:none" value="">Itens por página</option>
        </select>
    </div>
    <div style="clear:both"></div>
</div>

<div class="row">
	<div class="col-md-3 " ng-repeat="item in filtered | startFrom:(currentPage-1)*entryLimit | limitTo:entryLimit | orderBy:columnToOrder">
    <!-- thumbnail -->
	    <div class="thumbnail" style="min-height:460px">
	    	<a ng-click="getProduto(item)" href="#produto?id={{item.id}}"><img border="0" class="img-responsive" ng-src="images/{{item.image}}"></a>
	    	<h3>{{item.name}}</h3>
	    	<p>{{item.description | limitTo : 50}}... <a ng-click="getProduto(item)" href="#produto?id={{item.id}}">saiba mais</a></p>
	    	<h3>{{item.price | currency : 'R$ '}}</h3>
	    	<button ng-class="{true: 'btn btn-primary btn-sm', false: 'btn btn-success btn-sm'}[!item.state]" ng-click="setCarrinho(item);" style="position:absolute; margin-left: 142px; margin-top:-50px"><span class="glyphicon glyphicon-shopping-cart"></span> {{item.text}}</button>
	    </div>
	</div>	
</div>