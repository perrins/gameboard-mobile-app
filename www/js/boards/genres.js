'use strict';

angular.module("gameboard.boards.genres", [])

	.config(["$stateProvider", function ($stateProvider) {
		$stateProvider.state("board.genres", {
			url: "/genres",
			views: {
				"menuContent": {
                    templateUrl: "js/boards/genres.html",
                    controller: "GenresCtrl",
				}
			}
		});
	}])

    .controller('GenresCtrl', function ($rootScope, $scope, $ionicPopup, $ionicLoading, GenresService) {

        $scope.nodata = false;

        // Handle the Load Events
        /*
        $scope.$on('$ionicView.enter', function() {

        });

        // Handle the Load
        $scope.$on('$ionicView.leave', function() {

        });

        // Handle the Load
        $scope.$on('$ionicView.beforeEnter', function() {

        });

        // Handle the Load
        $scope.$on('$ionicView.unloaded', function() {

        });
        */

        $scope.loadData = function(){

            $ionicLoading.show({
                template: '<ion-spinner class="spinner-energized" icon="lines"></ion-spinner><h3>Loading Genres</h3>'
            });

            // Need to Check if we have got some already
            GenresService.all().then(function (genres) {

                // Hide the Loading Message
                $ionicLoading.hide();

                // Check we have some Games for this Genre
                if (_.isNull(genres)) {

                    var alertPopup = $ionicPopup.alert({
                        title: 'Games',
                        template: 'It seems we dont have any Genres to list'
                    });

                    alertPopup.then(function (res) {
                        // Handle the Next step
                    });

                } else {

                    // Paint
                    $scope.genres = genres;

                    // Let Angular know we have some data because of the Async nature of IBMBaaS
                    // This is required to make sure the information is uptodate
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }

            }, function (err) {

                // Handle Display of No Data and No Connection
                $ionicLoading.hide();

                $scope.nodata = true;

                // Show Connectivity Error
                if (_.has(err, "info") && err.info.status == "error") {
                    $scope.error = "Cannot connect to the cloud";
                    $rootScope.wifi();
                }

                // Then We have not found anything
                if (err.info.statusCode == 404) {
                    $scope.error = "No Genres have been found !";
                }

                // Then We have not found anything
                if (err.info.statusCode == 500 || err.info.statusCode == 400) {
                    $scope.error = "Internal server error, please contact App Support";
                }

            });

        };

        $scope.reload = function(){
            $scope.loadData();
        }

        // Handle the Load
        $scope.$on('$ionicView.loaded', function() {
            $scope.loadData();
        });

    })

    /**
     * Service to Load list of Genres
     */
    .factory('GenresService', function ($q, $cacheFactory, ACCESS) {

        // Use an internal Cache for storing the List and map the operations to manage that from
        // Mobile Cloud SDK Calls
        var cache = $cacheFactory('Genres');

        return {

            // Return all the Objects for a Given Class
            all: function () {

                // Create a Defer as this is an async operation
                var defer = $q.defer();

                var items = cache.get(ACCESS.GENRES);

                if (!_.isUndefined(items)) {
                    defer.resolve(items);
                } else {

                    // Clear the Cache with a new set
                    cache.remove(ACCESS.GENRES);

                    // Get handle to the CloudCode service
                    var cc = IBMCloudCode.getService();

                    // USE THE CloudCode to Call the Board Services
                    // This will integrate with Cloudant to retrieve a list of videos for a Board
                    // Need to manage the Paging for this and sort it by ranking
                    // Lets build a
                    var uri = new IBMUriBuilder().append(ACCESS.GENRES).toString();

                    // Get the Genres
                    cc.get(uri, {
                        "handleAs": "json"
                    }).then(function (list) {

                        // Place the Items in the Cache
                        cache.put(ACCESS.GENRES, list);
                        // return the Cache
                        defer.resolve(cache.get(ACCESS.GENRES));

                    }).catch(function (err) {
                        defer.reject(err);
                    })

                }

                // Get the Objects for a particular Type
                return defer.promise;

            },
            getGenre: function (gid) {

                var def = $q.defer();

                // Resolve the Cache
                this.all().then(function (genres) {

                    var _genre = null;
                    genres.forEach(function (genre) {
                        if (genre.gid == gid) {
                            _genre = genre;
                        }
                    });

                    // Check if we have found one
                    if (!_.isNull(_genre)) {
                        def.resolve(_genre);
                    } else {
                        def.reject(_genre);
                    }

                }, function (err) {
                    def.reject(err);
                });

                return def.promise;

            }

        }

    });


