angular.module('gameboard.controllers', [])

.controller('MainCtrl', function($scope, $location,$state,$ionicSideMenuDelegate) {

	// Work out how to Hide the Back Arrow
    $scope.leftButtons = [{
        type: 'button-icon button-clear ion-navicon',
        tap: function(e) {
            $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
        }
    }];

    // Open the Menu Item Selected
    $scope.select = function(action) {

    	// Hide Side Menu
        $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
        // View the Top Level Menu Item
		$state.go(action);

    }

});

