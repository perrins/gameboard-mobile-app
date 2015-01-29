'use strict';

angular.module("gameboard.member.favourites", [])

	.config(["$stateProvider", function ($stateProvider) {
		$stateProvider.state("board.favourites", {
			url: "/favourites",
			views: {
				"menuContent": {
					templateUrl: "js/member/favourites.html",
					controller: "FavouritesCtrl"
				}
			}
		});
	}])

	.controller("FavouritesCtrl", function ($rootScope, $scope, $location, $ionicLoading, FavouritesService) {

		$scope.loadItems = function () {
			// Clear the List before adding new items
			// This needs to be improved
			$scope.members = [];
			$scope.videos = [];

			$scope.total_videos = 0;
			$scope.total_members = 0;

			// Refresh
			if (!$scope.$$phase) {
				$scope.$apply();
			}

			// Because we are retrieving all the items every time we do something
			// We need to clear the list before loading in some new values

			// "List is " is a service returning data from the
			FavouritesService.allCloud().then(function (favs) {

				// Update the model with a list of Items
				$scope.favourites = favs;
				$scope.videos = favs.videos;

				$scope.total_videos = favs.videos.length;
				$scope.total_members = favs.members.length;

				// Let Angular know we have some data because of the Async nature of IBMBaaS
				// This is required to make sure the information is uptodate
				if (!$scope.$$phase) {
					$scope.$apply();
				}

				// Trigger refresh complete on the pull to refresh action
				$scope.$broadcast("scroll.refreshComplete");

			}).catch(function (err) {
				console.log(err);
			});
		};

		$scope.loadItems();

		$scope.showMembers = function () {

			var favs = FavouritesService.allCache();
			$scope.videos = [];
			$scope.members = favs.members;

			if (!$scope.$$phase) {
				$scope.$apply();
			}

		};

		$scope.showVideos = function () {

			var favs = FavouritesService.allCache();
			$scope.members = [];
			$scope.videos = favs.videos;

			if (!$scope.$$phase) {
				$scope.$apply();
			}

		}

		$scope.actionButtons = [{
			type: "button-clear",
			content: "<div class='buttons'><button class='button button-icon icon ion-ios7-minus-outline'></button></div>",
			tap: function () {
				// Set the Attribute
				$scope.showDelete = !$scope.showDelete;
			}
		}];

		$scope.onRefresh = function () {
			// Go back to the Cloud and load a new set of Objects as a hard refresh has been done
			$scope.loadItems();
		};

		$scope.onDelete = function (video) {

			// Delete the Item
			FavouritesService.delVideo(video).then(null, function (err) {
				console.log(err);
			});

			$scope.list = FavouritesService.allCache();
		};

		$scope.itemButtons = [{
			text: "Delete",
			type: "button-assertive",
			onTap: function (item) {
				$scope.onDelete(item);
			}
		}];
	})
