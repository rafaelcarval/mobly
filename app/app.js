var app = angular.module('app', ['ngRoute','ngSanitize', 'ui.select', 'ui.bootstrap', 'checklist-model']);

app.controller("mobly", function($scope, $http, $filter, filterFilter, $timeout, $route, $routeParams, $location){

  $scope.categorias = {};
  $scope.usuario = [];
  $scope.carrinho = [];
  $scope.produtos = {};
  $scope.produto = {};
  $scope.currentPage = 1; //current page
  $scope.maxSize = 5; //pagination max size
  $scope.entryLimit = '20'; //max rows for data table
  $scope.firstItem = 1;
  $scope.lastItem = 0;
  $scope.login = '';
  $scope.senha = '';
  $scope.currentItems = [                  
    {value:'10', qtd: '10'}, 
    {value:'20', qtd: '20'},
    {value:'30', qtd: '30'},
    {value:'40', qtd: '40'},
    {value:'50', qtd: '50'},
    {value:'100', qtd: '100'}
   ];

  $scope.init = function(){   
    $scope.getUsuario();   
    $scope.getCategorias(); 
    $scope.getCarrinho();
    $scope.getProdutos();

  };

  $scope.logout = function(){
    $http.get('index.php/api/Logout').    
    success(function(data, status, headers, config) {
      $scope.usuario = [];
    }).
    error(function(data, status, headers, config) {
      // log error
    });
  }

  $scope.getCategorias = function(){
    $http.get('index.php/api/Category').    
    success(function(data, status, headers, config) {
      $scope.categorias = data;
    }).
    error(function(data, status, headers, config) {
      // log error
    });
  }

  $scope.showPleaseWait = function(){      
      var pleaseWaitDiv = $('#loading');      
      pleaseWaitDiv.show();      
  }

  $scope.hidePleaseWait = function(){                
    var pleaseWaitDiv = $('#loading');    
    pleaseWaitDiv.hide();        
  } 

  $scope.getProdutos = function(){
    $scope.showPleaseWait();
    $http.get('index.php/api/Product').    
    success(function(data, status, headers, config) {
      $scope.produtos = data;
      $scope.observe();
      if ($scope.carrinho.length>0) {
        angular.forEach($scope.carrinho, function(item) { 
          console.log(item.id)         
          var found = $filter('filter')($scope.produtos, {id: item.id}, true);
          var indexOf = $scope.produtos.indexOf(found[0]);
          $scope.produtos[indexOf].state = true;
          $scope.produtos[indexOf].text = 'comprando';
        })
      };
    }).
    error(function(data, status, headers, config) {
      // log error
    });
  }

  $scope.setCarrinho = function(item){
    item.qtd = 1;
    var indice = '';
    var i = 0;

    var found = $filter('filter')($scope.carrinho, {id: item.id}, true);

    if (!found.length) {      
      $scope.carrinho.push(item);
      var index = $filter('filter')($scope.carrinho, {id: item.id}, true);
      indice = $scope.carrinho.indexOf(index[0]);
      item.state = !item.state;
      var index = $filter('filter')($scope.produtos, {id: item.id}, true);
      var indexOf = $scope.produtos.indexOf(index[0]);
      $scope.produtos[indexOf].state = true;
      $scope.produtos[indexOf].text = 'comprando';
      $http.post('index.php/api/SetShoppingCart?indice='+indice+'&id='+item.id+'&qtd='+item.qtd+'&price='+item.price, {
          withCredentials: true,
          headers: {'Content-Type': undefined },
          transformRequest: angular.identity
      }).success(function(data, status, headers, config) {
        
      }).error(function(data, status) {
       
      });
    }
  }

  $scope.alteraItem = function(item){
    console.log(item);
    var index = $filter('filter')($scope.carrinho, {id: item.id}, true);
    indice = $scope.carrinho.indexOf(index[0]);    
    $http.post('index.php/api/SetShoppingCart?indice='+indice+'&id='+item.id+'&qtd='+item.qtd+'&price='+item.price, {
        withCredentials: true,
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
    }).success(function(data, status, headers, config) {
      
    }).error(function(data, status) {
     
    });
  }

  $scope.getCarrinho = function(){
    $scope.carrinho = [];
    $http.get('index.php/api/GetShoppingCart').    
    success(function(data, status, headers, config) {
      console.log(data)
      if (!angular.isObject(data)) {
        $scope.carrinho = [];
      }else{
        angular.forEach(data, function(item) { 
          itens = item;
          itens.qtd = parseInt(item.qtd);        
          $scope.carrinho.push(itens);
        })
      };
      
      
    }).
    error(function(data, status, headers, config) {
      // log error
    });
  }

  $scope.setCarrinho = function(item){
    item.qtd = 1;
    var indice = '';
    var i = 0;

    var found = $filter('filter')($scope.carrinho, {id: item.id}, true);

    if (!found.length) {      
      $scope.carrinho.push(item);
      var index = $filter('filter')($scope.carrinho, {id: item.id}, true);
      indice = $scope.carrinho.indexOf(index[0]);
      item.state = !item.state;
      var index = $filter('filter')($scope.produtos, {id: item.id}, true);
      var indexOf = $scope.produtos.indexOf(index[0]);
      $scope.produtos[indexOf].state = true;
      $scope.produtos[indexOf].text = 'comprando';
      $http.post('index.php/api/SetShoppingCart?indice='+indice+'&id='+item.id+'&qtd='+item.qtd+'&price='+item.price, {
          withCredentials: true,
          headers: {'Content-Type': undefined },
          transformRequest: angular.identity
      }).success(function(data, status, headers, config) {
        
      }).error(function(data, status) {
       
      });
    }
  }

  $scope.finalizarCompra = function(){
    if ($scope.usuario.length == 0) {
      $('#myModal').modal('show');  
    }else{
      $http.get('index.php/api/SetPedido').    
      success(function(data, status, headers, config) {        
        //console.log(data.message,data.idPedido);
        angular.forEach($scope.carrinho, function(item) {
          var index = $filter('filter')($scope.produtos, {id: item.id}, true);
          var indexOf = $scope.produtos.indexOf(index[0]);
          $scope.produtos[indexOf].state = false;
        })
        $scope.carrinho = [];
        $scope.getPedido(data.idPedido);
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    };    
  }

  $scope.getPedido = function(id){
    $http.get('index.php/api/GetPedido?idPedido='+id).    
      success(function(data, status, headers, config) {        
        $scope.pedido = data;
        $location.path( "/pedido" );
      }).
      error(function(data, status, headers, config) {
        // log error
      });    
  }

  $scope.removeItem = function(index) {
    console.log(index);
    $http.get('index.php/api/RemoveItem?indice='+index).    
    success(function(data, status, headers, config) {
      $scope.carrinho = data;
    }).
    error(function(data, status, headers, config) {
      // log error
    });   
    //$scope.carrinho.splice(index, 1);
  },

  $scope.getUsuario = function() {    
    var login = $('#login').val();
    if (login == '') {
      login = $('#login2').val();
    };
    var senha = $('#senha').val();
    if (senha == '') {
      senha = $('#senha2').val();
    };
    $http.get('index.php/api/GetUser?login='+login+'&password='+senha).    
    success(function(data, status, headers, config) {
      $scope.usuario = data;      
      $('#myModal').modal('hide');
    }).
    error(function(data, status, headers, config) {
      // log error
    });   
    //$scope.carrinho.splice(index, 1);    
  },

  $scope.total = function() {
    var total = 0;
      angular.forEach($scope.carrinho, function(item) {
        total += item.qtd * item.price;
      })

    return total;
  }

  $scope.totalPedido = function() {
    var total = 0;
      angular.forEach($scope.pedido.itens, function(item) {        
        total += item.qtd * item.price;
        console.log('total ',total)
      })

    return total;
  }

  $scope.getProduto = function(item){
    $scope.produto = item;
  }

  $scope.observe = function(){

    $scope.list = $scope.produtos; //Initially for no filter     
    $scope.TotalItems = $scope.list.length;
    // console.log(Math.ceil($scope.list.length/$scope.entryLimit))
    $scope.noOfPages = Math.ceil($scope.list.length/$scope.entryLimit);

    $scope.$watch('search', function(term) {          
        $scope.filtered = filterFilter($scope.list, term);
        $scope.filteredSearch = filterFilter($scope.list, term);
        $scope.TotalItems = $scope.filtered.length;
        $scope.noOfPages = Math.ceil($scope.filtered.length/$scope.entryLimit);
        $scope.lastItem = $scope.entryLimit * ($scope.currentPage)
        if ($scope.lastItem > $scope.filtered.length) {
          $scope.lastItem = $scope.filtered.length;
        };
    });
    $scope.hidePleaseWait();
    $scope.sort('name'); 
  }

  $scope.sort = function(sortBy){            
      $scope.columnToOrder = sortBy;       
      $scope.filtered = $filter('orderBy')($scope.filtered, $scope.columnToOrder);        
      // $scope.reverse = !$scope.reverse;                
  };

  $scope.searchCategory = function(item){
    $scope.search = item;
  }

});

app.filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/home.php',
        controllerAs: 'home'
      }).
      when('/produto', {
        templateUrl: 'views/produto.php',
        controllerAs: 'home'
      }).
      when('/carrinho', {
        templateUrl: 'views/carrinho.php',
        controllerAs: 'home'
      }).
      when('/pedido', {
        templateUrl: 'views/pedido.php',
        controllerAs: 'home'
      }).
      otherwise({
        templateUrl: 'views/home.php',
        controllerAs: 'home'
      });
}]);