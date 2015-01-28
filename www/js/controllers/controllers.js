angular.module("gameboard.controllers", [])

.controller("MainCtrl", function($rootScope, $scope, $location, $state, $ionicSideMenuDelegate, $ionicHistory, InitBluemix) {
            
    // Init Mobile Cloud SDK and wait for it to configure itself
    // Once complete keep a reference to it so we can talk to it later
    InitBluemix.init().then(function() {
        // TMD: IBMBluemix not defined?
        // MJP: IBMBluemix is a global name space 
        $rootScope.IBMBluemix = IBMBluemix;
    });

    // Prepare User for Display
    if ($rootScope.user) {

        // So we have a User lets loo
        $scope.user = $rootScope.user;
        $scope.member = $rootScope.member;

        $scope.members = 2302243;
        $scope.notifications = 6;
        $scope.videos = 3;
        $scope.favourites = 5;

        // Clear the Back stack
        $ionicHistory.nextViewOptions({
            disableBack: true,
        });

    } else {

        // Clear the Back stack
        $ionicHistory.nextViewOptions({
            disableBack: true,
            disableAnimate: true
        });

    }
 
    $scope.logout = function() {

        // Clear the Back stack
        $ionicHistory.nextViewOptions({
            disableBack: true,
        });

        // Remove the User State
        $rootScope.user = null;
        $rootScope.member = null;

        // Do an OAuth Logout Here
        $state.go("signin");

    };

})

// Sign In Controller, navigate to Intro
.controller("SignInCtrl", function($cordovaNetwork,$ionicModal,$ionicHistory,$rootScope, $state, $scope, $http,InitBluemix, MembersService, $ionicLoading,Settings) {

    // Init Mobile Cloud SDK and wait for it to configure itself
    // Once complete keep a reference to it so we can talk to it later
    InitBluemix.init().then(function() {
        // Init the Main
        $rootScope.IBMBluemix = IBMBluemix;
        // Make the World visible
        angular.element("#main").removeClass("hidden");

    });

   // Create our modal
    $ionicModal.fromTemplateUrl('templates/connectivity.html', function(modal) {
        $rootScope.connectivity = modal;
    }, {
        scope: $rootScope,
        animation: 'slide-in-up',
        focusFirstInput: true
    });

    $rootScope.wifi = function() {
        // Reverse the Paint Bug
        $rootScope.connectivity.show();
    };

    $scope.wifi = function() {
        // Reverse the Paint Bug
        $rootScope.connectivity.show();
    };

    $scope.cancelWifi = function() {
        // Reverse the Paint Bug
        $rootScope.connectivity.hide();
    };

    $rootScope.cancelWifi = function() {
        // Reverse the Paint Bug
        $rootScope.connectivity.hide();
    };

    // listen for the event in the relevant $scope
    $rootScope.$on('gb-error', function (event, err) {

        if (_.isObject(err) && _.has(err,"info") ) {

            // Show Connectivity Error 
            if(err.info.status == "error") {
                $rootScope.wifi();
            }

        }

    });

     // Clear the Back stack
    $ionicHistory.nextViewOptions({
        disableBack: true,
        disableAnimate: true
    });

    // Signon to the App
    $scope.signon = function() {


        // Check if we connecting to the world !
        /*
        if ($cordovaNetwork.isOffline()) {
            $rootScope.wifi();
            return;
        }*/

        // Lets load the Videos for the Youtube Channel
        $ionicLoading.show({
            template: "Authenticating..."
        });

        var nextView = function() {

            // Clear the Back stack
            $ionicHistory.nextViewOptions({
                disableBack: true
            });

             // If we have displayed the screen before lets go to Main
            if (!Settings.get("INTRO")) {
                $state.go("board.genres");
                //$state.go("board.videos",{bid:1001});
                //$state.go("board.search");
            } else {
                $state.go("intro");
            }

        }

        // Check if we are in local testing mode and then fake a user 
        // and go to the Intro Views.
        if ($rootScope.config.localsecurity || typeof OAuth == 'undefined' ) {

            $rootScope.user = {   
                                "id"      : "1292030202022",
                                "gametag" : "lolperrins123",
                                "avatar"  : "img/avatar.png",
                                "firstname"    : "Joe",
                                "lastname" : "Perrins",
                                "registered":false
                              };
            $rootScope.member = {
                "muuid"   : 282992902,
                "gametag" : "lolperrins123",
                "name"    : "Joe",
                "surname" : "Perrins",
                "memberSince" : "01/01/2014",
                "avatar"  : "img/avatar.png",
                "bio"     : "The best minecraft player on the planet",
                "prizes"  : "£23,456",
                "views"   : "4,343",

            };


            // Hide Message
            $ionicLoading.hide();

            // Havigate to the Board View
            nextView();         

            return;
        }

        // Initialize Security
        // Initialize the OAuth settings
        OAuth.initialize($rootScope.config.security);

        var failFunc = function(err) {
            // TMD: isn't this covered by the second arg to 'then' ?
            $ionicLoading.hide();
        };

        // Handle the Cordova OAuth experience
        OAuth.popup("google", {
            cache: true
        }).done(function(google) {
            // Save the context so we can
            $rootScope.google = google;

            // Set the Security Token on IBM Bluemix
            IBMBluemix.setSecurityToken(google.access_token, IBMBluemix.SecurityProvider.GOOGLE);

            // Lets get some information about the User
            google.me().done(function(user) {
                $rootScope.user = user;

                // Default the Header to the ID of the authenicated user
                //$http.defaults.headers.common["X-GB-ID"] = $rootScope.user.raw.id;

                // Get a Member
                MembersService.getMember(user.raw.id).then(function(member) {
                    $ionicLoading.hide();
                    $rootScope.user.registered = true;
                    $rootScope.member = member;

                    // Move to the Next View
                    nextView();


                }, function(err) {

                    $ionicLoading.hide();
                    $rootScope.user.registered = false;
                    $rootScope.user.avatar = "img/avatar.png";

                    // Move to the Next view
                    nextView();
                });

            }).fail(failFunc);
        }).fail(failFunc);
    };

})

