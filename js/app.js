// var app = angular.module('app', ['ngRoute']);

// app.controller('SimpleController', function($scope, simpleFactory){
// 	$scope.customers = simpleFactory.getCustomers();

// 	$scope.addCustomer = function(){
// 		$scope.customers.push({
// 			name: $scope.newCustomer.name,
// 			city: $scope.newCustomer.city,
// 		});
// 	};
// });

// app.config(function ($routeProvider) {
// 	$routeProvider
// 		.when('/',
// 			{
// 				controller: 'SimpleController',
// 				templateUrl: 'view/view1.html'
// 			})
// 		.when('/view2',
// 			{
// 				controller: 'SimpleController',
// 				templateUrl: 'view/view2.html'	
// 			})
// 		.otherwise({redirectTo: '/'});
// });

// app.factory('simpleFactory', function($http){

// 	var customers = [
// 		{name:'Rafael', city:'Osasco'},
// 		{name:'Frota', city:'Fortaleza'},
// 		{name:'Carvalho', city:'São Paulo'},
// 		{name:'Ana', city:'São Paulo'},
// 		{name:'Lucia', city:'Osasco'}
// 	];

// 	var factory = {};

// 	factory.getCustomers = function () {
// 		return customers;
// 	}

// 	factory.postCustomers = function (customer) {
		
// 	}

// 	return factory;
// });

