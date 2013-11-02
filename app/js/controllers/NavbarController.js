'use strict';

angular.module('NumidiApp').controller('NavbarController', ['$scope', '$location', function NavbarController($scope, $location) {
  $scope.routeIs = function(routeName) {
    return $location.path() === routeName;
  };
}]);
