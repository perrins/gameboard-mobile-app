// Gameboard Mobile Angular App

angular.module("gameboard", [
	"ionic",
	"ngCordova",
	"mgo-angular-wizard",
	"gameboard.directives",
	"gameboard.controllers",
	"gameboard.board.controllers",
	"gameboard.member.controllers",
	"gameboard.search.controllers",
	"gameboard.board.services",
	"gameboard.member.services",
	"gameboard.search.services",
	"gameboard.settings"
])

// Handle Status Bar Styling on Load
.run(function ($ionicPlatform, $rootScope) {

	// Hide Splash Screen
	// Handle Loading of the Runtime
	$ionicPlatform.ready(function () {
                                                  
        // Create A Banner Add when in Cordova 
		if(typeof(AdMob) != "undefined") {
			AdMob.createBanner( 
    		{
				adId: "ca-app-pub-2283171672459446/6963593212", 
				addSize : 'SMART_BANNER',
				position: AdMob.AD_POSITION.BOTTOM_CENTER, 
				autoShow: true ,
				success: function(){
					alert("Successfully created");
	    		},
			    error: function(){
			        alert('failed to create banner');
			    }
			});
		}

		// Hide the Splash Screen after banner Add has been created
		if(typeof(navigator.splashscreen) != "undefined") {
	        navigator.splashscreen.hide();
		}

		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			window.StatusBar.styleDefault();

		    // Init Mobile Cloud SDK and wait for it to configure itself
		    // Once complete keep a reference to it so we can talk to it later
		    InitBluemix.init().then(function() {
		    	$rootScope.IBMBluemix = IBMBluemix;
                                    
		    });	

		}
	});

})

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(0);

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
	SEARCH_MEMBERS : "/members/search",
	REGISTER : "/members/register",
	FAVOURITES: "/favourites", // IBM Cloudant
	BOOKMARKS : "/bookmarks",
	NOTIFICATIONS : "/notifications",
	SEARCH_VIDEOS: "/search", // IBM CloudCode with Cloudant
	VIDEOS: "/videos", // IBM CloudCode with Cloudant
	YOUTUBE_YOURS : "/youtube/videos",
	EMBED : "http://www.youtube.com/embed/",
	PRIZES : "/prizes"
})

// Configure the Angular Rules
.config(function ($stateProvider, $urlRouterProvider) {

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
		controller: "SignInCtrl"
	})

	.state("intro", {
		url: "/intro",
		templateUrl: "templates/intro.html",
		controller: "IntroCtrl"
	})

	.state("register", {
		url: "/register",
		templateUrl: "templates/register.html",
		controller: "RegisterCtrl"
	})

	.state("account", {
		url: "/account",
		templateUrl: "templates/account.html",
		controller: "AccountCtrl"
	})

	.state("board", {
		url: "/board",
		abstract: true,
		templateUrl: "templates/menu.html",
		controller: "MainCtrl"
	})

	.state("board.genres", {
		url: "/genres",
		views: {
			"menuContent": {
				templateUrl: "templates/genres.html",
				controller: "GenresCtrl"
			}
		}
	})
	.state("board.games", {
		url: "/games/:genid",
		views: {
			"menuContent": {
				templateUrl: "templates/games.html",
				controller: "GamesCtrl"
			}
		}
	})
	.state("board.categories", {
		url: "/categories/:genid/:gmid",
		views: {
			"menuContent": {
				templateUrl: "templates/categories.html",
				controller: "CategoriesCtrl"
			}
		}
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

	.state("board.members", {
		url: "/members",
		views: {
			"menuContent": {
				templateUrl: "templates/members.html",
				controller: "MembersCtrl"
			}
		}
	})
		.state("board.favourites", {
			url: "/favourites",
			views: {
				"menuContent": {
					templateUrl: "templates/favourites.html",
					controller: "FavouritesCtrl"
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

		.state("board.member", {
			url: "/member/:muuid",
			views: {
				"menuContent": {
					templateUrl: "templates/member-detail.html",
					controller: "MemberDetailCtrl"
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
					controller:"AboutCtrl"
				}
			}
		});

	// if none of the above states are matched, use this as the fallback
	//$urlRouterProvider.otherwise("/app/playlists")

	// Default to Home
	$urlRouterProvider.otherwise("signin");

});
