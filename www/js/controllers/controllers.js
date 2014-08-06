angular.module('gameboard.controllers', [])

.controller('MainCtrl', function($rootScope, $scope, $location, $state, $ionicSideMenuDelegate, $ionicViewService, InitBluemix) {

    // Init Mobile Cloud SDK and wait for it to configure itself
    // Once complete keep a reference to it so we can talk to it later
    if (!$rootScope.IBMBluemix) {
        InitBluemix.init().then(function() {
            $rootScope.IBMBluemix = IBMBluemix;
        });
    }

    // Prepare User for Display
    if ($rootScope.user) {

        $scope.user = $rootScope.user;
        $scope.member = $rootScope.member;

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
        // TODO : REMOVE AFTER DEBUGGING
        $state.go('signin');

    }

    $scope.logout = function() {
        console.log("logout");
    }

})

// Sign In Controller, navigate to Intro 
.controller('SignInCtrl', function($rootScope, $state, $scope, InitBluemix, MembersService, $ionicLoading) {

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

        // Lets load the Videos for the Youtube Channel
        $ionicLoading.show({
            template: 'Authenticating...'
        });

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
                IBMBluemix.setSecurityToken(google.access_token, "GOOGLE");

                // Lets get some information about the User
                google.me()
                    .done(function(user) {

                        $rootScope.user = user;

                        // Get a Member
                        MembersService.getMember(user.raw.id).then(function(member) {

                            $ionicLoading.hide();
                            $rootScope.user.registered = true;
                            $rootScope.member = member;

                            // Havigate to the Board View
                            $state.go('intro');

                        }, function(err) {

                            $ionicLoading.hide();
                            $rootScope.user.registered = false;
                            $state.go('intro');
                        });



                    })
                    .fail(function(err) {
                        $ionicLoading.hide();
                    });
                //use result.access_token in your API request 
                //or use result.get|post|put|del|patch|me methods (see below)

                // Navigate to the Home page

            })
            .fail(function(err) {
                //handle error with err
                $ionicLoading.hide();
            });

    }

})

// A simple controller that shows a tapped item's data
.controller('RegisterCtrl', function($ionicScrollDelegate, $rootScope, $state, $scope, MembersService, WizardHandler,$ionicPopup) {

    // Manage the Registration Process
    $scope.user = $rootScope.user;

    // Test Data
    $scope.member = {

        muuid: $scope.user.raw.id,
        user: $scope.user,
        gametag: "AmissScientist",
        country: "UK",
        location: "NN110NZ",
        age: "46",
        address1: "27 The Haystack",
        address2: "Lang Farm",
        towncity: "Daventry",
        postcode: "NN110NZ",
        telephone: "07718149239",
        platform: 'PS',
        registered : true

    };

    // Move the Name section
    $scope.next = function() {

        // VALIDATE THE FORM

        $ionicScrollDelegate.scrollTop();
        WizardHandler.wizard().next();

    };


    // Move the Name section
    $scope.back = function() {

        $ionicScrollDelegate.scrollTop();
        WizardHandler.wizard().previous();

    };

    // Handle Social Integration, need the FB, Twitter details to be able to 
    // Post information of videos that have been added.
    $scope.facebook = function() {

        // ADD CODE TO AUTHENTICATE Gameboard app with Facebook

    };

    $scope.twitter = function() {

    };

    debugger;

    var self = this;
    self["rootScope"] = $rootScope;

    // Finish the Wizard 
    $scope.register = function(member) {

        // Validate Member object before sending it off to be stored

        debugger;
        // Lets Validate and Add any other meta data we need
        MembersService.registerMember(member).then(function(success) {

            debugger;
            // Go to the Final Wizard Page
            WizardHandler.wizard().next();

        }, function(err) {
            var alertPopup = $ionicPopup.alert({
                title: 'Register',
                template: 'Failed to register your details, please try again later'
            });
        });

    };


    // Finish the Wizard 
    $scope.finish = function() {
        $state.go('intro');
    };

    // Handle the the cancel
    $scope.cancel = function() {
        $state.go('intro');
    }

})

// A simple controller that shows a tapped item's data
.controller('AccountCtrl', function($ionicScrollDelegate, $rootScope, $state, $scope, MembersService, WizardHandler) {

    // Manage the Registration Process
    $scope.user = $rootScope.user;
    $scope.member = $rootScope.member;

    // If they are not registered then take them to registration
    if (!$scope.registered) {
        $state.go('register');
    }

    // Move the Name section
    $scope.save = function() {
        // Update Account Details

    };

    // Handle the the cancel
    $scope.back = function() {
        $state.go('intro');
    }

})


// A simple controller that shows a tapped item's data
.controller('AboutCtrl', function($rootScope, $scope, Settings) {

    $scope.name = "Screaming Foulup";
    $scope.version = "0.0.1";

    /*
    $scope.introChange = function(change){
        Settings.set('LOADSCREEN',change);
    }
    */

    // Check
    $scope.intro = Settings.get('LOADSCREEN');

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
        $state.go('board.genres');
        //$state.go('board.board',{bid:1001});

    };

    // If we have displayed the screen before lets go to Main
    if (Settings.get('LOADSCREEN')) {

        // Clear the Back stack
        $ionicViewService.nextViewOptions({
            disableBack: true
        });

        $state.go('board.genres');
        //$state.go('board.board',{bid:1001});
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
                    if (_.has(config, "local")) {
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
