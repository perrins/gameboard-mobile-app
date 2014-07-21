angular.module('gameboard.board.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('GenresService', function($q, $cacheFactory, ACCESS) {

     // Use an internal Cache for storing the List and map the operations to manage that from
    // Mobile Cloud SDK Calls
    var cache = $cacheFactory('');

    return {

        // Return all the Objects for a Given Class
        all: function() {

            // Create a Defer as this is an async operation
            defer = $q.defer();

            var items = cache.get(ACCESS.GENRES);

            if(!_.isUndefined(items)) {
                defer.resolve(items);
            } else {

                // get the Data Service
                var data = IBMData.getService();

                // Clear the Cache with a new set
                cache.remove(ACCESS.GENRES);

                // Get the Genres
                var query = data.Query.ofType(ACCESS.GENRES);
                query.find().done(function(list) {

                    // Place the Items in the Cache
                    cache.put(ACCESS.GENRES, list);

                    // return the Cache
                    defer.resolve(list);

                },function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }    

            // Get the Objects for a particular Type
            return defer.promise;

        }

    }

})

/**
 * A simple example service that returns some data.
 */
.factory('GamesService', function($q, $cacheFactory,$stateParams, ACCESS) {

     // Use an internal Cache for storing the List and map the operations to manage that from
    // Mobile Cloud SDK Calls
    var cache = $cacheFactory('');

    return {

        // Return all the Objects for a Given Class
        allCloud: function(cid) {

            // get the Data Service
            var data = IBMData.getService();

            // Create a Defer as this is an async operation
            defer = $q.defer();

            // Clear the Cache with a new set
            cache.remove(ACCESS.GAMES+cid);

            var query = data.Query.ofType(ACCESS.GAMES);
            query.find({cid:cid}).done(function(list) {

                // Place the Items in the Cache
                cache.put(ACCESS.GAMES+cid, list);

                // return the Cache
                defer.resolve(cache.get(URL.GAMES+cid));

            },function(err){
                console.log(err);
                defer.reject(err);
            });

            // Get the Objects for a particular Type
            return defer.promise;

        },

        // Return the Cached List
        allCache: function(cid) {

            // Create a Defer as this is an async operation
            defer = $q.defer();

            var items = cache.get(ACCESS.GAME+cid);

            // Check we have some data            
            if (_.isNull(items)) {
                items = this.allCloud(cid);
            }
            // Return the Items
            defer.resolve(items);

            // Return the Cached Items
            return defer.promise;

        }
    }
})

/**
 * A simple example service that returns some data.
 */
.factory('CategoriesService', function($q, $cacheFactory,$stateParams, ACCESS) {

    // Use an internal Cache for storing the List and map the operations to manage that from
    // Mobile Cloud SDK Calls
    var cache = $cacheFactory('');

    return {

        // Return all the Objects for a Given Class
        allCloud: function(cid) {

            // get the Data Service
            var data = IBMData.getService();

            // Create a Defer as this is an async operation
            defer = $q.defer();

            // Clear the Cache with a new set
            cache.remove(ACCESS.CATEGORIES+cid);

            var query = data.Query.ofType(ACCESS.CATEGORIES);
            query.find({cid:cid}).done(function(list) {

                // Place the Items in the Cache
                cache.put(ACCESS.CATEGORIES+cid, list);

                // return the Cache
                defer.resolve(cache.get(URL.CATEGORIES+cid));

            },function(err){
                console.log(err);
                defer.reject(err);
            });

            // Get the Objects for a particular Type
            return defer.promise;

        },

        // Return the Cached List
        allCache: function(cid) {

            // Create a Defer as this is an async operation
            defer = $q.defer();

            var items = cache.get(ACCESS.CATEGORIES+cid);

            // Check we have some data            
            if (_.isNull(items)) {
                items = this.allCloud(cid);
            }
            // Return the Items
            defer.resolve(items);

            // Return the Cached Items
            return defer.promise;

        }
    }

})

/**
 * A simple example service that returns some data.
 */
.factory('BoardService', function($q, $cacheFactory,$stateParams, URL) {

    return {

        all: function(bid) {

            console.log("BID:",bid);

            // Create a deffered
            var def = $q.defer();

            // Lets Get a list of Genres
            $.ajax({
                type: "GET",
                url: URL.BOARD,
                dataType: "json",
                contentType: "application/json",
                success: function(result,status) {

                    // Check if we were able to store it sucessfully
                    if (status === "success") {

                      // return the Cache
                      def.resolve(result);

                    } else {
                        def.reject([]);
                    }

                },
                error: function(err) {
                    def.reject(err);
                }
            });
            
            // Get the Objects for a particular Type
            return def.promise;

        }
    }

})

/**
 * A simple example service that returns some data.
 */
.factory('YouTubeService', function($q, $cacheFactory,$stateParams, ACCESS) {

    return {

        getYourVideos: function() {

            // Create a deffered
            var def = $q.defer();

            // Get Cloud Code
            var cc = IBMCloudCode.getService();

            cc.get(ACCESS.YOUR_VIDEOS,{"handleAs":"json"}).then(function(videos){
                def.resolve(videos);
            }).catch(function(err){
                console.log(err);
                def.reject(err);
            })

            // Get the Objects for a particular Type
            return def.promise;

        }
    }

})

/**
 * A simple example service that returns some data.
 */
.factory('VideoService', function($rootScope, $q, $cacheFactory) {

    // Use an internal Cache for storing the List and map the operations to manage that from
    // Mobile Cloud SDK Calls
    var cache = $cacheFactory('');
    var options = {
        handleAs: 'JSON'
    };

    return {

        // Add a Video to Game Board
        add: function(video) {

            // Manage Defer on the Save
            var defer = $q.defer();

            // get the Data Service
            var data = IBMCloudCode.getService();

            // Validate Contents of Video Object
            // Key Data
            // Link the three pieces of information, the board the user and the video
            // boardId. 
            // youtubeid
            // userid 

            // Send the Video request to the Bluemix to be added into the Cloudant Database
            cc.post("/board/video",video,options).done(function(video){
                // Was added successfully
                def.resolve(video);
            }).catch(function(err){
                console.log(err)
                def.reject(err);
            });

            // Return a promise for the async operation of save
            return defer.promise;

        },

        put: function(item) {

            // Create a deferred
            var defer = $q.defer();

            // get the Data Service
            var data = IBMData.getService();

            //Get the object with the given id
            data.Object.withId(item.getId()).then(function(item) {

                // Create Data to Update
                var attributes = {
                    name: item.get('name')
                };

                // Update the Contents of the Object
                item.set(attributes);

                // Save the updated items
                return item.save();

            }).done(function(saved) {



                defer.resolve(saved);
            },function(err){
                defer.reject(err);
            });        

            // Return a promise for the async operation of save
            return defer.promise;

        },

        del: function(item) {

            var defer = $q.defer();

            // get the Data Service
            var data = IBMData.getService();

            // Remove the Item from the Cache
            var items = cache.get('items');
            items.splice(items.indexOf(item), 1)

            //Get the object with the given id so we can delete it
            data.Object.withId(item.getId()).then(function(item) {
                // Delete the Item from the Cloud 
                return item.del();
            }).done(function(deleted) {
                // Validated it was deleted
                var isDeleted = deleted.isDeleted();
                if (deleted.isDeleted()) {
                    defer.resolve(deleted);
                } else {
                    defer.reject(err);
                }
            });

            // Remove it
            return defer.promise;

        }
    }

});





