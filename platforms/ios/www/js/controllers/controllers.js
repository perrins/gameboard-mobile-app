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

})

.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate,$ionicViewService,Settings) {

  // Called to navigate to the main app
  $scope.startApp = function() {

    // Clear the Back stack
    $ionicViewService.nextViewOptions({
        disableAnimate: true,
        disableBack: true
    }); 

    // Lets set that we have been through the Load Screen and Now no longer need to display it
    Settings.set('LOADSCREEN',false);

    // Havigate to the Board View
    $state.go('board.genres');
    
  };

  // If we have displayed the screen before lets go to Main
  if(Settings.get('LOADSCREEN')) {
    $state.go('board.genres');
  }

  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
})

.controller('MainCtrl', function($scope, $state) {
  console.log('MainCtrl');
  
  $scope.toIntro = function(){
    $state.go('intro');
  }
});



