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

        // Handle the Load
        $scope.$on('$ionicView.loaded', function() {

            // Show what we are doing
            $ionicLoading.show({
                template: "<i class=\"ion-loading-c\"></i><span>&nbsp;Loading Genres...</span>"
            });

            // Need to Check if we have got some already
            GenresService.all().then(function (genres) {

                // Check we have some Games for this Genre
                if (_.isNull(genres)) {

                    $ionicLoading.hide();

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

                    // Hide the Loading Message
                    $ionicLoading.hide();

                    // Let Angular know we have some data because of the Async nature of IBMBaaS
                    // This is required to make sure the information is uptodate
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }

            }, function (err) {

                // Handle Display of No Data and No Connection
                $ionicLoading.hide();

                $scope.$emit('gb-error', err);

            });

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
                        console.log(err);
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


