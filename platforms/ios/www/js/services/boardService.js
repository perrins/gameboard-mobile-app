angular.module('gameboard.board.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('GenresService', function($q, $cacheFactory, ACCESS) {

     // Use an internal Cache for storing the List and map the operations to manage that from
    // Mobile Cloud SDK Calls
    var cache = $cacheFactory('Genres');

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

        },
        getGenre: function(gid){

            // Resolve the Cache
            var genres = cache.get(ACCESS.GENRES);

            var _genre = null;
            genres.forEach(function(genre){
                if(genre.get('gid') == gid) {
                    _genre = genre;
                }
            })

            return _genre;

        }

    }

})

/**
 * A simple example service that returns some data.
 */
.factory('GamesService', function($q, $cacheFactory,$stateParams, ACCESS) {

     // Use an internal Cache for storing the List and map the operations to manage that from
    // Mobile Cloud SDK Calls
    var cache = $cacheFactory('Games');

    return {

        // Return all the Objects for a Given Class
        all: function(genid) {

            var _genid = null
            try{
                var _genid = parseInt(genid);
            } catch(err) {
                console.log("GID supplied is not valid",err);
            
            }
            // Check the GID
            if( _.isNull(_genid)) {
                console.log("GID could not be used");
            }

            // Create a Defer as this is an async operation
            defer = $q.defer();
            var items = cache.get(genid+"_"+ACCESS.GAMES);

            if(!_.isUndefined(items)) {
                defer.resolve(items);
            } else {

                // get the Data Service
                var data = IBMData.getService();

                // Clear the Cache with a new set
                cache.remove(genid+"_"+ACCESS.GAMES);

                // Get the Games for a Specific Genre
                var query = data.Query.ofType(ACCESS.GAMES);
                query.find({genid:_genid}).done(function(list) {

                    // Check if this is a list and array
                    if(_.isArray(list) && list.length >0) {

                        // Place the Items in the Cache
                        cache.put(genid+"_"+ACCESS.GAMES, list[0]);

                        // return the Cache
                        defer.resolve(cache.get(genid+"_"+ACCESS.GAMES));

                    } else {

                        // Send empty array back, its not an error to get empty data
                        // return the Cache
                        defer.resolve(null);

                    }

                },function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }    

            // Get the Objects for a particular Type
            return defer.promise;

        },
        getGame: function(genid,gmid){

            // Resolve the Cache
            var item = cache.get(genid+"_"+ACCESS.GAMES);
            var _game = null;
            var games = item.get('games')
            games.forEach(function(game){
                if(game.gmid == gmid) {
                    _game = game;
                }
            })
            return _game;
        }
    }
})

/**
 * A simple example service that returns some data.
 */
.factory('CategoriesService', function($q, $cacheFactory,$stateParams, ACCESS) {

    // Use an internal Cache for storing the List and map the operations to manage that from
    // Mobile Cloud SDK Calls
    var cache = $cacheFactory('Categories');

    return {

           // Return all the Objects for a Given Class
        all: function(gmid) {

            var _gmid = null
            try{
                var _gmid = parseInt(gmid);
            } catch(err) {
                console.log("GMID supplied is not valid",err);
            
            }
            // Check the GID
            if( _.isNull(_gmid)) {
                console.log("GMID could not be used");
            }

            // Create a Defer as this is an async operation
            defer = $q.defer();
            var items = cache.get(gmid+"_"+ACCESS.CATEGORIES);

            if(!_.isUndefined(items)) {
                defer.resolve(items);
            } else {

                // get the Data Service
                var data = IBMData.getService();

                // Clear the Cache with a new set
                cache.remove(gmid+"_"+ACCESS.CATEGORIES);

                // Get the Genres
                var query = data.Query.ofType(ACCESS.CATEGORIES);
                query.find({"gmid":_gmid}).done(function(list) {

                    // Check if this is a list and array
                    if(_.isArray(list) && list.length >0) {
                        // Place the Items in the Cache
                        cache.put(gmid+"_"+ACCESS.CATEGORIES, list[0]);
                        // return the Cache
                        defer.resolve(list[0]);

                     } else {
                        defer.resolve(null);
                     }   

                },function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }    

            // Get the Objects for a particular Type
            return defer.promise;

        },
        getCategory: function(cid){

            // Resolve the Cache
            var cats = cache.get(ACCESS.CATEGORIES);
            var _cat = null;
            cats.forEach(function(cat){
                if(cat.get('cid') == cid) {
                    _cat = cat;
                }
            })

            return _cat;

        }
    }

})

/**
 * A simple example service that returns some data.
 */
.factory('BoardService', function($q, $cacheFactory,$stateParams, ACCESS) {

    return {

        all: function(bid) {

            // USE THE CloudCode to Call the Board Services
            // This will integrate with Cloudant to retrieve a list of videos for a Board
            // Need to manage the Paging for this and sort it by ranking
            // Lets build a 
            var uri = new IBMUriBuilder().append(ACCESS.BOARD).append(bid).toString();
            var cc = IBMCloudCode.getService();

            // Get the Videos for my Board
            cc.get(uri,{"handleAs":"json"}).then(function(videos){

                // Lets resolve these
                var _videos = new Array();
                // Loop through the videos
                videos.forEach(function(video){
                    _videos.push(video.fields);
                });
                def.resolve(_videos);

            }).catch(function(err){
                console.log(err);
                def.reject(err);
            })

            // Create a deffered
            var def = $q.defer();

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

        },
        getVideo: function(id) {

            // Create a deffered
            var def = $q.defer();

            // Get Cloud Code
            var cc = IBMCloudCode.getService();

            // Build out a new URI builder
            var _uri = new IBMUriBuilder().slash().append(ACCESS.YT_VIDEO_DETAIL).append(id).toString();

            // Get the Details of the Video
            cc.get(_uri,{"handleAs":"json"}).then(function(video){
                def.resolve(video);
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
.factory('VideoService', function($rootScope, $q, $cacheFactory,ACCESS) {

    return {

        get : function(uuid) {

            // Create a deffered
            var def = $q.defer();

            // Get Cloud Code
            var cc = IBMCloudCode.getService();

            // Get the Video and its Detail
            var uri = new IBMUriBuilder().append(ACCESS.VIDEO).append(uuid).toString();
            cc.get(uri,{"handleAs":"json"}).then(function(video){

                // Return the Video 
                var _video = null;
                if(video.length > 0 && _.has(video[0],"doc")) {
                    _video = video[0].doc;
                }
                // Resolve Promise
                def.resolve(_video);

            }).catch(function(err){
                console.log(err);
                def.reject(err);
            })

            // Get the Objects for a particular Type
            return def.promise;

        },

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





