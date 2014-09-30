<?php /* @var $this Controller */ ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="en" />

	<link href="<?php echo Yii::app()->request->baseUrl; ?>/css/bootstrap.min.css" rel="stylesheet" media="screen">
	<link href="<?php echo Yii::app()->request->baseUrl; ?>/css/main.css" rel="stylesheet" media="screen">
	<link rel="stylesheet" href="<?php echo Yii::app()->request->baseUrl; ?>/css/bootstrap.min.css">

	<script src="<?php echo Yii::app()->request->baseUrl; ?>/assets/jquery-1.10.2.min.js"></script>
	<script src="<?php echo Yii::app()->request->baseUrl; ?>/assets/js/bootstrap.min.js"></script>
	<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/angular.js"></script>
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/angular-sanitize.js"></script>
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/app/app.js"></script>
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/angular-route.min.js"></script>
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/select.js"></script>
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/checklist-model.js"></script>    
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/ui-bootstrap-tpls-0.11.0.min.js"></script>
    <style>
        .modalLoading {
            display:    none;
            position:   fixed;
            z-index:    1000;
            top:        0;
            left:       0;
            height:     100%;
            width:      100%;
            background: rgba( 255, 255, 255, .8 ) 
                        url('images/ajax-loader.gif') 
                        50% 50% 
                        no-repeat;
        }
        
    </style>
	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body ng-app="app" ng-controller="mobly" ng-init="init()">

<div class="container" id="page">

	<div id="header">
		<div class="row">
			<div class="logo col-md-4">
				<a href="#"><img src="http://st1.staticmobly.com.br/images/mobly3/logo-mobly3.png" alt="Mobly | Sua loja de móveis e artigos de decoração"></a>                
            </div>
            <div class="col-md-7 pull-right">
            <form ng-show="!usuario.name" class="form-inline" role="form">
			  <div class="form-group">
			    <label class="sr-only">Email address</label>
			    <input type="text" class="form-control" id="login" placeholder="Login demo">
			  </div>
			  <div class="form-group">
			    <label class="sr-only" for="exampleInputPassword2">Password</label>
			    <input type="password" class="form-control" id="senha" placeholder="senha demo">
			  </div>
			  <button ng-click="getUsuario()" class="btn btn-default">Entrar</button>
			  <div class="form-group">
			    <a style="margin-left:33px;" href="#carrinho"><h1 class="glyphicon glyphicon-shopping-cart"></h1><span class="badge">{{carrinho.length}}</span></a>
			  </div>
			</form>			
			<form style="text-align: right;" ng-show="usuario.name" class="form-inline" role="form">
			  <div class="form-group">
			    <button class="btn btn-danger" ng-click="logout()"><span class="glyphicon glyphicon glyphicon-off"></span> sair</button> Bem vindo {{usuario.name}} {{usuario.last_name}}!
			  </div>
			  <div class="form-group">
			    <a style="margin-left:33px;" href="#carrinho"><h1 class="glyphicon glyphicon-shopping-cart"></h1><span class="badge">{{carrinho.length}}</span></a>
			  </div>
			</form>		           
            
            </div>		
		</div>
	</div><!-- header -->
	
	<div id="mainmenu">
		<nav class="navbar navbar-default" role="navigation">
		  <div class="container-fluid">
		    <!-- Collect the nav links, forms, and other content for toggling -->
		    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
		      <ul class="nav navbar-nav">
		        <li ng-repeat="categoria in categorias"><a ng-click="searchCategory(categoria.name)" href="#">{{categoria.name}}</a></li>			               
		      </ul>      
		    </div><!-- /.navbar-collapse -->	
		    <div ng-show="list.length > 0" style="width:250px; float:right; margin-top:-40px" class="input-group">				      
		      <input type="text" class="form-control ng-pristine ng-valid" ng-model="search" ng-focus="init()" placeholder="Buscar">
		      <span class="input-group-addon">
		        <span class="glyphicon glyphicon-search"></span>
		      </span>
		    </div>	    
		  </div><!-- /.container-fluid -->
		</nav>
	</div><!-- mainmenu -->
	
	<?php echo $content; ?>

	<div class="clear"></div>

	<div id="footer">
		Copyright &copy; <?php echo date('Y'); ?> by Mobly.<br/>
		All Rights Reserved.<br/>
		Powered by Rafael Frota.
	</div><!-- footer -->

</div><!-- page -->
<div id="loading" class="modalLoading"></div>
<script type="text/javascript">
	$('#loading').hide();
</script>
</body>
</html>
