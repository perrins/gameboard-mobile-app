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

    $scope.selected = function(genre) {
        debugger;
    }

})

// A simple controller that shows a tapped item's data
.controller('GamesCtrl', function($scope, $stateParams, GamesService) {

    // Need to Check if we have got some already
    GamesService.all($stateParams.gid).then(function(data) {

        // Paint 
        $scope.games = data.games;
        $scope.banners = data.banners;
        $scope.gid = data.gid;
        $scope.id = data.id;

        // Let Angular know we have some data because of the Async nature of IBMBaaS
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

        debugger;
        console.log(game);

    }


})


// A simple controller that shows a tapped item's data
.controller('BoardCtrl', function($scope, $stateParams, CategoriesService) {

    // Load the Items
    $scope.loadItems = function() {

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
        BoardService.all(b$stateParams.id).then(function(list) {

            // Update the model with a list of Items
            $scope.list = list;

            // Let Angular know we have some data because of the Async nature of IBMBaaS
            // This is required to make sure the information is uptodate
            if (!$scope.$$phase) {
                $scope.$apply();
            }

            // Trigger refresh complete on the pull to refresh action
            $scope.$broadcast('scroll.refreshComplete');

        }, function(err) {
            console.log(err);
        });

    }

    $scope.onRefresh = function() {
        // Go back to the Cloud and load a new set of Objects as a hard refresh has been done
        $scope.loadItems();
    }

    // Create our modal
    $ionicModal.fromTemplateUrl('add-video.html', function(modal) {
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
        $scope.closeItem();

    };

    $scope.newVideo = function() {
        $scope.itemModal.show();
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

});


