angular.module("gameboard.member.controllers", [])

.controller("YourVideosCtrl", function ($scope, $location, $stateParams, YourVideosService) {

	// Need to Check if we have got some already
	YourVideosService.allCloud().then(function (videos) {

		// Get information for display
		$scope.member = videos;
		$scope.videos = videos.videos;

		// Let Angular know we have some data because of the Async nature of IBMBaaS
		// This is required to make sure the information is uptodate
		if (!$scope.$$phase) {
			$scope.$apply();
		}

	});

})

.controller("MembersCtrl", function ($scope, $location,$ionicLoading, $stateParams, MembersService,InitBluemix) {

	var searchParam = "";

	var members = new Array();

    $scope.page = 0;
    $scope.pageSize = 20;
    $scope.total = 0;
    $scope.position = 0;

    // Load the Items
    $scope.loadItems = function(page, size) {

        // Refresh
        if (!$scope.$$phase) {
            $scope.$apply();
        }

        // Because we are retrieving all the items every time we do something
        // We need to clear the list before loading in some new values
        $ionicLoading.show({
            template: $scope.message
        });


        // "List is " is a service returning data from the 
        MembersService.all(searchParam,page,size).then(function(_members) {

            // Reset the Array if we are on Page 1
            if($scope.page === 0) {
                // Prepare for the Query
                members = new Array();
            }

            // Set the Title
            $scope.title = searchParam;

            // Check what has been returned versus side of what we are returning
            angular.forEach(_members, function(value, key) {
                members.push(value);
            });

            // Update the model with a list of Items
            $scope.members = members;

            // Take the details from the content
            // Use the Calcualtion
            $scope.total = 20;//board.videos.total_rows;
            $scope.position = 0; //board.videos.offset;
            $scope.count = 20;
            $scope.number = 20;

            // Let Angular know we have some data because of the Async nature of IBMBaaS
            // This is required to make sure the information is uptodate
            if (!$scope.$$phase) {
                $scope.$apply();
            }

            // Hide the loading icons
            $ionicLoading.hide();

            // Lets Make a Call to the Service and then update the infinite scroll
            $scope.$broadcast('scroll.infiniteScrollComplete');

            // Check we can move forward.
            if ($scope.page && $scope.page <= parseInt(20)) {
                $scope.page++;
            } else {
                // No More Data
                return;
            }

        }, function(err) {
            console.log(err);
            $ionicLoading.hide();
            $scope.board = null;

        });

    };

    // If we get close to the end of the list and we have more 
    $scope.loadMore = function() {

        if(!$scope.message) {
            $scope.message = 'Fetching Members...';
        } else {    
            $scope.message = 'More Members...';
        }    

        // Check we can move one more page
        // Add Some More
        if($scope.page <= $scope.total) {
            $scope.loadItems($scope.page, $scope.pageSize);
        }    
    };

	// Search for Members
	$scope.findMembers = function () {

		$scope.page = 0;
		$scope.loadMore();
	};

	$scope.$on("stateChangeSuccess", function () {
		$scope.loadMore();
	});
})

.controller("MemberDetailCtrl", function ($scope, $location, $stateParams, MembersService) {

	// Need to Check if we have got some already
	MembersService.getMember($stateParams.muuid).then(function (member) {
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

		}).catch(function(err){
			 console.log(err);
		});
	};

	$scope.loadItems();

	$scope.showMembers = function() {

		var favs = FavouritesService.allCache();
		$scope.videos = [];
		$scope.members = favs.members;

		if (!$scope.$$phase) {
			$scope.$apply();
		}

	};

	$scope.showVideos = function() {

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
		tap: function() {
			// Set the Attribute
			$scope.showDelete = !$scope.showDelete;
		}
	}];

	$scope.onRefresh = function() {
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
		onTap: function(item) {
			$scope.onDelete(item);
		}
	}];
})

