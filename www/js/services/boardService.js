/*
 *  Licensed Materials - Property of Gameboard Ltd
 *  2014 (C) Copyright Gameboard Ltd. 2011,2014. All Rights Reserved.
 *  UK Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with Gameboard Ltd.
 *
 *  Board Services
 * 
 */
 
angular.module('gameboard.board.services', [])

/*
function(doc){
 index('uuid', doc._id, { 'facet': true ,'store':true});
 index('bid', doc.bid, { 'facet': true ,'store':true});
 index('title', doc.title, { 'facet': true ,'store':true});
 index('description', doc.description, { 'facet': true ,'store':true});
 index('rank', doc.rank, { 'facet': true ,'store':true});
 index('ytimage', doc.ytimage, { 'facet': true ,'store':true});
 index('yttd', doc.ytid, { 'facet': true ,'store':true});
 index('views', doc.views, { 'facet': true ,'store':true});
 index('gametag', doc.gametag, { 'facet': true ,'store':true});
 index('muuid', doc.muuid, { 'facet': true ,'store':true});
}
*/


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

            if (!_.isUndefined(items)) {
                defer.resolve(items);
            } else {

                // Clear the Cache with a new set
                cache.remove(ACCESS.GENRES);

                // Get handle to the CloudCode service
                var cc = IBMCloudCode.getService();

                // USE THE CloudCode to Call the Board Services
                // This will integrate with Cloudant to retrieve a list of videos for a Board
                // Need to manage the Paging for this and sort it by ranking
                // Lets build a 
                var uri = new IBMUriBuilder().append(ACCESS.GENRES).toString();

                // Get the Genres
                cc.get(uri, {
                    "handleAs": "json"
                }).then(function(list) {

                    // Place the Items in the Cache
                    cache.put(ACCESS.GENRES, list);
                    // return the Cache
                    defer.resolve(cache.get(ACCESS.GENRES));

                }).catch(function(err) {
                    console.log(err);
                    defer.reject(err);
                })

            }

            // Get the Objects for a particular Type
            return defer.promise;

        },
        getGenre: function(gid) {

            var def = $q.defer();

            // Resolve the Cache            
            this.all().then( function(genres) {

                var _genre = null;
                genres.forEach(function(genre) {
                    if (genre.gid == gid) {
                        _genre = genre;
                    }
                })

                // Check if we have found one
                if(!_.isNull(_genre)) {
                    def.resolve(_genre);
                } else {
                    def.reject(_genre);
                }

            },function(err){
                def.reject(err);
            });

            return def.promise;

        }

    }

})

/**
 * A simple example service that returns some data.
 */
.factory('GamesService', function($q, $cacheFactory, $stateParams, ACCESS) {

    // Use an internal Cache for storing the List and map the operations to manage that from
    // Mobile Cloud SDK Calls
    var cache = $cacheFactory('Games');

    return {

        // Return all the Objects for a Given Class
        all: function(genid) {

            var _genid = null
            try {
                var _genid = parseInt(genid);
            } catch (err) {
                console.log("GID supplied is not valid", err);

            }
            // Check the GID
            if (_.isNull(_genid)) {
                console.log("GID could not be used");
            }

            // Create a Defer as this is an async operation
            defer = $q.defer();

            var items = cache.get(genid + "_" + ACCESS.GAMES);

            if (!_.isUndefined(items)) {
                defer.resolve(items);
            } else {

                // Get handle to the CloudCode service
                var cc = IBMCloudCode.getService();

                // USE THE CloudCode to Call the Board Services
                // This will integrate with Cloudant to retrieve a list of videos for a Board
                // Need to manage the Paging for this and sort it by ranking
                // Lets build a 
                var uri = new IBMUriBuilder().append(ACCESS.GAMES).toString();

                // Clear the Cache with a new set
                cache.remove(genid + "_" + ACCESS.GAMES);

                // Get the Genres
                // Get the Videos for my Board
                cc.get(uri, {
                    "handleAs": "json"
                }).done(function(list) {

                    // Check if this is a list and array
                    if (_.isObject(list) ) {

                        // Place the Items in the Cache
                        cache.put(genid + "_" + ACCESS.GAMES, list);

                        // return the Cache
                        defer.resolve(cache.get(genid + "_" + ACCESS.GAMES));

                    } else {

                        // Send empty array back, its not an error to get empty data
                        // return the Cache
                        defer.resolve(null);

                    }

                }, function(err) {
                    console.log(err);
                    defer.reject(err);
                });
            }

            // Get the Objects for a particular Type
            return defer.promise;

        },
        getGame: function(genid, gmid) {

            var def = $q.defer();

            // Resolve the Cache            
            this.all(genid).then( function(item) {

                var games = item.games
                var _game = null;
                games.forEach( function(game) {
                    if (game.gmid == gmid) {
                        _game = game;
                    }
                });

                // Check if we have found one
                if(!_.isNull(_game)) {
                    def.resolve(_game);
                } else {
                    def.reject(_game);
                }

            },function(err){
                def.reject(err);
            });

            return def.promise;
        }
    }
})

/**
 * A simple example service that returns some data.
 */
