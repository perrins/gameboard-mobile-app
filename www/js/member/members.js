'use strict';

angular.module("gameboard.member.search", [])

    // Define Routing Paths
    .config(["$stateProvider", function ($stateProvider) {

        $stateProvider.state("board.members", {
            url: "/members",
            views: {
                "menuContent": {
                    templateUrl: "js/member/members.html",
                    controller: "MembersCtrl"
                }
            }
        });

        $stateProvider.state("board.member", {
            url: "/member/:muuid",
            views: {
                "menuContent": {
                    templateUrl: "js/member/member-detail.html",
                    controller: "MemberDetailCtrl"
                }
            }
        });
    }])

    // Define Controllers
    .controller("MembersCtrl", function ($scope, $location, $ionicLoading, $stateParams, MembersService) {

        var searchParam = "";

        var members = [];

        $scope.page = 0;
        $scope.pageSize = 20;
        $scope.total = 0;
        $scope.position = 0;

        // Load the Items
        $scope.loadItems = function (page, size) {

            // Refresh
            if (!$scope.$$phase) {
                $scope.$apply();
            }

            // Because we are retrieving all the items every time we do something
            // We need to clear the list before loading in some new values
            $ionicLoading.show({
                template: $scope.message
            });


            // "List is " is a service returning data from the
            MembersService.all(searchParam, page, size).then(function (_members) {

                // Reset the Array if we are on Page 1
                if ($scope.page === 0) {
                    // Prepare for the Query
                    members = [];
                }

                // Set the Title
                $scope.title = searchParam;

                // Check what has been returned versus side of what we are returning
                angular.forEach(_members, function (value, key) {
                    members.push(value);
                });

                // Update the model with a list of Items
                $scope.members = members;

                // Take the details from the content
                // Use the Calcualtion
                $scope.total = 20;//board.videos.total_rows;
                $scope.position = 0; //board.videos.offset;
                $scope.count = 20;
                $scope.number = 20;

                // Let Angular know we have some data because of the Async nature of IBMBaaS
                // This is required to make sure the information is uptodate
                if (!$scope.$$phase) {
                    $scope.$apply();
                }

                // Hide the loading icons
                $ionicLoading.hide();

                // Lets Make a Call to the Service and then update the infinite scroll
                $scope.$broadcast('scroll.infiniteScrollComplete');

                // Check we can move forward.
                if ($scope.page && $scope.page <= parseInt(20)) {
                    $scope.page++;
                } else {
                    // No More Data

                }

            }, function (err) {
                console.log(err);
                $ionicLoading.hide();
                $scope.board = null;

            });

        };

        // If we get close to the end of the list and we have more
        $scope.loadMore = function () {

            if (!$scope.message) {
                $scope.message = 'Fetching Members...';
            } else {
                $scope.message = 'More Members...';
            }

            // Check we can move one more page
            // Add Some More
            if ($scope.page <= $scope.total) {
                $scope.loadItems($scope.page, $scope.pageSize);
            }
        };

        // Search for Members
        $scope.findMembers = function () {

            $scope.page = 0;
            $scope.loadMore();
        };

        $scope.$on("stateChangeSuccess", function () {
            $scope.loadMore();
        });
    })

    .controller("MemberDetailCtrl", function ($scope, $location, $stateParams, MembersService) {

        // Need to Check if we have got some already
        MembersService.getMember($stateParams.muuid).then(function (member) {
            // Paint
            $scope.member = member;
            $scope.videos = member.videos;

            // Let Angular know we have some data because of the Async nature of IBMBaaS
            // This is required to make sure the information is uptodate
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });

	})

    /**
     * A simple example service that returns some data.
     */
    .factory("MembersService", function ($q, $rootScope, ACCESS) {

        return {

            all: function (search, page, size) {

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
                uri += "?skip=" + page + "&limit=" + size;

                var options =  {handleAs:"json"}

                if($rootScope.google) {
                    options.headers = {"X-GB-ACCESS-TOKEN":$rootScope.google.access_token};
                }

                // Get the Videos for my Board
                cc.get(uri, options).then(function (members) {

                    def.resolve(members);

                }).catch(function (err) {
                    console.log(err);
                    def.reject(err);
                });

                // Get the Objects for a particular Type
                return def.promise;

            },

            search: function (search, page, size) {

                // Create a deffered
                var def = $q.defer();

                // Get handle to the CloudCode service
                var cc = IBMCloudCode.getService();

                // USE THE CloudCode to Call the Board Services
                // This will integrate with Cloudant to retrieve a list of videos for a Board
                // Need to manage the Paging for this and sort it by ranking
                // Lets build a
                var uri = new IBMUriBuilder().append(ACCESS.SEARCH_MEMBERS).toString();
                uri += "?search=" + search;

                // Add the Paging to the BoardList and Get back what we have
                uri += "&skip=" + page + "&limit=" + size;

                // Get the Videos for my Board
                cc.get(uri, {
                    "handleAs": "json"
                }).then(function (members) {

                    def.resolve(members);

                }).catch(function (err) {
                    console.log(err);
                    def.reject(err);
                });

                // Get the Objects for a particular Type
                return def.promise;

            },

            getMember: function (muuid) {
                console.log("muuid", muuid);

                // Get a Defered
                var def = $q.defer();

                // Get the Cloud Code
                var cc = IBMCloudCode.getService();
                var uri = new IBMUriBuilder().append(ACCESS.MEMBERS).append(muuid).toString();

                // Prepare Headers
                var options =  {handleAs:"json"}
                // Create some Headers to Flow with Request
                if($rootScope.google && $rootScope.user) {
                    options.headers = {"GB-ACCESS-TOKEN":$rootScope.google.access_token,
                                       "GB-USER-ID":$rootScope.user.raw.id};
                }

                // TMD: When 'done' somethimes and 'then' other?
                cc.get(uri,options).done(function (member) {

                    // Check we have a member we can work with
                    if (member) {
                        if (member.error && _member.error === "not_found") {
                            def.reject(null);
                        } else {
                            def.resolve(member);
                        }
                    } else {
                        def.reject(null);
                    }
                }, function (err) {
                    def.reject(null);
                });

                // Get the Objects for a particular Type
                return def.promise;
            },

            registerMember: function (member) {
                // Manage Defer on the Save
                var def = $q.defer();

                // get the Data Service
                var cc = IBMCloudCode.getService();

                // Send the Video request to the Bluemix to be added into the Cloudant Database
                cc.post(ACCESS.REGISTER, member, {
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

    });

