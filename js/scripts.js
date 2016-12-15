var bestUI = angular.module('bestUI', ['ngRoute']).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
}]);

bestUI.controller('BestUIController', ['$scope', function($scope) {
    $scope.greeting = 'Hola!';
}]);
