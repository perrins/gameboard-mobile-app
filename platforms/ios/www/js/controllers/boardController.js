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
.controller('GamesCtrl', function($scope, $stateParams, $ionicPopup, GenresService, GamesService) {

    // Lets check we have a 
    var genid = $stateParams.genid;

    // Access the Genres and get the Title and other information we need
    var genre = GenresService.getGenre(genid);

    // Display The Title
    $scope.title = genre.get('title');

    // Need to Check if we have got some already
    GamesService.all(genid).then(function(data) {

        // Check we have some Games for this Genre
        if (_.isNull(data)) {
            var alertPopup = $ionicPopup.alert({
                title: 'Games',
                template: 'It seems we dont have a Games list defined for this Genre'
            });
        } else {

            // Layout the Games and the Banners
            $scope.games = data.get('games');
            $scope.banners = data.get('banners');
            $scope.gid = data.get('gid');
            $scope.genid = data.get('genid');

            // Let Angular know we have some data because of the Async nature of IBMBaaS
            // This is required to make sure the information is uptodate
            if (!$scope.$$phase) {
                $scope.$apply();
            }
       } 

    });

})

// A simple controller that shows a tapped item's data
.controller('CategoriesCtrl', function($scope, $stateParams, CategoriesService,GamesService) {

    // Lets check we have a 
    var gmid = $stateParams.gmid;
    var genid = $stateParams.genid;

    // Access the Genres and get the Title and other information we need
    var game = GamesService.getGame(genid,gmid);

    // Display The Title
    $scope.title = game.title;

    // Need to Check if we have got some already
    CategoriesService.all($stateParams.gmid).then(function(data) {

        // Paint 
        $scope.banner = data.get('banner');
        $scope.categories = data.get('categories');
        $scope.gmid = data.get('gmid');

        // This is required to make sure the information is uptodate
        if (!$scope.$$phase) {
            $scope.$apply();
        }

    });

})

// A simple controller that shows a tapped item's data
.controller('BoardCtrl', function($rootScope,$scope, $state, $stateParams, $ionicModal, $ionicLoading, BoardService, YouTubeService,WizardHandler) {

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
        BoardService.all($stateParams.bid).then(function(videos) {

            // Need to add the other information to the Board,
            // That information has come in from the Request
            // Temp until we get add working
            var board = { "bid":$stateParams.bid,
                    "title"         : "Golden Gun",
                    "subtitle"      : "Best golden gun moments",
                    "description"   :"Imagine all the best golden gun moments in one organised leader board and watch the best of the best",
                    "number"        : 1234,
                    "prizes"        : "£3,500",
                    "date"          : "01/05/2014",
                    "videos" : videos };

            // Update the model with a list of Items
            $scope.board = board;

            // Let Angular know we have some data because of the Async nature of IBMBaaS
            // This is required to make sure the information is uptodate
            if (!$scope.$$phase) {
                $scope.$apply();
            }

            // Hide the loading icons
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
        $scope.videoModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    });

    $scope.addVideo = function(video) {
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

        debugger;

        if($scope.currentStep=="Videos") {
            $scope.back =false;
        }
        WizardHandler.wizard().previous();
    };

    $scope.selectVideo = function(_video){

        debugger;

        $scope.video = null;

        // Get the Video Details
        $scope.back = true;

        $ionicLoading.show({
            template: 'Loading Video...'
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

        // Initialize the Video Display
        WizardHandler.wizard().next();

    };

    $scope.viewVideo = function(video) {

       debugger;

       /*
       // Check we have something to display
       if (video && _.isUndefined(StreamingMedia)) { 

            var alertPopup = $ionicPopup.alert({
                title: 'Youtube',
                template: 'The video item does not seem to be valid'
            });
            return;
       } */

       var videoUrl = "http://www.youtube.com/embed/FUKiPNXW5f8";

       // Play a video with callbacks
       var options = {
        successCallback: function() {
          console.log("Video was closed without error.");
        },
        errorCallback: function(errMsg) {
          console.log("Error! " + errMsg);
        }
       };
       window.plugins.streamingMedia.playVideo(videoUrl, options);

    }    

    $scope.useVideo = function(video){

        debugger;

        // Initialize the Video Display
        WizardHandler.wizard().next();

    };

    $scope.addVideo = function(){
        consolelog("Add Video");
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
