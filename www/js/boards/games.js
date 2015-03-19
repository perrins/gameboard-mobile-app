'use strict';

angular.module("gameboard.boards.games", [])

	.config(["$stateProvider", function ($stateProvider) {
		$stateProvider.state("board.games", {
            url: "/games/:genid",
            views: {
                "menuContent": {
                    templateUrl: "js/boards/games.html",
                    controller: "GamesCtrl"
                }
            }
		});
	}])


// A simple controller that shows a tapped item's data
    .controller('GamesCtrl', function ($state, $scope, $stateParams, $ionicLoading, $ionicPopup, GenresService, GamesService, BookmarksService) {

        // Lets check we have a
        var genid = $stateParams.genid;

        $scope.$on('$ionicView.enter', function() {

            $ionicLoading.show({
                template: '<ion-spinner class="spinner-energized" icon="lines"></ion-spinner><h3>Loading Games</h3>'
            });

            // Access the Genres and get the Title and other information we need
            GenresService.getGenre(genid).then(function (genre) {

                // Display The Title
                $scope.title = genre.title;

                // Get the Games
                return GamesService.all(genid);

            }).then(function (data) {

                // Check we have some Games for this Genre
                if (_.isNull(data)) {

                    $ionicLoading.hide();

                    var alertPopup = $ionicPopup.alert({
                        title: 'Games',
                        template: 'It seems we dont have a Games list defined for this Genre'
                    });

                    alertPopup.then(function (res) {
                        // Go Back to the Main Genres Screen
                        $state.go("board.genres");
                    });

                } else {

                    // Layout the Games and the Banners
                    $scope.games = data.games;
                    $scope.banners = data.banners;
                    $scope.gid = data.gid;
                    $scope.genid = data.genid;

                    $ionicLoading.hide();
                    // Let Angular know we have some data because of the Async nature of IBMBaaS
                    // This is required to make sure the information is uptodate
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }

            }, function (err) {

                $ionicLoading.hide();
                $scope.nodata = true;

                // Show Connectivity Error
                if (_.has(err, "info") && err.info.status == "error") {
                    $scope.error = "Cannot connect to the cloud";
                    $rootScope.wifi();
                }

                // Then We have not found anything
                if (err.info.statusCode == 404) {
                    $scope.error = "No Videos have been found with this query";
                }

                // Then We have not found anything
                if (err.info.statusCode == 500) {
                    $scope.error = "Internal server error, please contact App Support";
                }

            });

        });

        // Define Scrop Variables
        //    $scope.$on('$ionicView.loaded', function() {

        $scope.addBookmark = function () {

            // Build the Bookmark
            var data = {
                type: "GAME",
                gid: $scope.gid,
                title: $scope.title
            };

            BookmarksService.addBookmark(data).then(function (status) {

                // Tell User we have created the Book Mark
                var infoPopup = $ionicPopup.alert({
                    title: 'Bookmark',
                    template: 'Bookmark has been saved for Games Genre ' + $scope.title
                });

                infoPopup.then(function (res) {

                });

            }, function (err) {

                // Show Connectivity Error
                if (_.has(err, "info") && err.info.status == "error") {
                    $rootScope.wifi();
                } else {

                    var alertPopup = $ionicPopup.alert({
                        title: 'Bookmark',
                        template: 'Failed to create the Bookmark'
                    });

                    alertPopup.then(function (res) {

                    });
                }

            });

        };

        //    });

    })

/**
 * A simple example service that returns some data.
 */
    .factory('GamesService', function ($q, $cacheFactory, $stateParams, ACCESS) {

        // Use an internal Cache for storing the List and map the operations to manage that from
        // Mobile Cloud SDK Calls
        var cache = $cacheFactory('Games');

        return {

            // Return all the Objects for a Given Class
            all: function (genid) {

                var _genid = null;
                try {
                    var _genid = parseInt(genid);
                } catch (err) {
                    console.log("GID supplied is not valid", err);

                }
                // Check the GID
                if (_.isNull(_genid)) {
                    console.log("GID could not be used");
                }

                // Create a Defer as this is an async operation
                var defer = $q.defer();

                var items = cache.get(genid + "_" + ACCESS.GAMES);

                if (!_.isUndefined(items)) {
                    defer.resolve(items);
                } else {

                    // Get handle to the CloudCode service
                    var cc = IBMCloudCode.getService();

                    // USE THE CloudCode to Call the Board Services
                    // This will integrate with Cloudant to retrieve a list of videos for a Board
                    // Need to manage the Paging for this and sort it by ranking
                    // Lets build a
                    var uri = new IBMUriBuilder().append(ACCESS.GAMES).toString();

                    // Clear the Cache with a new set
                    cache.remove(genid + "_" + ACCESS.GAMES);

                    // Get the Genres
                    // Get the Videos for my Board
                    cc.get(uri, {
                        "handleAs": "json"
                    }).done(function (list) {

                        // Check if this is a list and array
                        if (_.isObject(list)) {

                            // Place the Items in the Cache
                            cache.put(genid + "_" + ACCESS.GAMES, list);

                            // return the Cache
                            defer.resolve(cache.get(genid + "_" + ACCESS.GAMES));

                        } else {

                            // Send empty array back, its not an error to get empty data
                            // return the Cache
                            defer.resolve(null);

                        }

                    }, function (err) {
                        console.log(err);
                        defer.reject(err);
                    });
                }

                // Get the Objects for a particular Type
                return defer.promise;

            },
            getGame: function (genid, gmid) {

                var def = $q.defer();

                // Resolve the Cache
                this.all(genid).then(function (item) {

                    var games = item.games;
                    var _game = null;
                    games.forEach(function (game) {
                        if (game.gmid == gmid) {
                            _game = game;
                        }
                    });

                    // Check if we have found one
                    if (!_.isNull(_game)) {
                        def.resolve(_game);
                    } else {
                        def.reject(_game);
                    }

                }, function (err) {
                    def.reject(err);
                });

                return def.promise;
            }
        }
    });




