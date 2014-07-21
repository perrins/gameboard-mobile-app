angular.module('gameboard.controllers', [])

.controller('MainCtrl', function($rootScope,$scope, $location, $state, $ionicSideMenuDelegate,$ionicViewService,InitBluemix) {

    // Init Mobile Cloud SDK and wait for it to configure itself
    // Once complete keep a reference to it so we can talk to it later
    if (!$rootScope.IBMBluemix) {
        InitBluemix.init().then(function() {
            $rootScope.IBMBluemix = IBMBluemix;
        });
    }

    // Prepare User for Display
    if($rootScope.user) {
      $scope.user = $rootScope.user;
      $scope.user.gametag = "AmissScientist";

        // Clear the Back stack
        $ionicViewService.nextViewOptions({
            disableBack: true,
        });

    } else {

        // Clear the Back stack
        $ionicViewService.nextViewOptions({
            disableBack: true,
            disableAnimate: true
        });

        // If we dont have a user then lets signon
        $state.go('signin');

    }

    $scope.logout = function() {
        console.log("logout");
    }

})

// Sign In Controller, navigate to Intro 
.controller('SignInCtrl', function($rootScope, $state, $scope, InitBluemix) {

    // Init Mobile Cloud SDK and wait for it to configure itself
    // Once complete keep a reference to it so we can talk to it later
    if (!$rootScope.IBMBluemix) {
        InitBluemix.init().then(function() {
            $rootScope.IBMBluemix = IBMBluemix;
        });
    }

    // Signon to the App
    $scope.signon = function() {
        console.log("Signon to the application");

        // Initialize Security
        // Initialize the OAuth settings
        OAuth.initialize($rootScope.config.security);

        // Handle the Cordova OAuth experience
        OAuth.popup('google', {
                cache: true
            })
            .done(function(google) {

                // Save the context so we can 
                $rootScope.google = google;

                // Set the Security Token on IBM Bluemix
                IBMBluemix.setSecurityToken(google.access_token,"GOOGLE");

                // Lets get some information about the User
                google.me()
                    .done(function(user) {

                        $rootScope.user = user;

                        console.log('Firstname: ', user.firstname);
                        console.log('Lastname: ', user.lastname);

                        // Havigate to the Board View
                        $state.go('intro');

                    })
                    .fail(function(err) {
                        //handle error with err
                    });
                //use result.access_token in your API request 
                //or use result.get|post|put|del|patch|me methods (see below)

                // Navigate to the Home page

            })
            .fail(function(err) {
                //handle error with err
            });

    }

})

// A simple controller that shows a tapped item's data
.controller('AboutCtrl', function($rootScope, $scope) {

    $scope.name = "Screaming Foulup";
    $scope.version = "0.1.0";

})

.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $ionicViewService, Settings) {

    // Called to navigate to the main app
    $scope.startApp = function() {

        // Clear the Back stack
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });

        // Lets set that we have been through the Load Screen and Now no longer need to display it
        Settings.set('LOADSCREEN', false);

        // Havigate to the Board View
//        $state.go('board.genres');
        $state.go('board.youtube');

    };

    // If we have displayed the screen before lets go to Main
    if (Settings.get('LOADSCREEN')) {

        // Clear the Back stack
        $ionicViewService.nextViewOptions({
            disableBack: true
        });

        //$state.go('board.genres');
        $state.go('board.youtube');
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

                $rootScope.config = config;

                // Initialise the SDK
                IBMBluemix.initialize(config).done(function() {

                    // Let the user no they have logged in and can do some stuff if they require
                    console.log("Sucessful initialisation with Application : " + IBMBluemix.getConfig().getApplicationId());

                    // Initialize the Service
                    var data = IBMData.initializeService();
                    var cc = IBMCloudCode.initializeService();

                    // Make it handle Local serving
                    if (_.has(config,"local")) {
                        // Set the Origin to Local Server for testing
                        cc.setBaseUrl(config.local);
                    }

                    // Let the user no they have logged in and can do some stuff if they require
                    console.log("Sucessful initialisation Services ...");

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
