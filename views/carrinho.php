
<style type="text/css">
    td {
        vertical-align: middle;
        line-height: 40px
    }
</style>
<div>
    <table class="table">
        <tr>
            <th></th>
            <th>Nome</th>            
            <th>Descrição</th>
            <th>QTD</th>
            <th>Valor</th>
            <th>Total</th>
            <th></th>
        </tr>
        <tr ng:repeat="item in carrinho">
            <td><img border="0" class="img-responsive" ng-src="images/{{item.image}}" width="30" height="30"></td>
            <td><p>{{item.name}}</p></td> 
            <td><p>{{item.description}}</p></td>           
            <td><input ng-change="alteraItem(item)" style="width:50px" ng-model="item.qtd" type="number" ng-required class="input-mini"></td>
            <td><p>{{item.price | currency: "R$ "}}</p></td>
            <td>{{item.qtd * item.price | currency: "R$ "}}</td>
            <td>
                <button ng:click="removeItem($index)" class="btn btn-danger btn-sm">excluir</button>
            </td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Total:</td>
            <td>{{total() | currency: "R$ "}}</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><button ng-click="finalizarCompra()" class="btn btn-primary btn-sm">finalizar compra</button></td>
        </tr>
    </table>
</div>
<div id="myModal" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title">Login</h4>
      </div>
      <div class="modal-body">
        <form ng-show="!usuario.name" class="form-inline" role="form">
          <div class="form-group">
            <label class="sr-only">Email address</label>
            <input type="text" class="form-control" id="login2" placeholder="Login demo">
          </div>
          <div class="form-group">
            <label class="sr-only" for="exampleInputPassword2">Password</label>
            <input type="password" class="form-control" id="senha2" placeholder="senha demo">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button ng-click="getUsuario()" class="btn btn-default">Entrar</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->