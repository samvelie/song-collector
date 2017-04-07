var app = angular.module('SongCollect', ['ngRoute', 'firebase']);

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
        .when('/edit/:index?', {
            templateUrl: '/views/edit-song.html',
            controller: 'EditSongController',
            controllerAs: 'esc'
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
        .otherwise({
            redirectTo: 'login'
        });
}]);
