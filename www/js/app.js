// Gameboard Mobile Angular App

angular.module('gameboard', ['ionic', 'gameboard.directives',
    'gameboard.controllers',
    'gameboard.board.controllers',
    'gameboard.member.controllers',
    'gameboard.board.services',
    'gameboard.member.services'
])

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    $stateProvider

    .state('board', {
        url: "/board",
        abstract: true,
        templateUrl: "board.html",
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