// A simple controller that fetches a list of data from a service
.controller("BookmarksCtrl", function ($state,$rootScope, $scope, $location, $ionicLoading, BookmarksService) {

	$scope.showDelete = false;

	$scope.loadItems = function () {
		// Clear the List before adding new items
		// This needs to be improved
		$scope.bookmarks = [];

		// Refresh
		if (!$scope.$$phase) {
			$scope.$apply();
		}

		// Because we are retrieving all the items every time we do something
		// We need to clear the list before loading in some new values

		// "List is " is a service returning data from the
		BookmarksService.allCloud().then(function (bookmarks) {

			// Manage the Look and feel of the Bookmarks
			var _bookmarks = Array();
			bookmarks.forEach(function(item){

				switch (item.type) {
					case "GAME" :
						item.color = "#00cc00";
						break;
					case "CATEGORY" :
						item.color = "#eecc00";
						break;
					case "BOARD" :
						item.color = "#00ccff";
						break;
					default :
						item.color = "grey";
						break;
				}

				// get the Character we want to display
				item.tag = item.type.substr(0,1).toUpperCase();

				_bookmarks.push(item);

			});

			// Update the model with a list of Items
			$scope.bookmarks = _bookmarks;

			// Let Angular know we have some data because of the Async nature of IBMBaaS
			// This is required to make sure the information is uptodate
			if (!$scope.$$phase) {
				$scope.$apply();
			}

			// Trigger refresh complete on the pull to refresh action
			$scope.$broadcast("scroll.refreshComplete");

		}).catch(function(err){
			 console.log(err);
		});
	};

	$scope.loadItems();

	$scope.onRefresh = function() {
		// Go back to the Cloud and load a new set of Objects as a hard refresh has been done
		$scope.loadItems();
	};

	$scope.selectBookmark = function(bookmark) {

		switch (bookmark.type) {

			case "GAME":

				// Navigate to a Game
				$state.go("board.games", {genid:bookmark.gid});
				break;

			case "CATEGORY" :

				// Navigate the to a Category
				$state.go("board.categories", {genid:bookmark.genid,gmid:bookmark.gmid});
				break;

			case "BOARD" :

				// Navigate to a Board
				$state.go("board.videos", {bid:bookmark.bid});
				break;

			case "MEMBER" :

				// Navigate to a Board
				$state.go("board.members", {muuid:bookmark.muuid});
				break;

			case "VIDEOS" :

				// Navigate to a Board
				$state.go("board.videos", {uuid:bookmark.uuid});
				break;

			default:
				console.log("Bookmark is invalid");
		}

	};

	// Handle the Removal of the Bookmark
	$scope.onBookmarkDelete = function (book) {

		// Delete the Item
		BookmarkService.delBookmark(book).then(null, function (err) {
			console.log(err);
		});

		$scope.list = FavouritesService.allCache();
	};

	// 
	$scope.onShowDelete = function() {
		$scope.showDelete = !$scope.showDelete;
	}

})

// A simple controller that fetches a list of data from a service
.controller("NotificationsCtrl", function ($state,$rootScope, $scope, $location, $ionicLoading, NotificationService) {

	$scope.loadItems = function () {

		// Clear the List before adding new items
		// This needs to be improved
		$scope.notifications = [];

		// Refresh
		if (!$scope.$$phase) {
			$scope.$apply();
		}

		// Because we are retrieving all the items every time we do something
		// We need to clear the list before loading in some new values

		// "List is " is a service returning data from the
		NotificationService.allCloud().then(function (notifications) {


			var _notify = Array();

			// Check we have some notifications
			if (notifications && _.isArray(notifications)) {

				// Manage the Look and feel of the Bookmarks
				notifications.forEach(function(item){

					switch (item.type) {
						case "RANKING" :
							item.color = "item-balanced";
							break;
						case "FAVOURITE" :
							item.color = "item-energized";
							break;
						case "MESSAGE" :
							item.color = "item-calm";
							break;
						case "SYSTEM" :
							item.color = "item-assertive";
							break;
						case "PRIZE" :
							item.color = "item-royal";
							break;

						default :
							item.color = "white";
							break;
					}

					// get the Character we want to display
					item.tag = item.type.substr(0,1).toUpperCase();
					_notify.push(item);

				});

			}	
			// Update the model with a list of Items
			$scope.notifications = _notify;

			// Let Angular know we have some data because of the Async nature of IBMBaaS
			// This is required to make sure the information is uptodate
			if (!$scope.$$phase) {
				$scope.$apply();
			}

			// Trigger refresh complete on the pull to refresh action
			$scope.$broadcast("scroll.refreshComplete");

		}).catch(function(err){
			 console.log(err);
		});
	};

	$scope.loadItems();

	$scope.onRefresh = function() {
		// Go back to the Cloud and load a new set of Objects as a hard refresh has been done
		$scope.loadItems();
	};

	$scope.selectNotification = function(notification) {

		switch (notification.type) {

			case "MESSAGE":

				// Navigate to a Game
				$state.go("board.games", {genid:bookmark.gid});
				break;

			case "RANKING" :

				// Navigate the to a Category
				$state.go("board.categories", {genid:bookmark.genid,gmid:bookmark.gmid});
				break;

			default:
				console.log("Bookmark is invalid");
		}

	};

	$scope.onDelete = function (notice) {

		// Delete the Item
		NotificationService.delNotification(notice).then(null, function (err) {
			console.log(err);
		});

		$scope.list = NotificationService.allCache();
	};


});

