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

	/* board/search - search design document
     function(doc) {

     index('search',
     doc.bid+" "+
     doc.title+" "+
     doc.description+" "+
     doc.ytid+" "+
     doc.ytimage+" "+
     doc.views+" "+
     doc.recorddate+" "+
     doc.platform+" "+
     doc.rating+" "+
     doc.muuid +" "+
     doc.location+" ",
     {'store':false,'index':true});

     index('bid', doc.bid, {'store':true,'index':true});
     index("title", doc.title,{'store':true});
     index("description",doc.description,{'store':true});
     index('ytid', doc.ytid, { 'store':true});
     index('ytimage', doc.ytimage, {'store':true});
     index('rank', doc.rank, { 'facet': true ,'store':true});
     index('views', doc.views, {'store':true});
     index('muuid', doc.muuid, {'store':true});
     index('location', doc.location,{'store':true});
     index('recorddate', doc.recorddate,{'store':true});
     index('platform', doc.platform,{'store':true});
     index('rating', doc.rating,{'store':true});
     }


     }
	 */

    /**
     * A simple example service that returns some data.
     */
	.factory('BoardService', function ($q, $cacheFactory, $stateParams, ACCESS) {

		return {

			all: function (bid, bookmark, size) {

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
                uri += "?limit=" + size;
                if (bookmark) {
                   uri += "&bookmark="+bookmark;
                }

				// Get the Videos for my Board
				cc.get(uri, {
					"handleAs": "json"
				}).then(function (videos) {

					def.resolve(videos);

				}).catch(function (err) {
					console.log(err);
					def.reject(err);
				});

				// Get the Objects for a particular Type
				return def.promise;

			},
			registerVideo: function (video) {

				// Process a Defer
				var def = $q.defer();

				// Get the Cloud Code Service
				var cc = IBMCloudCode.getService();

				// Add the Video to the Board
				cc.post(ACCESS.VIDEOS, video, {
					"handleAs": "json"
				}).then(function (success) {

					def.resolve(true);

				}).catch(function (err) {

					def.reject(err);
				});

				return def.promise;

			}
		}

	})

/**
 * A simple example service that returns some data.
 */
	.factory('YouTubeService', function ($q, $cacheFactory, $stateParams, ACCESS) {

		return {

			getYourVideos: function () {

				// Create a deffered
				var def = $q.defer();

				// Get Cloud Code
				var cc = IBMCloudCode.getService();

				cc.get(ACCESS.YOUTUBE_YOURS, {
					"handleAs": "json"
				}).then(function (videos) {
					def.resolve(videos);
				}).catch(function (err) {
					console.log(err);
					def.reject(err);
				});

				// Get the Objects for a particular Type
				return def.promise;

			},
			getVideo: function (id) {

				// Create a deffered
				var def = $q.defer();

				// Get Cloud Code
				var cc = IBMCloudCode.getService();

				// Build out a new URI builder
				var _uri = new IBMUriBuilder().slash().append(ACCESS.YT_VIDEO_DETAIL).append(id).toString();

				// Get the Details of the Video
				cc.get(_uri, {
					"handleAs": "json"
				}).then(function (video) {
					var _video = null;
					if (video.items.length > 0) {
						_video = video.items[0];
					}
					def.resolve(_video);
				}).catch(function (err) {
					console.log(err);
					def.reject(err);
				});

				// Get the Objects for a particular Type
				return def.promise;


			},

			getVideoByYTID: function (ytid) {

				// Create a deffered
				var def = $q.defer();

				// Get Cloud Code
				var cc = IBMCloudCode.getService();

				// Build out a new URI builder
				var _uri = new IBMUriBuilder().slash().append(ACCESS.BYYTID).append(ytid).toString();

				// Get the Details of the Video
				cc.get(_uri, {
					"handleAs": "json"
				}).then(function (video) {

					var _video = null;
					if (video.items.length > 0) {
						_video = video.items[0];
					}
					def.resolve(_video);

				}).catch(function (err) {
					console.log(err);
					def.reject(err);
				});

				// Get the Objects for a particular Type
				return def.promise;

			}

		}

	})

/**
 * A simple example service that returns some data.
 */
	.factory('VideoService', function ($rootScope, $q, $cacheFactory, ACCESS) {

		return {

			get: function (uuid) {

				// Create a deffered
				var def = $q.defer();

				// Get Cloud Code
				var cc = IBMCloudCode.getService();

				// Get the Video and its Detail
				var uri = new IBMUriBuilder().append(ACCESS.VIDEOS).append(uuid).toString();
				cc.get(uri, {
					"handleAs": "json"
				}).then(function (video) {

					// Resolve Promise
					def.resolve(video);

				}).catch(function (err) {
					def.reject(err);
				});

				// Get the Objects for a particular Type
				return def.promise;

			},

			// Add a Video to Game Board
			add: function (video) {

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
				cc.post("/board/video", video, options).done(function (video) {
					// Was added successfully
					def.resolve(video);
				}).catch(function (err) {
					console.log(err);
					def.reject(err);
				});

				// Return a promise for the async operation of save
				return defer.promise;

			},

			del: function (item) {

				var defer = $q.defer();

				// get the Data Service
				var data = IBMData.getService();

				// Remove the Item from the Cache
				var items = cache.get('items');
				items.splice(items.indexOf(item), 1);

				//Get the object with the given id so we can delete it
				data.Object.withId(item.getId()).then(function (item) {
					// Delete the Item from the Cloud
					return item.del();
				}).done(function (deleted) {
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
