angular.module('gameboard.board.controllers', [])


.controller('GenresCtrl', function($scope,$ionicLoading, GenresService) {


    // Show what we are doing
    $ionicLoading.show({template:'Loading Genres...'});

    // Need to Check if we have got some already
    GenresService.all().then(function(genres) {

        // Paint 
        $scope.genres = genres;

        // Hide the Loading Message
        $ionicLoading.hide();

        // Let Angular know we have some data because of the Async nature of IBMBaaS
        // This is required to make sure the information is uptodate
        if (!$scope.$$phase) {
            $scope.$apply();
        }

    },function(err){

        // Handle Display of No Data and No Connection



        $ionicLoading.hide();
    });

})

// A simple controller that shows a tapped item's data
.controller('GamesCtrl', function($state,$scope, $stateParams,$ionicLoading, $ionicPopup, GenresService, GamesService) {

    // Lets check we have a 
    var genid = $stateParams.genid;

    // Access the Genres and get the Title and other information we need
    var genre = GenresService.getGenre(genid);

    // Display The Title
    $scope.title = genre.get('title');

    // Lets load the Videos for the Youtube Channel
    $ionicLoading.show({
        template: 'Loading Games...'
    });

    // Need to Check if we have got some already
    GamesService.all(genid).then(function(data) {

        // Check we have some Games for this Genre
        if (_.isNull(data)) {

            $ionicLoading.hide();

            var alertPopup = $ionicPopup.alert({
                title: 'Games',
                template: 'It seems we dont have a Games list defined for this Genre'
            });

			alertPopup.then(function(res) {
	            // Go Back to the Main Genres Screen
	            $state.go("board.genres");
		    });


        } else {

            // Layout the Games and the Banners
            $scope.games = data.get('games');
            $scope.banners = data.get('banners');
            $scope.gid = data.get('gid');
            $scope.genid = data.get('genid');

            $ionicLoading.hide();
            // Let Angular know we have some data because of the Async nature of IBMBaaS
            // This is required to make sure the information is uptodate
            if (!$scope.$$phase) {
                $scope.$apply();
            }
       } 

    },function(err){
        console.log(err);
        $ionicLoading.hide();
    });

})

// A simple controller that shows a tapped item's data
.controller('CategoriesCtrl', function($scope, $stateParams,$ionicLoading, CategoriesService,GamesService) {

    // Lets check we have a 
    var gmid = $stateParams.gmid;
    var genid = $stateParams.genid;

    // Access the Genres and get the Title and other information we need
    var game = GamesService.getGame(genid,gmid);

    // Display The Title
    $scope.title = game.title;

    $ionicLoading.show({template:'Loading Categories...'});

    // Need to Check if we have got some already
    CategoriesService.all($stateParams.gmid).then(function(data) {

        // Paint 
        $scope.banner = data.get('banner');
        $scope.categories = data.get('categories');
        $scope.gmid = data.get('gmid');

        $ionicLoading.hide();

        // This is required to make sure the information is uptodate
        if (!$scope.$$phase) {
            $scope.$apply();
        }

    },function(err){
        console.log(err);
        $ionicLoading.hide();
    });

})

