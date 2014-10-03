angular.module("gameboard.member.controllers", [])

.controller("YourVideosCtrl", function ($scope, $location, $stateParams, YourVidoesService) {

	// Need to Check if we have got some already
	YourVidoesService.getYourVideos().then(function (video) {

		// Get information for display
		$scope.member = video;
		$scope.videos = video.videos;

		// Let Angular know we have some data because of the Async nature of IBMBaaS
		// This is required to make sure the information is uptodate
		if (!$scope.$$phase) {
			$scope.$apply();
		}

	});

})

.controller("MembersCtrl", function ($scope, $location, $stateParams, MembersService) {

	var searchParam = "";

	$scope.loadMore = function() {

		// Need to Check if we have got some already
		MembersService.getMembers(searchParam).then(function(members) {
			// Paint
			$scope.members = members;

			$scope.$broadcast("scroll.infiniteScrollComplete");

			// Let Angular know we have some data because of the Async nature of IBMBaaS
			// This is required to make sure the information is uptodate
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		});
	};

	// Check if we can load some more data
	$scope.moreDataCanBeLoaded = function () {
		return true;
	};

	// Search for Members
	$scope.findMembers = function () {
		$scope.loadMore();
	};

	$scope.$on("stateChangeSuccess", function () {
		$scope.loadMore();
	});
})


.controller("MemberDetailCtrl", function ($scope, $location, $stateParams, MemberDetailService) {

	// Need to Check if we have got some already
	MemberDetailService.getMember($stateParams.muuid).then(function (member) {
		// Paint
		$scope.member = member;
		$scope.videos = member.videos;

		// Let Angular know we have some data because of the Async nature of IBMBaaS
		// This is required to make sure the information is uptodate
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	});
})

// A simple controller that fetches a list of data from a service
.controller("FavouritesCtrl", function ($rootScope, $scope, $location, $ionicLoading, FavouritesService) {

	$scope.loadItems = function () {
		// Clear the List before adding new items
		// This needs to be improved
		$scope.list = [];

		// Refresh
		if (!$scope.$$phase) {
			$scope.$apply();
		}

		// Because we are retrieving all the items every time we do something
		// We need to clear the list before loading in some new values

		// "List is " is a service returning data from the
		FavouritesService.allCloud().then(function (favs) {

			// Update the model with a list of Items
			$scope.videos = favs.videos;
			$scope.members = favs.members;

			// Let Angular know we have some data because of the Async nature of IBMBaaS
			// This is required to make sure the information is uptodate
			if (!$scope.$$phase) {
				$scope.$apply();
			}

			$rootScope.favourites = true;

			// Trigger refresh complete on the pull to refresh action
			$scope.$broadcast("scroll.refreshComplete");
		}, function (err) {
			$(".list-error").show(err.responseText);
		});
	};

	// Check if we have Load Init MBaaS and wait for it to configure itself
	// Once complete keep a reference to it so we can talk to it later
	if (!$rootScope.favourites) {
		$scope.loadItems();
	} else {
		var favs = FavouritesService.allCache();
		$scope.videos = favs.videos;
		$scope.members = favs.members;
	}

	$scope.actionButtons = [{
		type: "button-clear",
		content: "<div class='buttons'><button class='button button-icon icon ion-ios7-minus-outline'></button></div>",
		tap: function() {
			// Set the Attribute
			$scope.showDelete = !$scope.showDelete;
		}
	}];

	$scope.selectVideo = function (item) {
		// Shows/hides the delete button on hover
		$location.path("#/board/list");
	};

	$scope.selectMember = function (member) {
		$rootScope.$apply(function () {
			// Moves to a Member
			var mem = "#/board/member/" + member.muuid;
			$location.path(mem);
		});
	};

	$scope.onRefresh = function() {
		// Go back to the Cloud and load a new set of Objects as a hard refresh has been done
		$scope.loadItems();
	};

	$scope.onDelete = function(video) {

		// Work out what is being deleted
		debugger;

		// Delete the Item
		FavouritesService.delVideo(video).then(null, function(err) {
			console.log(err);
		});

		$scope.list = FavouritesService.allCache();

	};

	$scope.itemButtons = [{
		text: "Delete",
		type: "button-assertive",
		onTap: function(item) {
			$scope.onDelete(item);
		}
	}];

});
