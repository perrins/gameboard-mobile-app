'use strict';

angular.module("gameboard.boards.categories", [])

	.config(["$stateProvider", function ($stateProvider) {
		$stateProvider.state("board.categories", {
            url: "/categories/:genid/:gmid",
            views: {
                "menuContent": {
                    templateUrl: "js/boards/categories.html",
                    controller: "CategoriesCtrl"
                }
            }
		});
	}])

// A simple controller that shows a tapped item's data
    .controller('CategoriesCtrl', function ($scope, $stateParams, $ionicLoading, $ionicPopup, CategoriesService, GamesService, BookmarksService) {

        // Lets check we have a
        var gmid = $stateParams.gmid;
        var genid = $stateParams.genid;

        //$scope.$on('$ionicView.enter', function() {

        $ionicLoading.show({
            template: 'Loading Categories...'
        });

        // Access the Genres and get the Title and other information we need
        GamesService.getGame(genid, gmid).then(function (game) {

            // Display The Title
            $scope.title = game.title;

            // Get the Games
            return CategoriesService.all(gmid);

        }).then(function (data) {

            // Check we have some Games for this Genre
            if (_.isNull(data)) {

                $ionicLoading.hide();

                var alertPopup = $ionicPopup.alert({
                    title: 'Categoies',
                    template: 'It seems we dont have a Category defined for this Game'
                });

                alertPopup.then(function (res) {
                    // Go Back to the Main Genres Screen
                    $state.go("board.genres");
                });

            } else {
                // Paint
                $scope.banner = data.banner;
                $scope.categories = data.categories;
                $scope.gmid = data.gmid;

                $ionicLoading.hide();

                // This is required to make sure the information is uptodate
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }

        }, function (err) {

            // Hide any Progress
            $ionicLoading.hide();

            $scope.$emit('gb-error', err);

        });

        //});

        //
        //$scope.$on('$ionicView.loaded', function() {

        $scope.addBookmark = function () {

            // Build the Bookmark
            var data = {
                type: "CATEGORY",
                gemid: $scope.gmid,
                title: $scope.title
            };

            BookmarksService.addBookmark(data).then(function (status) {

                // Tell User we have created the Book Mark
                var infoPopup = $ionicPopup.alert({
                    title: 'Bookmark',
                    template: 'Bookmark has been saved for Category ' + $scope.title
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

        }

        //   });

    })

/**
 * A simple example service that returns some data.
 */
    .factory('CategoriesService', function ($q, $cacheFactory, $stateParams, ACCESS) {

        // Use an internal Cache for storing the List and map the operations to manage that from
        // Mobile Cloud SDK Calls
        var cache = $cacheFactory('Categories');

        return {

            // Return all the Objects for a Given Class
            all: function (gmid) {

                var _gmid = null
                try {
                    var _gmid = parseInt(gmid);
                } catch (err) {
                    console.log("GMID supplied is not valid", err);

                }
                // Check the GID
                if (_.isNull(_gmid)) {
                    console.log("GMID could not be used");
                }

                // Create a Defer as this is an async operation
                var defer = $q.defer();
                var items = cache.get(gmid + "_" + ACCESS.CATEGORIES);

                if (!_.isUndefined(items)) {
                    defer.resolve(items);
                } else {

                    // Get handle to the CloudCode service
                    var cc = IBMCloudCode.getService();

                    // USE THE CloudCode to Call the Board Services
                    // This will integrate with Cloudant to retrieve a list of videos for a Board
                    // Need to manage the Paging for this and sort it by ranking
                    // Lets build a
                    var uri = new IBMUriBuilder().append(ACCESS.CATEGORIES).toString();

                    // Clear the Cache with a new set
                    cache.remove(gmid + "_" + ACCESS.CATEGORIES);

                    // Get the Genres
                    // Get the Videos for my Board
                    cc.get(uri, {
                        "handleAs": "json"
                    }).done(function (list) {

                        // Check if this is a list and array
                        if (_.isObject(list)) {

                            // Place the Items in the Cache
                            cache.put(gmid + "_" + ACCESS.CATEGORIES, list);

                            // return the Cache
                            defer.resolve(cache.get(gmid + "_" + ACCESS.CATEGORIES));

                        } else {
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
            getCategory: function (cid) {

                // Resolve the Cache
                var cats = cache.get(ACCESS.CATEGORIES);

                // Load if not loaded
                if (_.isUndefined(cats)) {
                    cats = this.all();
                }

                var _cat = null;
                cats.forEach(function (cat) {
                    if (cat.cid == cid) {
                        _cat = cat;
                    }
                })

                return _cat;

            }
        }

    });



