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
	.factory("FavouritesService", function ($rootScope, $q, $cacheFactory, ACCESS) {

		// Use an internal Cache for storing the List and map the operations to manage that from
		// MBaaS SDK Calls
		var cache = $cacheFactory("favourites");

		return {
			// Return all the Objects for a Given Class
			allCloud: function () {

				// Create a deffer
				var def = $q.defer();

				var items = cache.get(ACCESS.FAVOURITES);

				// Check if we are already Cached
				if (!_.isUndefined(items)) {
					def.resolve(items);
				} else {

					// Get handle to the CloudCode service
					var cc = IBMCloudCode.getService();

					// Get the User Id
					var userid = $rootScope.user.id;

					// USE THE CloudCode to Call the Board Services
					// This will integrate with Cloudant to retrieve a list of videos for a Board
					// Need to manage the Paging for this and sort it by ranking
					// Lets build a
					var uri = new IBMUriBuilder().append(ACCESS.FAVOURITES).append(userid).toString();

					// Clear the Cache with a new set
					cache.remove(ACCESS.FAVOURITES);

					// Get the Videos for my Board
					cc.get(uri, {
						"handleAs": "json"
					}).then(function (favourites) {

						// Place the Items in the Cache
						cache.put(ACCESS.FAVOURITES, favourites);
						// return the Cache
						def.resolve(cache.get(ACCESS.FAVOURITES));

					}).catch(function (err) {
						console.log(err);
						def.reject(err);
					});
				}

				// Get the Objects for a particular Type
				return def.promise;
			},

			// Return the Cached List
			allCache: function () {
				// Return the Cached Items
				return cache.get(ACCESS.FAVOURITES);
			},

			add: function (data) {


			},

			del: function (video) {
				var def = $q.defer();

				// Remove the Item from the Cache
				var videos = cache.get("favorites").videos;
				videos.splice(videos.indexOf(video), 1);

				// AJAX DELETE
				def.resolve("status");

				// Remove it
				// TMD: When a ASYNC defer when this is a sync process?
				return def.promise;
			}
		};
	})

/**
 * A simple example service that returns some data.
 */
	.factory("YourVideosService", function ($rootScope, $q, $cacheFactory, ACCESS) {

		// Use an internal Cache for storing the List and map the operations to manage that from
		// MBaaS SDK Calls
		var cache = $cacheFactory("yourvideos");

		return {
			// Return all the Objects for a Given Class
			allCloud: function () {

				// Create a deffer
				var def = $q.defer();

				var items = cache.get(ACCESS.YOUR_VIDEOS);

				// Check if we are already Cached
				if (!_.isUndefined(items)) {
					def.resolve(items);
				} else {

					// Get handle to the CloudCode service
					var cc = IBMCloudCode.getService();

					// Get the User Id
					var userid = $rootScope.user.id;

					// USE THE CloudCode to Call the Board Services
					// This will integrate with Cloudant to retrieve a list of videos for a Board
					// Need to manage the Paging for this and sort it by ranking
					// Lets build a
					var uri = new IBMUriBuilder().append(ACCESS.YOUR_VIDEOS).append(userid).toString();

					// Clear the Cache with a new set
					cache.remove(ACCESS.YOURR_VIDEOS);

					// Get the Videos for my Board
					cc.get(uri, {
						"handleAs": "json"
					}).then(function (yourvideos) {

						// Place the Items in the Cache
						cache.put(ACCESS.YOUR_VIDEOS, yourvideos);
						// return the Cache
						def.resolve(cache.get(ACCESS.YOUR_VIDEOS));

					}).catch(function (err) {
						console.log(err);
						def.reject(err);
					});
				}

				// Get the Objects for a particular Type
				return def.promise;
			},

			// Return the Cached List
			allCache: function () {
				// Return the Cached Items
				return cache.get(ACCESS.YOUR_VIDEOS);
			},

			del: function (video) {
				// Create a deffer
				var def = $q.defer();

				// Get handle to the CloudCode service
				var cc = IBMCloudCode.getService();

				// Get the User Id
				var userid = $rootScope.user.id;

				// USE THE CloudCode to Call the Board Services
				// This will integrate with Cloudant to retrieve a list of videos for a Board
				// Need to manage the Paging for this and sort it by ranking
				// Lets build a
				var uri = new IBMUriBuilder().append(ACCESS.YOUR_VIDEOS).append(userid).append(videos.uuid).toString();

				// Clear the Cache with a new set
				cache.remove(ACCESS.YOUR_VIDEOS);

				// Get the Videos for my Board
				cc.del(uri, {
					"handleAs": "json"
				}).then(function (status) {

					// return the Cache
					def.resolve(status);

				}).catch(function (err) {
					console.log(err);
					def.reject(err);
				});

				return def.promise;
			}
		};
	})