// A simple controller that shows a tapped item's data
.controller('BoardCtrl', function($rootScope,$scope, $state, $stateParams, $ionicModal, $ionicLoading, BoardService, YouTubeService,WizardHandler) {

    var board = new Array();

    $scope.page = 0;
    $scope.pageSize = 20;
    $scope.total = 0;
    $scope.position = 0;

    // Load the Items
    $scope.loadItems = function(page, size) {

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
        BoardService.all($scope.bid,page,size).then(function(board) {

            // Reset the Array if we are on Page 1
            if($scope.page === 0) {
                // Prepare for the Query
                boardlist = new Array();
            }

            // Set the Title
            $scope.title = board.title;

            // Check what has been returned versus side of what we are returning
            angular.forEach(board.videos.rows, function(value, key) {
                boardlist.push(value.doc);
            });

            // Update the model with a list of Items
            $scope.videos = boardlist;

            // Take the details from the content
            // Use the Calcualtion
            $scope.total = board.videos.total_rows;
            $scope.position = board.videos.offset;
            $scope.coint

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

        }, function(err) {
            console.log(err);
            $ionicLoading.hide();
            $scope.board = null;

        });

    }

    // If we get close to the end of the list and we have more 
    $scope.loadMore = function() {

        if(!$scope.message) {
            $scope.message = 'Loading videos...';
        } else {    
            $scope.message = 'More videos...';
        }    

        // Check we can move one more page
        // Add Some More
        if($scope.page <= $scope.total) {
            $scope.loadItems($scope.page, $scope.pageSize);
        }    
    };

    // Handle a Refresh to the Beginning 
    $scope.onRefresh = function() {
        $scope.page = 0;
        $scope.message = null;
        $scope.loadMore();
    };

    $scope.onRefresh = function() {
        // Go back to the Cloud and load a new set of Objects as a hard refresh has been done
        $scope.loadItems();
    }

    // Create our modal
    $ionicModal.fromTemplateUrl('templates/add-video.html', function(modal) {
        $scope.videoModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    });

    $scope.addVideo = function(video) {

        // If they are not registered then you need to register
        if(!$scope.user.registered) {
            $state.go('register');
        }

        // Add the Item and then hide the modal view
        BoardService.add(video).then(
            function(payload) {
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
        YouTubeService.getYourVideos().then(function(data) {

            // Paint the List of Youtube Videos
            $scope.videos = data.items;

            // This is required to make sure the information is uptodate
            if (!$scope.$$phase) {
                $scope.$apply();
            }

            $ionicLoading.hide();

        },function(err){
            console.log(err)
            $ionicLoading.hide();
        });

        // Reverse the Paint Bug
        $scope.videoModal.show();

    };

    $scope.closeVideo = function() {
        // Reverse the Paint Bug
        $scope.videoModal.hide();
    };

    $scope.wizardBack = function(){

        if($scope.currentStep=="Videos") {
            $scope.back =false;
        }
        WizardHandler.wizard().previous();
    };

    $scope.selectVideo = function(_video){

        $scope.video = null;

        // Get the Video Details
        $scope.back = true;

        $ionicLoading.show({
            template: 'Fetching Video...'
        });

        // Lets get the Information we need
        var _id = null;
        if( _.has(_video,"snippet")) {
            var _id = _video.snippet.resourceId.videoId
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Youtube',
                template: 'The video item does not seem to be valid'
            });
            return;            
        }    

        // Get the Video Details
        YouTubeService.getVideo(_id).then(function(data) {

            // Paint the List of Youtube Videos
            $scope.video = data;

            // This is required to make sure the information is uptodate
            if (!$scope.$$phase) {
                $scope.$apply();
            }

            $ionicLoading.hide();


        }, function(err) {
            console.log(err)
            $ionicLoading.hide();
        });

        // Could make it display before, lets see how this works
        // Initialize the Video Display
        WizardHandler.wizard().next();

    };

    $scope.viewVideo = function(video) {
       
       // Check we have something to display
       if (!video) { 

            var alertPopup = $ionicPopup.alert({
                title: 'Youtube',
                template: 'The video item does not seem to be valid'
            });
            return;
       }

       // Prepare Video URL
       var videoUrl = ACCESS.EMBED+video.id;

       // Play a video with callbacks
       var options = {
        successCallback: function() {
          console.log("Video was closed without error.");
        },
        errorCallback: function(errMsg) {
          console.log("Error! " + errMsg);
        }
       };

       // Open the Media Player
       window.plugins.streamingMedia.playVideo(videoUrl, options);

    };    

    $scope.useVideo = function(video){

        // Flesh out the Video model from what we have let the user add the rest
        // Lets build up an Object model for the gamer to edit
        var bid = $scope.bid;
        var views = $scope.video.statistics.viewCount;
        try {
            bid = parseInt(bid);
            views = parseInt(views);
            rank = views;
        } catch (e){
            console.log(e);
        }

        // Build Model Object from known data and ask for a few more details
        // This composite model will be used by 
        $scope.add = {
            title: $scope.video.snippet.title,
            description : $scope.video.snippet.description,
            gametag : $scope.user.gametag,
            ytid : $scope.video.id,
            ytimage : $scope.video.snippet.thumbnails.default.url,
            bid : bid,
            muuid : $scope.user.raw.id,
            location : $scope.user.location,
            views : views,
            rank : views,
            recorddate : $scope.video.snippet.publishedAt,
            platform : "PS"

        };        

        // Initialize the Video Display
        WizardHandler.wizard().next();

    };

    $scope.addVideo = function(add){

        console.log("Add Video");
        if(!_.isObject(add)){
            console.log("Video to add is not an object");
        }

        // Add the Video to the Board
        BoardService.registerVideo(add).then(function(success){

            // Move to the Finish Wizard Page
            // Initialize the Video Display
            WizardHandler.wizard().next();

        }).catch(function(err) {

            var alertPopup = $ionicPopup.alert({
                title: 'Register',
                template: 'Failed to register video'
            });
            return;
        })

    }

    // Finish the Wizard 
    $scope.finish = function()
    {

        // Refresh the View 
        $scope.onRefresh();
        
        // Hide The dialog
        $scope.videoModal.hide();

    }

})

// A simple controller that shows retrieves a list of You Tube Videos
.controller('YTVideoDetailCtrl', function($scope, $stateParams, YouTubeService, $ionicLoading) {

    // Lets load the Videos for the Youtube Channel
    $ionicLoading.show({
        template: 'Loading ...'
    });


})

// A simple controller that shows retrieves a list of You Tube Videos
.controller('VideoCtrl', function($scope, $stateParams, VideoService,$ionicLoading) {

    // Retrieve the Video content
    // Lets load the Videos for the Youtube Channel
    $ionicLoading.show({
        template: 'Loading ...'
    });

    // Need to Check if we have got some already
    VideoService.get($stateParams.uuid).then(function(video) {

        // Paint 
        $scope.video = video;

        // This is required to make sure the information is uptodate
        if (!$scope.$$phase) {
            $scope.$apply();
        }
        $ionicLoading.hide();

    }, function(err) {
        console.log(err)
        $ionicLoading.hide();
    });

    // Add Sharing

    // Social information 

    // Likes helps etc etc 

    // Comments

});
