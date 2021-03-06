// Declare app level module which depends on views, and components
angular.module('joint.ctrl',[]);
angular.module('joint.services',[]);
angular.module('joint.directives',[]);

angular.module('joint', [
  'ui.router',    
  'ui.bootstrap',
  'ui.select',
  'restangular',
  'ngBootbox',
  'joint.ctrl',
  'joint.services',
  'joint.directives',
  'ContentEditable',
  'LocalStorageModule',
  'irontec.simpleChat',
  'blueimp.fileupload',
  'youtube-embed'
])
.config(['$httpProvider',
function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? $.param(data) : data;
  }];
}])

.config(function(RestangularProvider){
	RestangularProvider.setBaseUrl('../stuff/api-mockup.php');
	RestangularProvider.setMethodOverriders(['DELETE','PUT']);
	RestangularProvider.addResponseInterceptor(function(data) {
		if(data.status) {
			return data.data;
		} else {
			var errorMsg = false;
			if(data.error.msg) {
				errorMsg = data.error.msg;
			}
			if(!errorMsg && data.error) {
				errorMsg = data.error;
			}
			if(!errorMsg) {
				errorMsg = 'Unknown error';
			}
			console.log('API error: '+errorMsg);
			toastr.error(errorMsg,'API error');
		}
	});
	RestangularProvider.addRequestInterceptor(function(data) {
		return angular.fromJson(angular.toJson(data));
	});
})

.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setNotify(true, true);
})

.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/me");
  //
  // Now set up the states
  $stateProvider
  	.state('login', {
  		url: "/login",
  		templateUrl: "app/views/login.html"
  	})
    .state('me', {
      url: "/me",
      templateUrl: "app/views/map.html"    
    })
    .state('me.objects', {
      url: "/objects/:objectId"
    })
    .state('me.objects.edit', {
    	url: "/edit",
    	params: {
    		editObject: true
    	}
    })
    .state('friends', {
      url: "/friends/:friendId/objects/:objectId",
      templateUrl: "app/views/map.html"
    })
    .state('me.settings', {
    	url: "/settings",
    	templateUrl: "app/views/settings.html"
    });
});