angular.module('gameboard.board.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('GenresService', function($q, $cacheFactory, URL) {

    // Use an internal Cache for storing the List and map the operations to manage that from 
    // MBaaS SDK Calls
    var cache = $cacheFactory('genres');

    return {

        all: function() {

            // Create a deffered
            var def = $q.defer();

            // Check if we have retrieved and stored already
            var genres = cache.get('genres');

            if (genres != undefined) {
                def.resolve(genres);
            } else {

                // Clear the Cache with a new set
                cache.remove('genres');

                // Lets Get a list of Genres
                $.ajax({
                    type: "GET",
                    url: URL.GENRES,
                    dataType: "json",
                    contentType: "application/json",
                    success: function(result,status) {

                        // Check if we were able to store it sucessfully
                        if (status === "success") {

                          // Place the Items in the Cache
                          cache.put('genres', result);

                          // return the Cache
                          def.resolve(cache.get('genres'));


                        } else {
                            def.reject([]);
                        }

                    },
                    error: function(err) {
                        def.reject(err);
                    }
                });
                
            }

            // Get the Objects for a particular Type
            return def.promise;


        }
    }

})

/**
 * A simple example service that returns some data.
 */
.factory('GamesService', function($q, $cacheFactory,$stateParams, URL) {

    // Use an internal Cache for storing the List and map the operations to manage that from 
    // MBaaS SDK Calls
    var cache = $cacheFactory('games');

    return {

        all: function(gid) {

            console.log("GID",gid);

            // Create a deffered
            var def = $q.defer();

            // Check if we have retrieved and stored already
            var games = cache.get('games');

            if (games != undefined) {
                def.resolve(games);
            } else {

                // Clear the Cache with a new set
                cache.remove('games');

                // TODO: NEED TO Replace the URL with a GID
                console.log("GID:",gid);

                // Lets Get a list of Genres
                $.ajax({
                    type: "GET",
                    url: URL.GAMES,
                    dataType: "json",
                    contentType: "application/json",
                    success: function(result,status) {

                        // Check if we were able to store it sucessfully
                        if (status === "success") {

                          // Place the Items in the Cache
                          cache.put('games', result);

                          // return the Cache
                          def.resolve(cache.get('games'));


                        } else {
                            def.reject([]);
                        }

                    },
                    error: function(err) {
                        def.reject(err);
                    }
                });
                
            }

            // Get the Objects for a particular Type
            return def.promise;


        }
    }

})

/**
 * A simple example service that returns some data.
 */
.factory('CategoriesService', function($q, $cacheFactory,$stateParams, URL) {

    // Use an internal Cache for storing the List and map the operations to manage that from 
    // MBaaS SDK Calls
    var cache = $cacheFactory('categories');

    return {

        all: function(cid) {

            console.log("CID:",cid);

            // Create a deffered
            var def = $q.defer();

            // Check if we have retrieved and stored already
            var cats = cache.get('categories');

            if (cats != undefined) {
                def.resolve(cats);
            } else {
                // Create a deffered
                var def = $q.defer();

                // Clear the Cache with a new set
                cache.remove('categories');

                // Lets Get a list of Genres
                $.ajax({
                    type: "GET",
                    url: URL.CATEGORIES,
                    dataType: "json",
                    contentType: "application/json",
                    success: function(result,status) {

                        // Check if we were able to store it sucessfully
                        if (status === "success") {

                          // Place the Items in the Cache
                          cache.put('categories', result);

                          // return the Cache
                          def.resolve(cache.get('categories'));


                        } else {
                            def.reject([]);
                        }

                    },
                    error: function(err) {
                        def.reject(err);
                    }
                });
                
            }

            // Get the Objects for a particular Type
            return def.promise;

        }
    }

})

/**
 * A simple example service that returns some data.
 */
.factory('BoardService', function($q, $cacheFactory,$stateParams, URL) {

    // Use an internal Cache for storing the List and map the operations to manage that from 
    // MBaaS SDK Calls

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

});
