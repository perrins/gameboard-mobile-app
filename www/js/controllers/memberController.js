angular.module("gameboard.controllers.member", [])

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

// A simple controller that fetches a list of data from a service
	.controller("BookmarksCtrl", function ($state, $rootScope, $scope, $location, $ionicLoading, BookmarksService) {

		$scope.showDelete = false;

		$scope.loadItems = function () {
			// Clear the List before adding new items
			// This needs to be improved
			$scope.bookmarks = null;
            $scope.nodata = false;

			// Refresh
			if (!$scope.$$phase) {
				$scope.$apply();
			}

			// Because we are retrieving all the items every time we do something
			// We need to clear the list before loading in some new values

			// "List is " is a service returning data from the
			BookmarksService.allCloud().then(function (bookmarks) {


                if(_.isArray(bookmarks) && bookmarks.length > 0) {

                    // Manage the Look and feel of the Bookmarks
                    var _bookmarks = Array();

                    bookmarks.forEach(function (item) {

                        var _item = item.doc;
                        switch (item.doc.type) {
                            case "GAME" :
                                _item.color = "#00cc00";
                                break;
                            case "CATEGORY" :
                                _item.color = "#eecc00";
                                break;
                            case "BOARD" :
                                _item.color = "#00ccff";
                                break;
                            default :
                                _item.color = "grey";
                                break;
                        }

                        // get the Character we want to display
                        _item.tag = item.doc.type.substr(0, 1).toUpperCase();

                        _bookmarks.push(_item);

                    });

                    // Update the model with a list of Items
                    $scope.bookmarks = _bookmarks;

                } else {
                    $scope.bookmarks = new Array();
                    $scope.nodata = true;
                }

				// Let Angular know we have some data because of the Async nature of IBMBaaS
				// This is required to make sure the information is uptodate
				if (!$scope.$$phase) {
					$scope.$apply();
				}

				// Trigger refresh complete on the pull to refresh action
				$scope.$broadcast("scroll.refreshComplete");

			},function (err) {

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

        };

		$scope.loadItems();

		$scope.onRefresh = function () {
			// Go back to the Cloud and load a new set of Objects as a hard refresh has been done
			$scope.loadItems();
		};

		$scope.selectBookmark = function (bookmark) {

			switch (bookmark.type) {

				case "GAME":

					// Navigate to a Game
					$state.go("board.games", {genid: bookmark.gid});
					break;

				case "CATEGORY" :

					// Navigate the to a Category
					$state.go("board.categories", {genid: bookmark.genid, gmid: bookmark.gemid});
					break;

				case "BOARD" :

					// Navigate to a Board
					$state.go("board.videos", {bid: bookmark.bid});
					break;

				case "MEMBER" :

					// Navigate to a Board
					$state.go("board.members", {muuid: bookmark.muuid});
					break;

				case "VIDEOS" :

					// Navigate to a Board
					$state.go("board.videos", {uuid: bookmark.uuid});
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
		$scope.onShowDelete = function () {
			$scope.showDelete = !$scope.showDelete;
		}

	})

// A simple controller that fetches a list of data from a service
	.controller("NotificationsCtrl", function ($state, $rootScope, $scope, $location, $ionicLoading, NotificationService) {

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
					notifications.forEach(function (item) {

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
						item.tag = item.type.substr(0, 1).toUpperCase();
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

			}).catch(function (err) {
				console.log(err);
			});
		};

		$scope.loadItems();

		$scope.onRefresh = function () {
			// Go back to the Cloud and load a new set of Objects as a hard refresh has been done
			$scope.loadItems();
		};

		$scope.selectNotification = function (notification) {

			switch (notification.type) {

				case "MESSAGE":

					// Navigate to a Game
					$state.go("board.games", {genid: bookmark.gid});
					break;

				case "RANKING" :

					// Navigate the to a Category
					$state.go("board.categories", {genid: bookmark.genid, gmid: bookmark.gmid});
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

