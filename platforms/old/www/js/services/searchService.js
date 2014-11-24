/*
 *  Licensed Materials - Property of Gameboard Ltd
 *  2014 (C) Copyright Gameboard Ltd. 2011,2014. All Rights Reserved.
 *  UK Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with Gameboard Ltd.
 *
 *  Search Services
 * 
 */

angular.module("gameboard.search.services", [])

/**
 * A simple example service that returns some data.
 */
.factory("SearchService", function ($q, $cacheFactory,$stateParams, URL) {

	// Use an internal Cache for storing the List and map the operations to manage that from
	// MBaaS SDK Calls

	return {
		findVideos: function () {
			// Create a deffered
			var def = $q.defer();

			// Lets Get a list of Genres
			$.ajax({
				type: "GET",
				url: URL.SEARCH,
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
});
