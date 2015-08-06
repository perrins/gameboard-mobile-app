// Gameboard Mobile Angular App

angular.module("gameboard", [
	"ionic",
	"ngCordova",
    "ngMessages",
    "ngCookies",
	"mgo-angular-wizard",
	"gameboard.directives",
	"gameboard.controllers",

	"gameboard.board.controllers",

    "gameboard.boards.genres",
    "gameboard.boards.games",
    "gameboard.boards.categories",
    "gameboard.member.search",
    "gameboard.register",

    "gameboard.member.favourites",

	"gameboard.controllers.member",
	"gameboard.search.controllers",
	"gameboard.board.services",
	"gameboard.member.services",
	"gameboard.search.services",
	"gameboard.settings"
])

// Handle Status Bar Styling on Load
	.run(function ($ionicPlatform, $rootScope, $timeout) {

		// Hide Splash Screen
		// Handle Loading of the Runtime
		$ionicPlatform.ready(function () {

            console.log("ready ...");

 			// Hide the Splash Screen after banner Add has been created
			console.log("about to hide splash screen");
			console.log(navigator.splashscreen);
            if (navigator.splashscreen) {
            	console.log("hiding slpash screen");
                navigator.splashscreen.hide();
            }
			// Unhide , this probably needs a nice animation
			//angular.element("#main").removeClass("hidden");

  			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		    // for form inputs)
		    if (window.cordova && window.cordova.plugins.Keyboard) {
		      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		      cordova.plugins.Keyboard.disableScroll(true);

		    }

		    if (window.StatusBar) {
		      // org.apache.cordova.statusbar required
		      StatusBar.styleDefault();
		    }

           

        });

	})

	.config(function ($ionicConfigProvider) {

		//$ionicConfigProvider.views.maxCache(0);
		// note that you can also chain configs
		//$ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');

	})

	.constant("ACCESS", {
		GENRES: "/genres", //IBM Data
		GAMES: "/games", //IBM Data
		CATEGORIES: "/categories", //IBM Data
		BOARD: "/videos/board", // IBM CloudCode with Cloudant
		YOUR_VIDEOS: "/videos/yours", // IBM CloudCode with YouTube API
		YT_VIDEO_DETAIL: "/youtube/video", // IBM CloudCode with YouTube API
		MEMBERS: "/members", // IBM CloudCode and Cloudant
		SEARCH_MEMBERS: "/members/search",
		REGISTER: "/members/register",
		FAVOURITES: "/favourites", // IBM Cloudant
		BOOKMARKS: "/bookmarks",
		NOTIFICATIONS: "/notifications",
		SEARCH_VIDEOS: "/search", // IBM CloudCode with Cloudant
		VIDEOS: "/videos", // IBM CloudCode with Cloudant
		YOUTUBE_YOURS: "/youtube/videos",
		EMBED: "http://www.youtube.com/embed/",
        WATCH: "http://www.youtube.com/watch?v=",
		PRIZES: "/prizes",
        SOCIAL_AUTH_CODE : "/social/authcode",
        SOCIAL_AUTH : "/social/authorise"
	})

	// Configure the Angular Rules
	.config(function ($stateProvider, $urlRouterProvider) {

		// Init Function
		var init = { 

				IBMBluemix : function ($rootScope,$q,$http) {

					// Create a defer
					var defer = $q.defer();

					// Check if we have been
					if ($rootScope.initialized === true) {
						defer.resolve($rootScope.IBMBluemix);
					} else {

						// Lets load the Configuration from the bluelist.json file
						$http.get("./config.json").success(function (config) {
							$rootScope.config = config;

							// Initialise the SDK
							// TMD: Does this initialize function not return a proper promise?
							IBMBluemix.initialize(config).done(function () {

								// Let the user no they have logged in and can do some stuff if they require
								console.log("Sucessful initialisation with Application : " + IBMBluemix.getConfig().getApplicationId());

								// Initialize the Service
								var data = IBMData.initializeService(),
									cc = IBMCloudCode.initializeService();

								// Make it handle Local serving if set to try and local url set
								if (_.has(config, "localserver") && config.localserver ) {
									// Set the Origin to Local Server for testing
									cc.setBaseUrl(config.local);
								}

								// Let the user no they have logged in and can do some stuff if they require
								console.log("Successful initialisation Services ...");

								// Keep it Global
								$rootScope.initialized = true;
								$rootScope.IBMBluemix = IBMBluemix;

								// Return the Data
								defer.resolve(IBMBluemix);

							}, function (response) {
								// Error
								console.log("Error:", response);
								defer.reject(response);
							});
						});
					}

					return defer.promise;
				}

			};


		// Ionic uses AngularUI Router which uses the concept of states
		// Learn more here: https://github.com/angular-ui/ui-router
		// Set up the various states which the app can be in.
		// Each state"s controller can be found in controllers.js

		// Splash -> Intro -> Login -> Main
		// Splash -> Login -> Main

		// Looking to do Splash in Native, and keep call back all IOS/Android

		$stateProvider
			.state("signin", {
				url: "/signin",
				templateUrl: "templates/signin.html",
				controller: "SignInCtrl",
				resolve : init
			})
			.state("intro", {
				url: "/intro",
				templateUrl: "templates/intro.html",
				controller: "IntroCtrl"
			})

			.state("board", {
				url: "/board",
				abstract: true,
				templateUrl: "templates/menu.html",
				controller: "MainCtrl",
				resolve : init
			})

			.state("board.videos", {
				url: "/videos/:bid",
				views: {
					"menuContent": {
						templateUrl: "templates/videos.html",
						controller: "BoardCtrl"
					}
				}
			})
			.state("board.video", {
				url: "/video/:uuid",
				views: {
					"menuContent": {
						templateUrl: "templates/video-detail.html",
						controller: "VideoCtrl"
					}
				}
			})

            .state("board.bookmarks", {
				url: "/bookmarks",
				views: {
					"menuContent": {
						templateUrl: "templates/bookmarks.html",
						controller: "BookmarksCtrl"
					}
				}
			})
			.state("board.notifications", {
				url: "/notifications",
				views: {
					"menuContent": {
						templateUrl: "templates/notifications.html",
						controller: "NotificationsCtrl"
					}
				}
			})
			.state("board.yourvideos", {
				url: "/yourvideos",
				views: {
					"menuContent": {
						templateUrl: "templates/yourvideos.html",
						controller: "YourVideosCtrl"
					}
				}
			})
			.state("board.youtube", {
				url: "/youtube",
				views: {
					"videoContent": {
						templateUrl: "templates/video-list.html",
						controller: "SelectVideoCtrl"
					}
				}
			})
			.state("board.ytdetail", {
				url: "/ytdetail/:id",
				views: {
					"menuContent": {
						templateUrl: "templates/yt-video-detail.html",
						controller: "YTVideoDetailCtrl"
					}
				}
			})
			.state("board.prizes", {
				url: "/prizes",
				views: {
					"menuContent": {
						templateUrl: "templates/prizes.html",
						controller: "PrizesCtrl"
					}
				}
			})
			.state("board.search", {
				url: "/search",
				views: {
					"menuContent": {
						templateUrl: "templates/search.html",
						controller: "SearchCtrl"
					}
				}
			})
			.state("board.settings", {
				url: "/settings",
				views: {
					"menuContent": {
						templateUrl: "templates/settings.html",
						controller: "SettingsCtrl"
					}
				}
			})
			.state("board.about", {
				url: "/about",
				views: {
					"menuContent": {
						templateUrl: "templates/about.html",
						controller: "AboutCtrl"
					}
				}
			});

		// Default to Home
		$urlRouterProvider.otherwise("signin");
	});
