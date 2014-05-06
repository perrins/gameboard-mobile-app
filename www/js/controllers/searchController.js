angular.module('gameboard.search.controllers', [])

.controller('SearchCtrl', function($scope, $location, $stateParams,SearchService) {

    var searchParam = "";

    $scope.loadMore = function() {

        // Need to Check if we have got some already
        SearchService.findVideos(searchParam).then(function(videos) {

            // Paint 
            $scope.videos = videos;

            $scope.$broadcast('scroll.infiniteScrollComplete');

            // Let Angular know we have some data because of the Async nature of IBMBaaS
            // This is required to make sure the information is uptodate
            if (!$scope.$$phase) {
                $scope.$apply();
            }

        });

    };

    // Check if we can load some more data
    $scope.moreDataCanBeLoaded = function(){

        return true;
    }

    // Search for Members
    $scope.findVideos = function() {

        debugger;

        $scope.loadMore();

    };

    $scope.$on('stateChangeSuccess', function() {
        $scope.loadMore();
    });

});