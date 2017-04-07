var iSongCollect = angular.module('SongCollect', ['ngRoute']);

iSongCollect.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: '/views/login.html',
            controller: 'LoginController',
            controllerAs: 'lc'
        })
        .otherwise({
            redirectTo: 'lc'
        });
}]);