.factory('CategoriesService', function($q, $cacheFactory, $stateParams, ACCESS) {

    // Use an internal Cache for storing the List and map the operations to manage that from
    // Mobile Cloud SDK Calls
    var cache = $cacheFactory('Categories');

    return {

        // Return all the Objects for a Given Class
        all: function(gmid) {

            var _gmid = null
            try {
                var _gmid = parseInt(gmid);
            } catch (err) {
                console.log("GMID supplied is not valid", err);

            }
            // Check the GID
            if (_.isNull(_gmid)) {
                console.log("GMID could not be used");
            }

            // Create a Defer as this is an async operation
            defer = $q.defer();
            var items = cache.get(gmid + "_" + ACCESS.CATEGORIES);

            if (!_.isUndefined(items)) {
                defer.resolve(items);
            } else {

                // Get handle to the CloudCode service
                var cc = IBMCloudCode.getService();

                // USE THE CloudCode to Call the Board Services
                // This will integrate with Cloudant to retrieve a list of videos for a Board
                // Need to manage the Paging for this and sort it by ranking
                // Lets build a 
                var uri = new IBMUriBuilder().append(ACCESS.CATEGORIES).toString();

                // Clear the Cache with a new set
                cache.remove(gmid + "_" + ACCESS.CATEGORIES);

                // Get the Genres
                // Get the Videos for my Board
                cc.get(uri, {
                    "handleAs": "json"
                }).done(function(list) {

                    // Check if this is a list and array
                    if (_.isObject(list) ) {

                        // Place the Items in the Cache
                        cache.put(gmid + "_" + ACCESS.CATEGORIES, list);

                        // return the Cache
                        defer.resolve(cache.get(gmid + "_" + ACCESS.CATEGORIES));

                    } else {
                        defer.resolve(null);
                    }

                }, function(err) {

                    console.log(err);
                    defer.reject(err);
                });
            }

            // Get the Objects for a particular Type
            return defer.promise;

        },
        getCategory: function(cid) {

            // Resolve the Cache
            var cats = cache.get(ACCESS.CATEGORIES);

            // Load if not loaded
            if (_.isUndefined(cats)) {
                cats = this.all();
            }

            var _cat = null;
            cats.forEach(function(cat) {
                if (cat.cid == cid) {
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
.factory('BoardService', function($q, $cacheFactory, $stateParams, ACCESS) {

    return {

        all: function(bid,page,size) {

            // Create a deffered
            var def = $q.defer();

            // Get handle to the CloudCode service
            var cc = IBMCloudCode.getService();

            // USE THE CloudCode to Call the Board Services
            // This will integrate with Cloudant to retrieve a list of videos for a Board
            // Need to manage the Paging for this and sort it by ranking
            // Lets build a 
            var uri = new IBMUriBuilder().append(ACCESS.BOARD).append(bid).toString();

            // Add the Paging to the BoardList and Get back what we have
            uri += "?skip="+page+"&limit="+size;

            // Get the Videos for my Board
            cc.get(uri, {
                "handleAs": "json"
            }).then(function(videos) {

                def.resolve(videos);

            }).catch(function(err) {
                console.log(err);
                def.reject(err);
            })

            // Get the Objects for a particular Type
            return def.promise;

        },
        registerVideo: function(video) {

            // Process a Defer
            var def = $q.defer();

            // Get the Cloud Code Service
            var cc = IBMCloudCode.getService();

            // Add the Video to the Board
            cc.post(ACCESS.VIDEOS, video, {
                "handleAs": "json"
            }).then(function(success) {

                def.resolve(true);

            }).catch(function(err) {

                def.reject(err);
            });

            return def.promise;

        }
    }

})

/**
 * A simple example service that returns some data.
 */
.factory('YouTubeService', function($q, $cacheFactory, $stateParams, ACCESS) {

    return {

        getYourVideos: function() {

            // Create a deffered
            var def = $q.defer();

            // Get Cloud Code
            var cc = IBMCloudCode.getService();

            cc.get(ACCESS.YOUTUBE_YOURS, {
                "handleAs": "json"
            }).then(function(videos) {
                def.resolve(videos);
            }).catch(function(err) {
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
            cc.get(_uri, {
                "handleAs": "json"
            }).then(function(video) {
                var _video = null;
                if (video.items.length > 0) {
                    _video = video.items[0];
                }
                def.resolve(_video);
            }).catch(function(err) {
                console.log(err);
                def.reject(err);
            })

            // Get the Objects for a particular Type
            return def.promise;


        },

        getVideoByYTID: function(ytid) {

            // Create a deffered
            var def = $q.defer();

            // Get Cloud Code
            var cc = IBMCloudCode.getService();

            // Build out a new URI builder
            var _uri = new IBMUriBuilder().slash().append(ACCESS.BYYTID).append(ytid).toString();

            // Get the Details of the Video
            cc.get(_uri, {
                "handleAs": "json"
            }).then(function(video) {

                var _video = null;
                if (video.items.length > 0) {
                    _video = video.items[0];
                }
                def.resolve(_video);

            }).catch(function(err) {
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
.factory('VideoService', function($rootScope, $q, $cacheFactory, ACCESS) {

    return {

        get: function(uuid) {

            // Create a deffered
            var def = $q.defer();

            // Get Cloud Code
            var cc = IBMCloudCode.getService();

            // Get the Video and its Detail
            var uri = new IBMUriBuilder().append(ACCESS.VIDEOS).append(uuid).toString();
            cc.get(uri, {
                "handleAs": "json"
            }).then(function(video) {

                // Resolve Promise
                def.resolve(video);

            }).catch(function(err) {
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
            cc.post("/board/video", video, options).done(function(video) {
                // Was added successfully
                def.resolve(video);
            }).catch(function(err) {
                console.log(err)
                def.reject(err);
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
