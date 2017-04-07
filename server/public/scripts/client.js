var app = angular.module('SongCollect', ['ngRoute', 'firebase']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: '/views/login.html',
            controller: 'LoginController',
            controllerAs: 'lc'
        })
        .otherwise({
            redirectTo: 'login'
        });
}]);
