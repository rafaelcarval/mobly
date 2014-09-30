<div>
    <div style="float:left">
        <pagination first-text="primeira" last-text="última" previous-text="anterior" next-text="próxima" total-items="TotalItems" items-per-page="entryLimit" ng-click="calcCurrentPage(currentPage,entryLimit)" ng-model="currentPage" max-size="maxSize" boundary-links="true" rotate="true" num-pages="noOfPages"></pagination>
    </div>
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
	    <div class="thumbnail">
	    	<a href="produto?id={{item.id}}"><img border="0" class="img-responsive" src="images/{{item.image}}"></a>
	    	<h3>{{item.name}}</h3>
	    	<p>{{item.description | limitTo : 50}}... <a href="produto?id={{item.id}}">saiba mais</a></p>
	    	<h3>{{item.price | currency : 'R$ '}}</h3>
	    	<button style="position:absolute; margin-left: 152px; margin-top:-35px"><span class="glyphicon glyphicon-shopping-cart"></span>adicionar</button>
	    </div>
	</div>	
</div>