/**
 * A simple example service that returns some data.
 */
	.factory("BookmarksService", function ($rootScope, $q, $cacheFactory, ACCESS) {

		// Use an internal Cache for storing the List and map the operations to manage that from
		// MBaaS SDK Calls
		var cache = $cacheFactory("bookmarks");

		return {
			// Return all the Objects for a Given Class
			allCloud: function () {

				// Create a deffer
				var def = $q.defer();

				var items = cache.get(ACCESS.BOOKMARKS);

				// Check if we are already Cached
				if (!_.isUndefined(items)) {
					def.resolve(items);
				} else {

					// Get handle to the CloudCode service
					var cc = IBMCloudCode.getService();

					// Get the User Id
					var userid = $rootScope.user.id;

					// USE THE CloudCode to Call the Board Services
					// This will integrate with Cloudant to retrieve a list of videos for a Board
					// Need to manage the Paging for this and sort it by ranking
					// Lets build a
					var uri = new IBMUriBuilder().append(ACCESS.BOOKMARKS).append(userid).toString();

					// Clear the Cache with a new set
					cache.remove(ACCESS.BOOKMARKS);

					// Get the Videos for my Board
					cc.get(uri, {
						"handleAs": "json"
					}).then(function (bookmarks) {

						// Place the Items in the Cache
						cache.put(ACCESS.BOOKMARKS, bookmarks);
						// return the Cache
						def.resolve(cache.get(ACCESS.BOOKMARKS));

					}).catch(function (err) {
						console.log(err);
						def.reject(err);
					});
				}

				// Get the Objects for a particular Type
				return def.promise;
			},

			// Return the Cached List
			allCache: function () {
				// Return the Cached Items
				return cache.get(ACCESS.BOOKMARKS);
			},

			addBookmark: function (data) {

				// Create a deffer
				var def = $q.defer();

				// Get handle to the CloudCode service
				var cc = IBMCloudCode.getService();

				// Get the User Id
				var userid = $rootScope.user.id;

				// USE THE CloudCode to Call the Board Services
				// This will integrate with Cloudant to retrieve a list of videos for a Board
				// Need to manage the Paging for this and sort it by ranking
				// Lets build a
				var uri = new IBMUriBuilder().append(ACCESS.BOOKMARKS).append(userid).toString();

				// Clear the Cache with a new set
				cache.remove(ACCESS.BOOKMARKS);

				// Get the Videos for my Board
				cc.post(uri, data, {
					"handleAs": "json"
				}).then(function (status) {

					// return the Cache
					def.resolve(status);

				}).catch(function (err) {
					console.log(err);
					def.reject(err);
				});

				return def.promise;

			},

			removeBookmark: function (bookmark) {

				// Create a deffer
				var def = $q.defer();

				// Get handle to the CloudCode service
				var cc = IBMCloudCode.getService();

				// Get the User Id
				var userid = $rootScope.user.id;

				// USE THE CloudCode to Call the Board Services
				// This will integrate with Cloudant to retrieve a list of videos for a Board
				// Need to manage the Paging for this and sort it by ranking
				// Lets build a
				var uri = new IBMUriBuilder().append(ACCESS.BOOKMARKS).append(userid).toString();

				// Clear the Cache with a new set
				cache.remove(ACCESS.BOOKMARKS);

				// Get the Videos for my Board
				cc.del(uri, {
					"handleAs": "json"
				}).then(function (status) {

					// return the Cache
					def.resolve(status);

				}).catch(function (err) {
					console.log(err);
					def.reject(err);
				});

				return def.promise;
			}
		};
	})


