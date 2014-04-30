// Gameboard Mobile Angular App

angular.module('gameboard', [
    'ionic', 
    'gameboard.directives',
    'gameboard.controllers',
    'gameboard.board.controllers',
    'gameboard.member.controllers',
    'gameboard.board.services',
    'gameboard.member.services'
])

// Handle Status Bar Styling on Load
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

// Configure the Angular Rules
.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    $stateProvider .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse.html"
        }
      }
    })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.single', {
      url: "/playlists/:playlistId",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlist.html",
          controller: 'PlaylistCtrl'
        }
      }
    })

    .state('board', {
        url: "/board",
        abstract: true,
        templateUrl: "templates/board.html",
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
        url: "/games/:gid",
        views: {
            'menuContent': {
                templateUrl: "templates/games.html",
                controller: 'GamesCtrl'
            }
        }
    })
    .state('board.categories', {
        url: "/categories/:cid",
        views: {
            'menuContent': {
                templateUrl: "templates/categories.html",
                controller: 'CategoriesCtrl'
            }
        }
    })
    .state('board.list', {
        url: "/list/:cid",
        views: {
            'menuContent': {
                templateUrl: "templates/list.html",
                controller: 'ListCtrl'
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
                templateUrl: "templates/member_detail.html",
                controller: "MemberDetailCtrl"
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
                templateUrl: "templates/settings.html"
                //controller: "SettingsCtrl"
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/app/playlists')

    // Default to Home
    $urlRouterProvider.otherwise("/board/genres");

})

.constant('URL', {
    GENRES: "data/Genres.json",
    GAMES: "data/Games.json",
    CATEGORIES: "data/Categories.json",
    BOARD: "data/Board.json",
    MEMBER: "data/Member.json",
    FAVOURITES: "data/Favourites.json",
    MEMBERS: "data/Games.json"
});
