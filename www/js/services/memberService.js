angular.module('gameboard.member.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('MembersService', function($q, ACCESS) {

    return {

        getMember: function(muuid) {

            console.log("muuid",muuid);

            // Get a Defered
            var def = $q.defer();

            // Get the Cloud Code 
            var cc = IBMCloudCode.getService();
            var uri = new IBMUriBuilder().append(ACCESS.MEMBERS).append(muuid).toString();
            cc.get(uri,{handleAs:"json"}).done(function(member) {

                // Check we have a member we can work with 
                if (member.length>0) {
                    var _member = member[0];
                    if( _.has(_member,"error") && _member.error == "not_found" ) {
                        def.reject(null);
                    } else {
                        def.resolve(_member);
                    }    
                } else {
                    def.reject(null);
                }                

            },function(err){
                def.reject(null);
            });

            // Get the Objects for a particular Type
            return def.promise;

        },

        registerMember : function (member) {

            // Manage Defer on the Save
            var defer = $q.defer();

            // get the Data Service
            var data = IBMCloudCode.getService();

            // Send the Video request to the Bluemix to be added into the Cloudant Database
            cc.post(ACCESS.MEMBERS, member,{
                "handleAs": "json"
            }).then(function(member) {
                // Was added successfully
                def.resolve(true);
            }).catch(function(err) {
                console.log(err)
                def.reject(err);
            });

            // Return a promise for the async operation of save
            return defer.promise;

        }

    }

})

/**
 * A simple example service that returns some data.
 */
.factory('MemberDetailService', function($q, $cacheFactory,$stateParams, URL) {

    // Use an internal Cache for storing the List and map the operations to manage that from 
    // MBaaS SDK Calls
    var cache = $cacheFactory('member');

    return {

        getMember: function(muuid) {

            console.log("muuid",muuid);

            // Create a deffered
            var def = $q.defer();
        
            // Lets Get a list of Genres
            $.ajax({
                type: "GET",
                url: URL.MEMBER,
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
.factory('FavouritesService', function($rootScope, $q,$cacheFactory,URL) {

    // Use an internal Cache for storing the List and map the operations to manage that from 
    // MBaaS SDK Calls
    var cache = $cacheFactory('favourites');

    return {

        // Return all the Objects for a Given Class
        allCloud: function() {

            // Create a Defer as this is an async operation
            defer = $q.defer();

            // Clear the Cache with a new set
            cache.remove('favourites');

            // Lets Get a list of Genres
            $.ajax({
                type: "GET",
                url: URL.FAVOURITES,
                dataType: "json",
                contentType: "application/json",
                success: function(result,status) {

                    // Check if we were able to store it sucessfully
                    if (status === "success") {

                        // Place the Items in the Cache
                        cache.put('favourites',result);

                        // return the Cache
                        defer.resolve(cache.get('favourites'));

                    } else {
                        def.reject([]);
                    }

                },
                error: function(err) {
                    def.reject(err);
                }
            });

            // Get the Objects for a particular Type
            return defer.promise;

        },

        // Return the Cached List
        allCache: function() {

            // Return the Cached Items
            return cache.get('favourites');

        },

        add: function(data) {

        
        },

        del: function(video) {

            var defer = $q.defer();

            // Remove the Item from the Cache
            var videos = cache.get('favorites').videos;
            videos.splice(videos.indexOf(video),1)

            // AJAX DELETE

            defer.resolve("status");        

            // Remove it
            return defer.promise;

        }
    }

});



