angular.module('gameboard.controllers', [])

.controller('MainCtrl', function($scope, $location,$state,$ionicSideMenuDelegate) {

    // Init Mobile Cloud SDK and wait for it to configure itself
    // Once complete keep a reference to it so we can talk to it later
    if (!$rootScope.IBMBluemix) {
        InitBluemix.init().then(function() {
            $rootScope.IBMBluemix = IBMBluemix;
        });
    }

    $scope.logout = function()
    {
        console.log("logout");
    }

})

// Sign In Controller, navigate to Intro 
.controller('SignInCtrl', function($rootScope, $scope,InitBluemix) {

  // Init Mobile Cloud SDK and wait for it to configure itself
  // Once complete keep a reference to it so we can talk to it later
  if (!$rootScope.IBMBluemix) {
      InitBluemix.init().then(function() {
          $rootScope.IBMBluemix = IBMBluemix;
      });
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


/**
 * A Service that intialises MBaaS
 */
.factory('InitBluemix',
    function($rootScope, $http, $q) {

        function init() {

            // Create a defer
            var defer = $q.defer();

            // Lets load the Configuration from the bluelist.json file
            $http.get("./bluemix.json").success(function(config) {

                // Initialise the SDK
                IBMBluemix.initialize(config).done(function() {

                    // Let the user no they have logged in and can do some stuff if they require
                    console.log("Sucessful initialisation with Application : " + IBMBluemix.getConfig().getApplicationId());

                    // Initialize the Service
                    var data = IBMData.initializeService(); 
                    var cc = IBMCloudCode.initializeService();

                    // Make it handle Local serving
                    if (window.location.origin.indexOf('local') > 0) {

                        // Set the Origin to Local 
                        cc.setBaseurl(config.localhost);

                    }

                    // Let the user no they have logged in and can do some stuff if they require
                    console.log("Sucessful initialisation Services ..." );

                    // Return the Data
                    defer.resolve();

                }, function(response) {
                    // Error
                    console.log("Error:", response);
                    defer.reject(response);
                });

                $rootScope.config = config;;
            });

            return defer.promise;

        };

        return {
            init: function() {
                return init();
            }
        }

    });




