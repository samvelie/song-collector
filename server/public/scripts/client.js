var app = angular.module('SongCollect', ['ngRoute', 'firebase', 'ngQuill', 'ngSanitize', 'angularjs-dropdown-multiselect', 'ui.bootstrap']);

// angular.module('angularFilepicker', [])
app.service('angularFilepicker', function($window){
	return $window.filepicker;
});

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: '/views/login.html',
            controller: 'LoginController',
            controllerAs: 'lc'
        })
        .when('/new', {
            templateUrl: '/views/new-song.html',
            controller: 'NewSongController',
            controllerAs: 'nsc'
        })
        .when('/collection', {
            templateUrl: '/views/collection-view.html',
            controller: 'CollectionController',
            controllerAs: 'cc'
        })
        .when('/print', {
            templateUrl: '/views/print-view.html',
            controller: 'PrintController',
            controllerAs: 'pc'
        })
				.when('/admin', {
						templateUrl: '/views/admin-view.html',
						controller: 'AdminController',
						controllerAs: 'ac'
				})
        .otherwise({
            redirectTo: 'login'
        });
        // API key for filepicker service
        // angularFilePicker.setKey('AIJdcA3UQs6mAMvmUvaTkz');

}]);
