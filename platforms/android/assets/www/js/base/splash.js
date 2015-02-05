angular.module("gameboard")

	.controller("SplashCtrl", function ($scope, $timeout, $rootScope, $ionicModal, $ionicPlatform, $location, $state) {
		$ionicPlatform.ready(function () {
			// Hide the status bar
			//StatusBar.hide();
			console.log("alive and kicking...");
		});

		//TMD: Aren't $scope and this the same?

		$scope.goHome = function () {
			$state.go("board.genres");
		};

		$scope.activeBgImageIndex = 0;

		$scope.showSettings = function () {
			if (!$scope.settingsModal) {
				// Load the modal from the given template URL
				$ionicModal.fromTemplateUrl("settings.html", function (modal) {
					$scope.settingsModal = modal;
					$scope.settingsModal.show();
				}, {
					// The animation we want to use for the modal entrance
					animation: "slide-in-up"
				});
			} else {
				$scope.settingsModal.show();
			}
		};

		this.getBackgroundImage = function (lat, lng, locString) {
			Flickr.search(locString, lat, lng).then(function (resp) {
				var photos = resp.photos;
				if (photos.photo.length) {
					$scope.bgImages = "img/call-of-duty-ghosts.jpg";
					this.cycleBgImages();
				}
			}.bind(this), function (error) {
				console.error("Unable to get Flickr images", error);
			});
		};

		this.cycleBgImages = function () {
			$timeout(function cycle() {
				if ($scope.bgImages) {
					$scope.activeBgImage = $scope.bgImages[$scope.activeBgImageIndex++ % $scope.bgImages.length];
				}
				//$timeout(cycle, 10000);
			});
		};

		$scope.refreshData = function () {

		};

		$scope.refreshData();
	})

	.controller("SettingsCtrl", function ($scope, Settings) {
		$scope.settings = Settings.getSettings();

		// Watch deeply for settings changes, and save them
		// if necessary
		$scope.$watch("settings", function () {
			Settings.save();
		}, true);

		$scope.closeSettings = function () {
			$scope.modal.hide();
		};

	});