/**
 * A simple example service that returns some data.
 */
	.factory("NotificationService", function ($rootScope, $q, $cacheFactory, ACCESS) {

		// Use an internal Cache for storing the List and map the operations to manage that from
		// MBaaS SDK Calls
		var cache = $cacheFactory("notifications");

		return {
			// Return all the Objects for a Given Class
			allCloud: function () {

				// Create a deffer
				var def = $q.defer();

				var items = cache.get(ACCESS.NOTIFICATIONS);

				// Check if we are already Cached
				if (!_.isUndefined(items)) {
					def.resolve(items);
				} else {

					// Get handle to the CloudCode service
					var cc = IBMCloudCode.getService();

					// Get the User Id
					var userid = $rootScope.user.id;

					// USE THE CloudCode to Call the Board Services
					// This will integrate with Cloudant to retrieve a list of videos for a Board
					// Need to manage the Paging for this and sort it by ranking
					// Lets build a
					var uri = new IBMUriBuilder().append(ACCESS.NOTIFICATIONS).append(userid).toString();

					// Clear the Cache with a new set
					cache.remove(ACCESS.NOTIFICATIONS);

					// Get the Videos for my Board
					cc.get(uri, {
						"handleAs": "json"
					}).then(function (notifications) {

						// Place the Items in the Cache
						cache.put(ACCESS.NOTIFICATIONS, notifications);
						// return the Cache
						def.resolve(cache.get(ACCESS.NOTIFICATIONS));

					}).catch(function (err) {
						console.log(err);
						def.reject(err);
					});
				}

				// Get the Objects for a particular Type
				return def.promise;
			},

			// Return the Cached List
			allCache: function () {
				// Return the Cached Items
				return cache.get(ACCESS.NOTIFICATIONS);
			},

			addBookmark: function (data) {

				// Create a deffer
				var def = $q.defer();

				// Get handle to the CloudCode service
				var cc = IBMCloudCode.getService();

				// Get the User Id
				var userid = $rootScope.user.id;

				// USE THE CloudCode to Call the Board Services
				// This will integrate with Cloudant to retrieve a list of videos for a Board
				// Need to manage the Paging for this and sort it by ranking
				// Lets build a
				var uri = new IBMUriBuilder().append(ACCESS.NOTIFICATIONS).append(userid).toString();

				// Clear the Cache with a new set
				cache.remove(ACCESS.NOTIFICATIONS);

				// Get the Videos for my Board
				cc.post(uri, data, {
					"handleAs": "json"
				}).then(function (status) {

					// return the Cache
					def.resolve(status);

				}).catch(function (err) {
					console.log(err);
					def.reject(err);
				});

				return def.promise;

			},

			removeBookmark: function (bookmark) {

				// Create a deffer
				var def = $q.defer();

				// Get handle to the CloudCode service
				var cc = IBMCloudCode.getService();

				// Get the User Id
				var userid = $rootScope.user.id;

				// USE THE CloudCode to Call the Board Services
				// This will integrate with Cloudant to retrieve a list of videos for a Board
				// Need to manage the Paging for this and sort it by ranking
				// Lets build a
				var uri = new IBMUriBuilder().append(ACCESS.NOTIFICATIONS).append(userid).toString();

				// Clear the Cache with a new set
				cache.remove(ACCESS.NOTIFICATIONS);

				// Get the Videos for my Board
				cc.del(uri, {
					"handleAs": "json"
				}).then(function (status) {

					// return the Cache
					def.resolve(status);

				}).catch(function (err) {
					console.log(err);
					def.reject(err);
				});

				return def.promise;
			}
		};
	});



