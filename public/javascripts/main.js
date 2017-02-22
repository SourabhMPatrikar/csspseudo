/**
 * http://usejsdoc.org/
 */
(function () {
	var app = angular.module('BlogApp', ['ngRoute']);

	app.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
		.when('/', {
			controller : 'MainController',
			//templateUrl : 'templates/main.html'
		})
		.when('/csspseudo',{
			controller :'CssPseudoController',
			templateUrl:'templates/post.html'
		})
		.when('/csspseudo/:_id',{
			controller :'CssPseudoPostByIdController',
			templateUrl:'templates/postdetail.html'
		})
		.when('/writecsspseudo',{
			controller:'WriteNewCssPseudoController',
			templateUrl:'templates/writepost.html'
		})
		.when('/updatecsspseudo/:_id',{
			controller:'UpdateCssPseudoController',
			templateUrl:'templates/updatepost.html'
		})
		.when('/deletecsspseudo/:_id',{
			controller:'DeleteCssPseudoController',
			templateUrl:'templates/deletepost.html'
		})
		.otherwise({
			redirectTo : '/'

		});
	}]);

	//#/year/:year/month/:month

	app.controller('MainController',['$scope','ApiService','$routeParams','$rootElement','$location', function($scope,ApiService,$routeParams,$rootElement,$location){
		$scope.user = '';
		$scope.submitUserRegistration = function(user){
			//debugger;
			console.log(user);
			$scope.user.date = document.getElementById('mdate').innerText;
			ApiService.insertUser(user).then(function(response){
				console.log(response.data);
				$('#loginModal').modal('hide');
				$(".login-window").dropdown('toggle');
			});
			$scope.user={};
			$scope.signupform.$setUntouched();
			$scope.signupform.$setPristine();
		};
	}]);
	app.controller('CssPseudoController',['$scope','ApiService','$routeParams', function($scope, ApiService, $routeParams){
		$scope.posts =[];

		ApiService.fetchCssPseudoPosts().then(function(response){
			console.log(response);
			$scope.pageHeading = "CSS-Pseudo Selectors";
			$scope.pageSubHeading = "Access Attribute of Elements";
			$scope.posts = response.data;
		});
	}]);
	app.controller('CssPseudoPostByIdController',['$scope','ApiService','$routeParams', function($scope,ApiService,$routeParams){
		//debugger;
		$scope.postdetail ={};
		var id = $routeParams._id;
		ApiService.fetchCssPseudoPostById(id).then(function(response){
			console.log(response);
			//$scope.pageHeading = "Hello World!";
			//$scope.pageSubHeading = "Hello World!";
			$scope.postdetail=response.data[0];
			//console.log("postbyid",$scope.postdetail);
			//console.log("heading",$scope.pageHeading);
			fetchcomment();
		});
		
		$scope.submitCssPseudo = function(newPost){
			console.log(newPost);
			ApiService.writeCssPseudoComment(newPost).then(function(response){
				console.log(response.data);
				$scope.newPost='';
			});
			$scope.newPost.date = document.getElementById('date').innerText;
			$scope.newPost.time = document.getElementById('time').innerText;
			$scope.newPost.postId = document.getElementById('postId').innerText;
			$scope.newPost.postedBy = document.getElementById('postedBy').innerText;
			$scope.newPost.title = document.getElementById('title').innerText;
			fetchcomment();
		};
		
		function fetchcomment(){
			ApiService.fetchCssPseudoCommentsByPostId(id).then(function(response){
				console.log(response);
				$scope.postdetail.comment=response.data;
				//console.log("commentbypostid", response);
				console.log($scope.postdetail);
			});
		}
	}]);
	
	
	//,'$route','$filter',$route,$filter
	app.controller('WriteNewCssPseudoController',['$scope','ApiService','$routeParams','$rootElement','$location', function($scope,ApiService,$routeParams,$rootElement,$location){
		$scope.submitCssPseudo = function(newPost){
			console.log(newPost);
			ApiService.writeCssPseudoPost(newPost).then(function(response){
				console.log(response.data);
				$scope.newPost='';
			});
			$scope.newPost.date = document.getElementById('date').innerText;
			$scope.newPost.time = document.getElementById('time').innerText;
			
			$location.url("/csspseudo");
		};
	}]);
	app.controller('UpdateCssPseudoController',['$scope','ApiService','$routeParams',function($scope,ApiService,$routeParams){
		
		$scope.updatepost =[];
		var id = $routeParams._id;
		ApiService.fetchCssPseudoPostByIdForUpdate(id).then(function(response){
			console.log(response);
			$scope.updatepost=response.data;
		});
		
		$scope.updateCssPseudo = function(post){
			console.log(post);
			ApiService.updateCssPseudoPost(id,post).then(function(response){
				console.log(response.data);
				$scope.post={};
			});
			$location.url("/csspseudo");
		};
	}]);
	app.controller('DeleteCssPseudoController',['$scope','ApiService','$routeParams',function($scope,ApiService,$routeParams){
		$scope.deletepost=[];
		var id = $routeParams._id;
		ApiService.fetchCssPseudoPostByIdForDelete(id).then(function(response){
			console.log(response);
			$scope.deletepost=response.data;
		});
		
		$scope.deleteCssPseudo = function(post){
			console.log(post);
			ApiService.deleteCssPseudoPost(id,post).then(function(response){
				console.log(response.data);
				$scope.post={};
			});
			//1
			//$location.path("/csspseudo");
			//2
			$location.url("/csspseudo");
		};
	}]);
		
	
	app.service('ApiService', ['$http', function ($http) {
		this.fetchCssPseudoPosts = function(){
			return $http.get('/api/csspseudo');
		};
		this.fetchCssPseudoPostById = function(_id){
			return $http.get('/api/csspseudo/'+_id);
		};
		this.writeCssPseudoPost  = function(formdata){
			return $http.post('/api/writecsspseudo',formdata);
		};
		this.fetchCssPseudoPostByIdForUpdate = function(_id){
			return $http.get('/api/updatecsspseudo/'+_id);
		};
		this.updateCssPseudoPost = function(_id,updatedata){
			return $http.post('/api/updatecsspseudo/'+_id,updatedata);
		};
		this.fetchCssPseudoPostByIdForDelete=function(id){
			return $http.get('/api/deletecsspseudo/'+id);
		};
		this.deleteCssPseudoPost = function(_id,deletedata){
			return $http.post('/api/deletecsspseudo/'+_id,deletedata);
		};
		
		

		this.writeCssPseudoComment  = function(commentdata){
			return $http.post('/api/csspseudocomment',commentdata);
		};
		this.fetchCssPseudoCommentsByPostId = function(_id){
			return $http.get('/api/csspseudocomment/'+_id);
		}
		
		
		this.insertUser = function(userdata){
			return $http.post('/api/insertusers',userdata);
		};
	}]);

})();