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
.factory("SearchService", function ($q, $cacheFactory,$stateParams, ACCESS) {

	// Use an internal Cache for storing the List and map the operations to manage that from
	// MBaaS SDK Calls

	return {
		all: function (query, page, size) {

            // Create a deffered
            var def = $q.defer();

            // Get handle to the CloudCode service
            var cc = IBMCloudCode.getService();

            // USE THE CloudCode to Call the Board Services
            // This will integrate with Cloudant to retrieve a list of videos for a Board
            // Need to manage the Paging for this and sort it by ranking
            // Lets build a 
            var uri = new IBMUriBuilder().append(ACCESS.SEARCH_VIDEOS).toString();

            // Add the Paging to the BoardList and Get back what we have
            uri += "?query="+query+"&skip="+page+"&limit="+size;

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

		}
	};
});
