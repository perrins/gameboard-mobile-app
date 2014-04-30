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


});