// A simple controller that shows a tapped item"s data
.controller("RegisterCtrl", function($ionicScrollDelegate, $rootScope, $state, $scope, MembersService, WizardHandler, $ionicPopup) {

    // Check if user is defined
    if (!$rootScope.user) {
        $state.go("signin");
    }

    // Manage the Registration Process
    $scope.user = $rootScope.user;

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

    $scope.twitter = function() {};

    // Finish the Wizard
    $scope.register = function(member) {

        // Lets Validate and Add any other meta data we need
        MembersService.registerMember(member).then(function(member) {
            // Get the Global Scope
            var appscope = angular.element("body").injector().get("$rootScope");
            appscope.user.registered = true;

            // Go to the Final Wizard Page
            WizardHandler.wizard().next();

        }, function(err) {
            var alertPopup = $ionicPopup.alert({
                title: "Register",
                template: "Failed to register your details, please try again later"
            });
        });

    };

    // Finish the Wizard
    $scope.finish = function() {
        $state.go("intro");
    };

    // Handle the the cancel
    $scope.cancel = function() {
        $state.go("intro");
    };
})

// A simple controller that shows a tapped item"s data
.controller("AccountCtrl", function($ionicScrollDelegate, $ionicLoading, $rootScope, $state, $scope, MembersService, WizardHandler) {

    // Manage the Registration Process
    var user = $rootScope.user;

    // No User lets navigate
    if (!user) {
        $state.go("signin");
        return;
    }

    // If they are not registered then take them to registration
    if (!user.registered) {
        $state.go("register");
        return;
    }

    // Lets load the Videos for the Youtube Channel
    $ionicLoading.show({
        template: "Getting your membership..."
    });

    // Lets Get the Member information
    MembersService.getMember(user.raw.id).then(function(member) {

        $ionicLoading.hide();
        $rootScope.user.registered = true;
        $rootScope.member = member.doc;
        $scope.member = member.doc;

        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }, function(err) {

        var alertPopup = $ionicPopup.alert({
            title: "Loading Register",
            template: "Failed to register your details, please try again later"
        });

        return;
    });

    // Move the Name section
    $scope.save = function() {
        // Update Account Details

    };

    // Handle the the cancel
    $scope.cancel = function() {
        $state.go("intro");
    };
})


// A simple controller that shows a tapped item"s data
.controller("AboutCtrl", function($rootScope, $scope, Settings) {

    $scope.name = "Screaming Foulup";
    $scope.version = "0.0.1";

    // Check
    $scope.intro = Settings.get("INTRO");

    $scope.introChange = function(intro){

        // Set the Intro Load Screen
        Settings.set("INTRO", intro);

    };


})

.controller("IntroCtrl", function($scope, $state, $ionicSlideBoxDelegate,  $ionicHistory, Settings) {

    // Clear the Back stack
    $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
    });

    // Called to navigate to the main app
    $scope.startApp = function() {

        // Clear the Back stack
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });

        // Lets set that we have been through the Load Screen and Now no longer need to display it
        Settings.set("INTRO", false);

        // Havigate to the Board View
        $state.go("board.genres");
        //$state.go("board.board",{bid:1001});
    };

    // If we have displayed the screen before lets go to Main
    if (!Settings.get("INTRO")) {
        // Clear the Back stack
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $state.go("board.genres");
        //$state.go("board.board",{bid:1001});
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
.factory("InitBluemix",
    function($rootScope, $http, $q) {
        function init() {

            // Create a defer
            var defer = $q.defer();

            // Check if we have been
            if($rootScope.initialized === true) {
                defer.resolve();
            } else {

                // Lets load the Configuration from the bluelist.json file
                $http.get("./config.json").success(function(config) {
                    $rootScope.config = config;

                    // Initialise the SDK
                    // TMD: Does this initialize function not return a proper promise?
                    IBMBluemix.initialize(config).done(function() {

                        // Let the user no they have logged in and can do some stuff if they require
                        console.log("Sucessful initialisation with Application : " + IBMBluemix.getConfig().getApplicationId());

                        // Initialize the Service
                        var data = IBMData.initializeService(),
                            cc = IBMCloudCode.initializeService();

                        // Make it handle Local serving if set to try and local url set
                        if (config.localserver && _.has(config, "local")) {
                            // Set the Origin to Local Server for testing
                            cc.setBaseUrl(config.local);
                        }

                        // Let the user no they have logged in and can do some stuff if they require
                        console.log("Sucessful initialisation Services ...");

                        $rootScope.initialized = true;

                        // Return the Data
                        defer.resolve();

                    }, function(response) {
                        // Error
                        console.log("Error:", response);
                        defer.reject(response);
                    });

                    $rootScope.config = config;
                });
                }

            return defer.promise;
        }

        return {
            init: function() {
                return init();
            }
        };
    })


// A simple controller that shows a tapped item"s data
.controller("PrizesCtrl", function($rootScope, $scope, Settings) {

    // Manage the Prizes for Specific Boards and Show what is on offer


});



