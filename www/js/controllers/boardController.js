angular.module('gameboard.board.controllers', [])


	.controller('GenresCtrl', function ($rootScope, $scope, $ionicPopup, $ionicLoading, GenresService) {

//    $scope.$on('$ionicView.loaded', function() {

		// Show what we are doing
		$ionicLoading.show({
			template: 'Loading Genres...'
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

		//  });

	})

// A simple controller that shows a tapped item's data
	.controller('GamesCtrl', function ($state, $scope, $stateParams, $ionicLoading, $ionicPopup, GenresService, GamesService, BookmarksService) {

		// Lets check we have a
		var genid = $stateParams.genid;

		//  $scope.$on('$ionicView.enter', function() {


		// Lets load the Videos for the Youtube Channel
		$ionicLoading.show({
			template: 'Loading Games...'
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
			$scope.$emit('gb-error', err);

		});

		//    });

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

		}

		//    });

	})

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

// A simple controller that shows a tapped item's data
	.controller('BoardCtrl', function ($rootScope, $scope, $state, $stateParams, $ionicTabsDelegate, $ionicPopup, $ionicModal, $ionicLoading, BoardService, YouTubeService, WizardHandler, BookmarksService, ACCESS, $ionicActionSheet, $timeout) {

		// Triggered on a button click, or some other target
		$scope.showActions = function () {

			// Show the action sheet
			var hideSheet = $ionicActionSheet.show({
				buttons: [
					{text: '<b>Share</b> This'},
					{text: 'View'},
					{text: '<b>Rate</b> this'}
				],
				titleText: 'Actions for this Video',
				cancelText: 'Cancel',
				cancel: function () {
					// add cancel code..
				},
				buttonClicked: function (index) {
					return true;
				}
			});

		};

		//$scope.$on('$ionicView.enter', function() {

		var board = new Array();
		var videos = new Array();

		$scope.page = 0;
		$scope.pageSize = 20;
		$scope.total = 0;
		$scope.position = 0;

		// Load the Items
		$scope.loadItems = function (page, size) {

			// Clear the List before adding new items
			// This needs to be improved
			$scope.boardlist = [];

			// Refresh
			if (!$scope.$$phase) {
				$scope.$apply();
			}

			// Because we are retrieving all the items every time we do something
			// We need to clear the list before loading in some new values
			$ionicLoading.show({
				template: $scope.message
			});

			// Because we are retrieving all the items every time we do something
			// We need to clear the list before loading in some new values
			$scope.bid = $stateParams.bid;

			// "List is " is a service returning data from the
			BoardService.all($scope.bid, page, size).then(function (board) {

				// Reset the Array if we are on Page 1
				if ($scope.page === 0) {
					// Prepare for the Query
					boardlist = new Array();
				}

				// Set the Title
				$scope.title = board.title;

				// Check what has been returned versus side of what we are returning
				angular.forEach(board.videos.rows, function (value, key) {
					boardlist.push(value.doc);
				});

				// Update the model with a list of Items
				$scope.videos = boardlist;

				// Take the details from the content
				// Use the Calcualtion
				$scope.total = board.videos.total_rows;
				$scope.position = board.videos.offset;

				// Delete Video List
				delete board.videos

				// Add Board to Scope
				$scope.board = board;

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
				if ($scope.page && $scope.page <= parseInt(board.videos.offset)) {
					$scope.page++;
				} else {
					// No More Data
					return;
				}

			}, function (err) {

				// Lets Make a Call to the Service and then update the infinite scroll
				$scope.$broadcast('scroll.infiniteScrollComplete');

				$ionicLoading.hide();
				$scope.vidoes = [];

				// Show Connectivity Error
				if (_.has(err, "info") && err.info.status == "error") {

					$scope.error = "Cannot connect to the cloud";
					$scope.nodata = true;

					$scope.$emit('gb-error', err);

				} else {

					// Then We have not found anything
					if (_.has(err, "info") && err.info.statusCode == 404) {

						$scope.error = "No Videos have been found with this query";
						$scope.nodata = true;
					}

				}


			});

		};

		// If we get close to the end of the list and we have more
		$scope.loadMore = function () {

			if (!$scope.message) {
				$scope.message = 'Loading videos...';
			} else {
				$scope.message = 'More videos...';
			}

			// Check we can move one more page
			// Add Some More
			if ($scope.page <= $scope.total) {
				$scope.loadItems($scope.page, $scope.pageSize);
			}
		};

		// Load Some data on the Display
		$timeout(function () {
			if ($ionicTabsDelegate.$getByHandle('video-tabs').selectedIndex() == 0) {
				$scope.loadMore();
			}
		}, 300);

		//    });

		//  $scope.$on('$ionicView.loaded', function() {

		// Handle a Refresh to the Beginning
		$scope.onRefresh = function () {
			$scope.page = 0;
			$scope.message = null;
			$scope.loadMore();
		};

		// Save a Bookmark
		$scope.addBookmark = function () {

			// Build the Bookmark
			var data = {
				type: "CATEGORY",
				bid: $scope.bid,
				title: $scope.title
			};

			BookmarksService.addBookmark(data).then(function (status) {

				// Tell User we have created the Book Mark
				var infoPopup = $ionicPopup.alert({
					title: 'Bookmark',
					template: 'Bookmark has been saved for this Board ' + $scope.title
				});

				infoPopup.then(function (res) {

				});

			}, function (err) {

				if (err.info.status === "error") {
					$scope.$emit('gb-error', err);
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

		// Create our modal
		$ionicModal.fromTemplateUrl('templates/add-video.html', function (modal) {
			$scope.videoModal = modal;
		}, {
			scope: $scope,
			animation: 'slide-in-up',
			focusFirstInput: true
		});

		$scope.addVideo = function (video) {

			// If they are not registered then you need to register
			if (!$rootScope.user.registered) {
				$state.go('register');
			}

			// Add the Item and then hide the modal view
			BoardService.add(video).then(
				function (payload) {
					console.log("Video Added");
				},
				function (err) {
					console.log(err);
				}
			);

			// Hide the Modal View
			$scope.closeVideo();

		};

		$scope.newVideo = function () {

			// Associate the User
			$scope.user = $rootScope.user;

			// Hide Back button
			$scope.back = false;

			// Start The Wizard from the Beginning
			WizardHandler.wizard().goTo(0);

			// Lets load the Videos for the Youtube Channel
			$ionicLoading.show({
				template: 'Accessing Youtube ...'
			});

			// Need to Check if we have got some already
			YouTubeService.getYourVideos().then(function (data) {

				// Paint the List of Youtube Videos
				$scope.videos = data.items;

				// This is required to make sure the information is uptodate
				if (!$scope.$$phase) {
					$scope.$apply();
				}

				$ionicLoading.hide();

			}, function (err) {
				console.log(err)
				$ionicLoading.hide();
			});

			// Reverse the Paint Bug
			$scope.videoModal.show();

		};

		$scope.closeVideo = function () {
			// Reverse the Paint Bug
			$scope.videoModal.hide();
		};

		$scope.wizardBack = function () {

			if ($scope.currentStep == "Videos") {
				$scope.back = false;
			}
			WizardHandler.wizard().previous();
		};

		$scope.selectVideo = function (_video) {

			$scope.video = null;

			// Get the Video Details
			$scope.back = true;

			$ionicLoading.show({
				template: 'Fetching Video...'
			});

			// Lets get the Information we need
			var _id = null;
			if (_.has(_video, "snippet")) {
				var _id = _video.snippet.resourceId.videoId
			} else {
				var alertPopup = $ionicPopup.alert({
					title: 'Youtube',
					template: 'The video item does not seem to be valid'
				});
				return;
			}

			// Get the Video Details
			YouTubeService.getVideo(_id).then(function (data) {

				// Paint the List of Youtube Videos
				$scope.video = data;

				// This is required to make sure the information is uptodate
				if (!$scope.$$phase) {
					$scope.$apply();
				}

				$ionicLoading.hide();


			}, function (err) {
				console.log(err)
				$ionicLoading.hide();
			});

			// Could make it display before, lets see how this works
			// Initialize the Video Display
			WizardHandler.wizard().next();

		};

		$scope.viewVideo = function (video) {

			// Check we have something to display
			if (!video) {

				var alertPopup = $ionicPopup.alert({
					title: 'Youtube',
					template: 'The video item does not seem to be valid'
				});
				return;
			}

			// Prepare Video URL
			var videoUrl = ACCESS.EMBED + video.id;

			// Play a video with callbacks
			var options = {
				successCallback: function () {
					console.log("Video was closed without error.");
				},
				errorCallback: function (errMsg) {
					console.log("Error! " + errMsg);
				}
			};

			// Open the Media Player
			window.plugins.streamingMedia.playVideo(videoUrl, options);

		};

		$scope.useVideo = function (video) {

			// Flesh out the Video model from what we have let the user add the rest
			// Lets build up an Object model for the gamer to edit
			var bid = $scope.bid;
			var views = $scope.video.statistics.viewCount;
			try {
				bid = parseInt(bid);
				views = parseInt(views);
				rank = views;
			} catch (e) {
				console.log(e);
			}

			// Build Model Object from known data and ask for a few more details
			// This composite model will be used by
			$scope.add = {
				title: $scope.video.snippet.title,
				description: $scope.video.snippet.description,
				gametag: $scope.user.gametag,
				ytid: $scope.video.id,
				ytimage: $scope.video.snippet.thumbnails.default.url,
				bid: bid,
				muuid: $scope.user.raw.id,
				location: $scope.user.location,
				views: views,
				rank: views,
				recorddate: $scope.video.snippet.publishedAt,
				platform: "PS",
				rating: 0

			};

			// Initialize the Video Display
			WizardHandler.wizard().next();

		};

		$scope.addVideo = function (add) {

			console.log("Add Video");
			if (!_.isObject(add)) {
				console.log("Video to add is not an object");
			}

			// Add the Video to the Board
			BoardService.registerVideo(add).then(function (success) {

				// Move to the Finish Wizard Page
				// Initialize the Video Display
				WizardHandler.wizard().next();

			}).catch(function (err) {

				var alertPopup = $ionicPopup.alert({
					title: 'Register',
					template: 'Failed to register video'
				});
				return;
			})

		}

		// Finish the Wizard
		$scope.finish = function () {

			// Refresh the View
			$scope.onRefresh();

			// Hide The dialog
			$scope.videoModal.hide();

		}

		// Handle a Refresh to the Beginning
		//});

	})

// A simple controller that shows retrieves a list of You Tube Videos
	.controller('YTVideoDetailCtrl', function ($scope, $stateParams, YouTubeService, $ionicLoading) {

		// Lets load the Videos for the Youtube Channel
		$ionicLoading.show({
			template: 'Loading ...'
		});


	})

// A simple controller that shows retrieves a list of You Tube Videos
	.controller('VideoCtrl', function ($scope, $stateParams, VideoService, $ionicLoading) {

		// Retrieve the Video content
		// Lets load the Videos for the Youtube Channel
		$ionicLoading.show({
			template: 'Loading ...'
		});

		// Need to Check if we have got some already
		VideoService.get($stateParams.uuid).then(function (video) {

			// Paint
			$scope.video = video;

			// This is required to make sure the information is uptodate
			if (!$scope.$$phase) {
				$scope.$apply();
			}
			$ionicLoading.hide();

		}, function (err) {
			console.log(err)
			$ionicLoading.hide();
		});

		// Add Sharing

		// Social information

		// Likes helps etc etc

		// Comments

	});
