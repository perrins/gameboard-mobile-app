angular.module("gameboard.search.controllers", [])

.controller("SearchCtrl", function ($scope, $location, $ionicLoading, $stateParams,SearchService) {

	var searchParam = "";

	var videos = new Array();

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
        SearchService.all(searchParam,page,size).then(function(_videos) {

            // Reset the Array if we are on Page 1
            if($scope.page === 0) {
                // Prepare for the Query
                videos = new Array();
            }

            // Set the Title
            $scope.title = searchParam;

            // Check what has been returned versus side of what we are returning
            angular.forEach(_videos, function(value, key) {
                videos.push(value);
            });

            // Update the model with a list of Items
            $scope.videos = videos;

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
            $scope.message = 'Fetching Videos...';
        } else {    
            $scope.message = 'More Videos...';
        }    

        // Check we can move one more page
        // Add Some More
        if($scope.page <= $scope.total) {
            $scope.loadItems($scope.page, $scope.pageSize);
        }    
    };

	// Search for Members
	$scope.findVideos = function () {

		$scope.page = 0;
		$scope.loadMore();
	};

	$scope.$on("stateChangeSuccess", function () {
		$scope.loadMore();
	});

});
