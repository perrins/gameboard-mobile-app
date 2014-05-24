angular.module('gameboard.controllers', [])

.controller('MainCtrl', function($scope, $location,$state,$ionicSideMenuDelegate) {

    $scope.logout = function()
    {
        console.log("logout");
    }


})

// A simple controller that shows a tapped item's data
.controller('AboutCtrl', function($rootScope, $scope) {

        $scope.name = "Screaming Foulup";
        $scope.version = "0.1.0";

});


