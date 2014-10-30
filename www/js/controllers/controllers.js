angular.module("gameboard.controllers", [])

.controller("MainCtrl", function ($rootScope, $scope, $location, $state, $ionicSideMenuDelegate, $ionicViewService, InitBluemix) {

	// Init Mobile Cloud SDK and wait for it to configure itself
	// Once complete keep a reference to it so we can talk to it later
	if (!$rootScope.IBMBluemix) {
		InitBluemix.init().then(function () {
			// TMD: IBMBluemix not defined?
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
		//$state.go("signin");
	}

	$scope.logout = function () {
		console.log("logout");
	};

})

// Sign In Controller, navigate to Intro
.controller("SignInCtrl", function ($rootScope, $state, $scope, InitBluemix, MembersService, $ionicLoading) {

	// Init Mobile Cloud SDK and wait for it to configure itself
	// Once complete keep a reference to it so we can talk to it later
	if (!$rootScope.IBMBluemix) {
		InitBluemix.init().then(function() {
			// Init the Main
			$rootScope.IBMBluemix = IBMBluemix;
			// Make the World visible
			angular.element("#main").removeClass("hidden");
		});
	}

	// Signon to the App
	$scope.signon = function () {
		console.log("Signon to the application");

		// Lets load the Videos for the Youtube Channel
		$ionicLoading.show({
			template: "Authenticating..."
		});

		// Just Jump Over Security if
		$state.go("intro");
		return; // TMD: I assume this is for the bypassing of OAuth? Because code below will never be called.

		// Initialize Security
		// Initialize the OAuth settings
		OAuth.initialize($rootScope.config.security);

		var failFunc = function (err) {
			// TMD: isn't this covered by the second arg to 'then' ?
			$ionicLoading.hide();
		};

		// Handle the Cordova OAuth experience
		OAuth.popup("google", {
			cache: true
		}).done(function (google) {
			// Save the context so we can
			$rootScope.google = google;

			// Set the Security Token on IBM Bluemix
			IBMBluemix.setSecurityToken(google.access_token, "GOOGLE");

			// Lets get some information about the User
			google.me().done(function (user) {
				$rootScope.user = user;

				// Get a Member
				MembersService.getMember(user.raw.id).then(function (member) {
					$ionicLoading.hide();
					$rootScope.user.registered = true;
					$rootScope.member = member;

					// Havigate to the Board View
					$state.go("intro");
				}, function (err) {
					$ionicLoading.hide();
					$rootScope.user.registered = false;
					$rootScope.user.avatar = "img/avatar.png";
					$state.go("intro");
				});
			}).fail(failFunc);
		}).fail(failFunc);
	};

})

// A simple controller that shows a tapped item"s data
.controller("RegisterCtrl", function ($ionicScrollDelegate, $rootScope, $state, $scope, MembersService, WizardHandler, $ionicPopup) {

	// Check if user is defined
	if (!rootScope.user){
		$state.go("signin");
	}

	// Manage the Registration Process
	$scope.user = $rootScope.user;

	// Move the Name section
	$scope.next = function () {
		// VALIDATE THE FORM
		$ionicScrollDelegate.scrollTop();
		WizardHandler.wizard().next();
	};

	// Move the Name section
	$scope.back = function () {
		$ionicScrollDelegate.scrollTop();
		WizardHandler.wizard().previous();
	};

	// Handle Social Integration, need the FB, Twitter details to be able to
	// Post information of videos that have been added.
	$scope.facebook = function () {
		// ADD CODE TO AUTHENTICATE Gameboard app with Facebook
	};

	$scope.twitter = function () {};

	// Finish the Wizard
	$scope.register = function (member) {
		// Lets Validate and Add any other meta data we need
		MembersService.registerMember(member).then(function (member) {
			// Get the Global Scope
			var appscope = angular.element("body").injector().get("$rootScope");
			appscope.user.registered = true;

			// Go to the Final Wizard Page
			WizardHandler.wizard().next();

		}, function (err) {
			var alertPopup = $ionicPopup.alert({
				title: "Register",
				template: "Failed to register your details, please try again later"
			});
		});

	};

	// Finish the Wizard
	$scope.finish = function () {
		$state.go("intro");
	};

	// Handle the the cancel
	$scope.cancel = function () {
		$state.go("intro");
	};
})

// A simple controller that shows a tapped item"s data
.controller("AccountCtrl", function ($ionicScrollDelegate, $ionicLoading, $rootScope, $state, $scope, MembersService, WizardHandler) {

	// Manage the Registration Process
	var user = $rootScope.user;

	// No User lets navigate
	if(!user) {
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
	MembersService.getMember(user.raw.id).then(function (member) {
		$ionicLoading.hide();
		$rootScope.user.registered = true;
		$rootScope.member = member;
		$scope.member = member;

		if (!$scope.$$phase) {
			$scope.$apply();
		}
	}, function (err) {
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
.controller("AboutCtrl", function ($rootScope, $scope, Settings) {

	$scope.name = "Screaming Foulup";
	$scope.version = "0.0.1";

	/*
	$scope.introChange = function(change){
		Settings.set("LOADSCREEN",change);
	}
	*/

	// Check
	$scope.intro = Settings.get("LOADSCREEN");

})

.controller("IntroCtrl", function ($scope, $state, $ionicSlideBoxDelegate, $ionicViewService, Settings) {

	// Called to navigate to the main app
	$scope.startApp = function () {
		// Clear the Back stack
		$ionicViewService.nextViewOptions({
			disableAnimate: true,
			disableBack: true
		});

		// Lets set that we have been through the Load Screen and Now no longer need to display it
		Settings.set("LOADSCREEN", false);

		// Havigate to the Board View
		$state.go("board.genres");
		//$state.go("board.board",{bid:1001});
	};

	// If we have displayed the screen before lets go to Main
	if (Settings.get("LOADSCREEN")) {
		// Clear the Back stack
		$ionicViewService.nextViewOptions({
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
	function ($rootScope, $http, $q) {
		function init() {
			// Create a defer
			var defer = $q.defer();

			// Lets load the Configuration from the bluelist.json file
			$http.get("./bluemix.json").success(function (config) {
				$rootScope.config = config;

				// Initialise the SDK
				// TMD: Does this initialize function not return a proper promise?
				IBMBluemix.initialize(config).done(function () {

					// Let the user no they have logged in and can do some stuff if they require
					console.log("Sucessful initialisation with Application : " + IBMBluemix.getConfig().getApplicationId());

					// Initialize the Service
					var data = IBMData.initializeService(),
						cc = IBMCloudCode.initializeService();

					// Make it handle Local serving
					if (_.has(config, "local")) {
						// Set the Origin to Local Server for testing
						cc.setBaseUrl(config.local);
					}

					// Let the user no they have logged in and can do some stuff if they require
					console.log("Sucessful initialisation Services ...");

					// Return the Data
					defer.resolve();

				}, function (response) {
					// Error
					console.log("Error:", response);
					defer.reject(response);
				});

				$rootScope.config = config;
			});

			return defer.promise;
		}

		return {
			init: function() {
				return init();
			}
		};
	});
