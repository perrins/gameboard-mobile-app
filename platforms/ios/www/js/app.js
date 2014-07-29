// Gameboard Mobile Angular App

angular.module('gameboard', [
    'ionic',
    'gameboard.directives',
    'gameboard.controllers',
    'gameboard.board.controllers',
    'gameboard.member.controllers',
    'gameboard.search.controllers',
    'gameboard.board.services',
    'gameboard.member.services',
    'gameboard.search.services',
    'gameboard.settings'
])

// Handle Status Bar Styling on Load
.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {

        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.constant('ACCESS', {
    GENRES: "gb_genres", //IBM Data
    GAMES: "gb_games", //IBM Data
    CATEGORIES: "gb_categories", //IBM Data
    BOARD: "/videos/board", // IBM CloudCode with Cloudant
    YOUR_VIDEOS: "/youtube/videos", // IBM CloudCode with YouTube API
    YT_VIDEO_DETAIL: "/youtube/video", // IBM CloudCode with YouTube API
    MEMBER: "data/Member.json", // IBM Data
    FAVOURITES: "data/Favourites.json", // IBM Data
    MEMBERS: "data/Members.json", // IBM Data
    SEARCH: "data/Search.json", // IBM CloudCode with Cloudant
    VIDEO: "/videos" // IBM CloudCode with Cloudant
})

// Configure the Angular Rules
.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    // Splash -> Intro -> Login -> Main
    // Splash -> Login -> Main

    // Looking to do Splash in Native, and keep call back all IOS/Android

    $stateProvider

    .state('signin', {
        url: '/signin',
        templateUrl: 'templates/signin.html',
        controller: 'SignInCtrl'
    })

    .state('intro', {
        url: '/intro',
        templateUrl: 'templates/intro.html',
        controller: 'IntroCtrl'
    })

    .state('board', {
        url: "/board",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'MainCtrl'
    })

    .state('board.genres', {
        url: "/genres",
        views: {
            'menuContent': {
                templateUrl: "templates/genres.html",
                controller: 'GenresCtrl'
            }
        }
    })
        .state('board.games', {
            url: "/games/:genid",
            views: {
                'menuContent': {
                    templateUrl: "templates/games.html",
                    controller: 'GamesCtrl'
                }
            }
        })
        .state('board.categories', {
            url: "/categories/:genid/:gmid",
            views: {
                'menuContent': {
                    templateUrl: "templates/categories.html",
                    controller: 'CategoriesCtrl'
                }
            }
        })
        .state('board.board', {
            url: "/board/:bid",
            views: {
                'menuContent': {
                    templateUrl: "templates/board.html",
                    controller: 'BoardCtrl'
                }
            }
        })

    .state('board.video', {
        url: "/video/:uuid",
        views: {
            'menuContent': {
                templateUrl: "templates/video-detail.html",
                controller: 'VideoCtrl'
            }
        }
    })

    .state('board.members', {
        url: "/members",
        views: {
            'menuContent': {
                templateUrl: "templates/members.html",
                controller: "MembersCtrl"
            }
        }
    })
        .state('board.favourites', {
            url: "/favourites",
            views: {
                'menuContent': {
                    templateUrl: "templates/favourites.html",
                    controller: "FavouritesCtrl"
                }
            }
        })
        .state('board.member', {
            url: "/member/:muuid",
            views: {
                'menuContent': {
                    templateUrl: "templates/member-detail.html",
                    controller: "MemberDetailCtrl"
                }
            }
        })
        .state('board.videos', {
            url: "/videos",
            views: {
                'menuContent': {
                    templateUrl: "templates/videos.html",
                    controller: "YourVideosCtrl"
                }
            }
        })

    .state('board.youtube', {
        url: "/youtube",
        views: {
            'videoContent': {
                templateUrl: "templates/video-list.html",
                controller: "SelectVideoCtrl"
            }
        }
    })
        .state('board.ytdetail', {
            url: "/ytdetail/:id",
            views: {
                'menuContent': {
                    templateUrl: "templates/yt-video-detail.html",
                    controller: "YTVideoDetailCtrl"
                }
            }
        })
        .state('board.search', {
            url: "/search",
            views: {
                'menuContent': {
                    templateUrl: "templates/search.html",
                    controller: "SearchCtrl"
                }
            }
        })
        .state('board.settings', {
            url: "/settings",
            views: {
                'menuContent': {
                    templateUrl: "templates/settings.html",
                    controller: "SettingsCtrl"
                }
            }
        })
        .state('board.about', {
            url: '/about',
            views: {
                'menuContent': {
                    templateUrl: 'templates/about.html'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/app/playlists')

    // Default to Home
    $urlRouterProvider.otherwise("signin");

});
