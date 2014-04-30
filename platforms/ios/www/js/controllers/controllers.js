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

})

.controller('AppCtrl', function($scope) {
    
})


.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})


