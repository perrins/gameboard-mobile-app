angular.module('gameboard.board.controllers', [])


.controller('GenresCtrl', function($scope, GenresService) {

    // Need to Check if we have got some already
    GenresService.all().then(function(genres) {

        // Paint 
        $scope.genres = genres;

        // Let Angular know we have some data because of the Async nature of IBMBaaS
        // This is required to make sure the information is uptodate
        if (!$scope.$$phase) {
            $scope.$apply();
        }

    });

})

// A simple controller that shows a tapped item's data
.controller('GamesCtrl', function($scope, $stateParams, GamesService) {

    debugger;

    var gid = $stateParams.genre.attributes.gid;
    $scope.title = $stateParams.genre.attributes.title;

    // Need to Check if we have got some already
    GamesService.all(gid).then(function(data) {

        // Layout the Games and the Banners
        $scope.games = data.get('games');
        $scope.banners = data.get('banners');
        $scope.gid = data.get('gid');
        $scope.gmid = data.get('gmid');

        // Let Angular know we have some data because of the Async nature of IBMBaaS
        // This is required to make sure the information is uptodate
        if (!$scope.$$phase) {
            $scope.$apply();
        }

    });

})

// A simple controller that shows a tapped item's data
.controller('CategoriesCtrl', function($scope, $stateParams, CategoriesService) {

    // Need to Check if we have got some already
    CategoriesService.all($stateParams.cid).then(function(data) {

        // Paint 
        $scope.banner = data.banner;
        $scope.categories = data.categories;
        $scope.cid = data.cid;

        // This is required to make sure the information is uptodate
        if (!$scope.$$phase) {
            $scope.$apply();
        }

    });

    $scope.selected = function(game) {

        console.log(game);

    }

})


// A simple controller that shows a tapped item's data
.controller('BoardCtrl', function($scope, $stateParams,$ionicModal, $ionicLoading,BoardService,YouTubeService) {

    // Load the Items
    $scope.loadItems = function() {

        // Clear the List before adding new items
        // This needs to be improved
        $scope.board = [];

        // Refresh
        if (!$scope.$$phase) {
            $scope.$apply();
        }

        // Because we are retrieving all the items every time we do something
        // We need to clear the list before loading in some new values
        $ionicLoading.show({
            template: 'Loading...'
        });

        // Because we are retrieving all the items every time we do something
        // We need to clear the list before loading in some new values

        // "List is " is a service returning data from the 
        BoardService.all($stateParams.bid).then(function(board) {

            // Update the model with a list of Items
            $scope.board = board;

            // Let Angular know we have some data because of the Async nature of IBMBaaS
            // This is required to make sure the information is uptodate
            if (!$scope.$$phase) {
                $scope.$apply();
            }

            $ionicLoading.hide();

            // Trigger refresh complete on the pull to refresh action
            $scope.$broadcast('scroll.refreshComplete');

        }, function(err) {
            console.log(err);
            $ionicLoading.hide();

            $scope.board = null;

        });

    }

    // Load some items for the list to display
    $scope.loadItems();

    $scope.onRefresh = function() {
        // Go back to the Cloud and load a new set of Objects as a hard refresh has been done
        $scope.loadItems();
    }

    // Create our modal
    $ionicModal.fromTemplateUrl('templates/add-video.html', function(modal) {
        $scope.itemModal = modal;

    }, {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    });

    $scope.addVideo = function(video) {

        // Add the Item and then hide the modal view
        BoardService.add(video).then(
            function(payload){

                console.log("Video Added");

            }, 
            function(err) {

                console.log(err);

            }
        );

        // Hide the Modal View
        $scope.closeVideo();

    };

    $scope.newVideo = function() {

        $ionicLoading.show({
            template: 'Getting Videos...'
        });

        // Load the Videos
        YouTubeService.all().then(function(videos){

            $scope.videos = videos;

            if (!$scope.$$phase) {
                $scope.$apply();
            }

            $ionicLoading.hide();

            $scope.itemModal.show();

        });

    };

    $scope.closeVideo = function() {
        // Reverse the Paint Bug
        $scope.itemModal.hide();

    }
    $scope.clearSearch = function() {
        $scope.item.name = '';
    };

    $scope.itemButtons = [{
        text: 'Share',
        type: 'button-assertive',
        onTap: function(item) {
            $scope.onShare(item);
        }
    }];

})
// A simple controller that shows retrieves a list of You Tube Videos
.controller('AddVideoCtrl', function($scope, $stateParams, YouTubeService,$ionicLoading) {

    // Lets load the Videos for the Youtube Channel
    $ionicLoading.show({
            template: 'Loading ...'
    });

    // Need to Check if we have got some already
    YouTubeService.getYourVideos().then(function(data) {

        // Paint the List of Youtube Videos
        $scope.videos = data.items;

        // This is required to make sure the information is uptodate
        if (!$scope.$$phase) {
            $scope.$apply();
        }

        $ionicLoading.hide();
    });

})


// A simple controller that shows retrieves a list of You Tube Videos
.controller('VideoCtrl', function($scope, $stateParams, VideoService) {

    // Retrieve the Video content

    // Need to Check if we have got some already
    VideoService.get($stateParams.id).then(function(video) {

        // Paint 
        $scope.video = video;

        // This is required to make sure the information is uptodate
        if (!$scope.$$phase) {
            $scope.$apply();
        }

    });

});





