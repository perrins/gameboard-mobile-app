/*
 *  Licensed Materials - Property of Gameboard Ltd
 *  2014 (C) Copyright Gameboard Ltd. 2011,2014. All Rights Reserved.
 *  UK Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with Gameboard Ltd.
 *
 *  Member Services
 * 
 */
 
angular.module("gameboard.member.services", [])

/**
 * A simple example service that returns some data.
 */
.factory("MembersService", function ($q, $rootScope, ACCESS) {

	return {

 		all: function(search,page,size) {

            // Create a deffered
            var def = $q.defer();

            // Get handle to the CloudCode service
            var cc = IBMCloudCode.getService();

            // USE THE CloudCode to Call the Board Services
            // This will integrate with Cloudant to retrieve a list of videos for a Board
            // Need to manage the Paging for this and sort it by ranking
            // Lets build a 
            var uri = new IBMUriBuilder().append(ACCESS.MEMBERS).toString();

            // Add the Paging to the BoardList and Get back what we have
            uri += "?skip="+page+"&limit="+size;

            // Get the Videos for my Board
            cc.get(uri, {
                "handleAs": "json"
            }).then(function(members) {

                def.resolve(members);

            }).catch(function(err) {
                console.log(err);
                def.reject(err);
            })

            // Get the Objects for a particular Type
            return def.promise;

        },

		search: function(search,page,size) {

            // Create a deffered
            var def = $q.defer();

            // Get handle to the CloudCode service
            var cc = IBMCloudCode.getService();

            // USE THE CloudCode to Call the Board Services
            // This will integrate with Cloudant to retrieve a list of videos for a Board
            // Need to manage the Paging for this and sort it by ranking
            // Lets build a 
            var uri = new IBMUriBuilder().append(ACCESS.SEARCH_MEMBERS).toString();
            uri += "?search="+search;

            // Add the Paging to the BoardList and Get back what we have
            uri += "&skip="+page+"&limit="+size;

            // Get the Videos for my Board
            cc.get(uri, {
                "handleAs": "json"
            }).then(function(members) {

                def.resolve(members);

            }).catch(function(err) {
                console.log(err);
                def.reject(err);
            })

            // Get the Objects for a particular Type
            return def.promise;

        },

		getMember: function (muuid) {
			console.log("muuid",muuid);

			// Get a Defered
			var def = $q.defer();

			// Get the Cloud Code
			var cc = IBMCloudCode.getService();
			var uri = new IBMUriBuilder().append(ACCESS.MEMBERS).append(muuid).toString();

			// TMD: When 'done' somethimes and 'then' other?
			cc.get(uri,{
				handleAs:"json"
			}).done(function (member) {

				// Check we have a member we can work with
				if (member) {
					var _member = member.doc;
					if( _.has(_member,"error") && _member.error === "not_found" ) {
						def.reject(null);
					} else {
						def.resolve(_member);
					}
				} else {
					def.reject(null);
				}
			}, function (err){
				def.reject(null);
			});

			// Get the Objects for a particular Type
			return def.promise;
		},

		registerMember : function (member) {
			// Manage Defer on the Save
			var def = $q.defer();

			// get the Data Service
			var cc = IBMCloudCode.getService();

			// Send the Video request to the Bluemix to be added into the Cloudant Database
			cc.post(ACCESS.REGISTER, member,{
				"handleAs": "json"
			}).then(function (member) {
				// Was added successfully
				def.resolve(member);

			}).catch(function (err) {
				console.log(err);
				def.reject(err);
			});

			// Return a promise for the async operation of save
			return def.promise;
		}
	};

})

/**
 * A simple example service that returns some data.
 */
.factory("MemberDetailService", function ($q, $cacheFactory, $stateParams, URL) {

	// Use an internal Cache for storing the List and map the operations to manage that from
	// MBaaS SDK Calls

	// TMD: cache never used
	var cache = $cacheFactory("member");

	return {
		getMember: function (muuid) {

			console.log("muuid",muuid);

			// Create a deffered
			var def = $q.defer();

			// Lets Get a list of Genres
			$.ajax({
				type: "GET",
				url: URL.MEMBER,
				dataType: "json",
				contentType: "application/json",
				success: function (result,status) {
					// Check if we were able to store it sucessfully
					if (status === "success") {
						// return the Cache
						def.resolve(result);
					} else {
						def.reject([]);
					}
				},
				error: function (err) {
					def.reject(err);
				}
			});

			// Get the Objects for a particular Type
			return def.promise;

		}
	};
})

/**
 * A simple example service that returns some data.
 */
.factory("FavouritesService", function ($rootScope, $q, $cacheFactory, URL) {

	// Use an internal Cache for storing the List and map the operations to manage that from
	// MBaaS SDK Calls
	var cache = $cacheFactory("favourites");

	return {
		// Return all the Objects for a Given Class
		allCloud: function () {
			// Create a Defer as this is an async operation
			var def = $q.defer();

			// Clear the Cache with a new set
			cache.remove("favourites");

			// Lets Get a list of Genres
			$.ajax({
				type: "GET",
				url: URL.FAVOURITES,
				dataType: "json",
				contentType: "application/json",
				success: function (result,status) {
					// Check if we were able to store it sucessfully
					if (status === "success") {
						// Place the Items in the Cache
						cache.put("favourites",result);
						// return the Cache
						def.resolve(cache.get("favourites"));
					} else {
						def.reject([]);
					}
				},
				error: function (err) {
					def.reject(err);
				}
			});

			// Get the Objects for a particular Type
			return def.promise;
		},

		// Return the Cached List
		allCache: function () {
			// Return the Cached Items
			return cache.get("favourites");
		},

		add: function (data) { },

		del: function (video) {
			var def = $q.defer();

			// Remove the Item from the Cache
			var videos = cache.get("favorites").videos;
			videos.splice(videos.indexOf(video),1);

			// AJAX DELETE
			def.resolve("status");

			// Remove it
			// TMD: When a ASYNC defer when this is a sync process?
			return def.promise;
		}
	};
});
