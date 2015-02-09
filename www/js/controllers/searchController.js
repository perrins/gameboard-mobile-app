angular.module("gameboard.search.controllers", [])

	.controller("SearchCtrl", function ($rootScope, $scope, $location, $ionicLoading, $stateParams, SearchService) {

		var searchParam = "";

		$scope.videos = [];
		var videos = [];
		$scope.bookmark = null;
		$scope.pageSize = 10;
		$scope.first = true;
		$scope.nodata = false;

		// Load the Items
		$scope.loadItems = function (bookmark, pageSize) {

			// Lets Make a Call to the Service and then update the infinite scroll
			$scope.$broadcast('scroll.infiniteScrollComplete');

			// Because we are retrieving all the items every time we do something
			// We need to clear the list before loading in some new values
			$ionicLoading.show({
				template: $scope.message
			});

			var emptyData = function () {

				$scope.error = "No Videos have been found with this query";
				$scope.nodata = true;

				$ionicLoading.hide();
				$scope.videos = [];

			};

			// "List is " is a service returning data from the
			SearchService.all(searchParam, bookmark, pageSize).then(function (_videos) {

				$scope.first = false;

				if (!_.isObject(_videos)) {
					emptyData();
					return;
				}

				// Lets Check
				if (_.has(_videos, "total_rows") && _videos.total_rows == 0) {
					emptyData();
					return;
				}

				// Reset the Array if we are on Page 1
				if ($scope.page === 0) {
					// Prepare for the Query
					videos = [];
				}

				// Set the Title
				$scope.title = searchParam;

				// Check what has been returned versus side of what we are returning
				angular.forEach(_videos, function (value, key) {
					videos.push(value);
				});

				// Update the model with a list of Items
				$scope.videos = videos;

				// Take the details from the content
				// Use the Calcualtion
				$scope.total = videos.length;//board.videos.total_rows;
				$scope.position = 0; //board.videos.offset;

				// Let Angular know we have some data because of the Async nature of IBMBaaS
				// This is required to make sure the information is uptodate
				if (!$scope.$$phase) {
					$scope.$apply();
				}

				// Hide the loading icons
				$ionicLoading.hide();

				// Refresh
				if (!$scope.$$phase) {
					$scope.$apply();
				}


				// Check we can move forward.
				if ($scope.page && $scope.page <= parseInt(20)) {
					$scope.page++;
				} else {
					// No More Data

				}

			}, function (err) {

				$ionicLoading.hide();
				$scope.videos = [];
				$scope.nodata = true;
				$scope.first = false;

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

		};

		// If we get close to the end of the list and we have more
		$scope.loadMore = function () {

			if (!$scope.message) {
				$scope.message = 'Fetching Videos...';
			} else {
				$scope.message = 'More Videos...';
			}

			// Check we can move one more page
			// Add Some More
			if (!_.isNull($scope.bookmark) || $scope.first) {
				$scope.first = false;
				$scope.loadItems($scope.bookmark, $scope.pageSize);
			}
		};

		// Search for Members
		$scope.findVideos = function () {

			$scope.first = true;
			$scope.message = 'Fetching Videos...';

			// Clean Up
			try {
				delete $scope.message;
				delete $scope.nodata;
				delete $scope.error;
			} catch (e) {
			}

			$scope.loadItems($scope.bookmark, $scope.pageSize);
		};

		$scope.$on("stateChangeSuccess", function () {
			$scope.loadMore();
		});

	});
