angular.module("gameboard.controllers", [])

    // Only Show the Splash Screen on Sign Load
    .run(function ( $ionicPlatform,$ionicModal, $rootScope, $timeout) {

        // Hide Splash Screen
        // Handle Loading of the Runtime
        $ionicPlatform.ready(function () {

            // Create Wifi
            if(!$rootScope.wifi) {

                // Create our modal
                $ionicModal.fromTemplateUrl('templates/connectivity.html', function (modal) {
                    $rootScope.connectivity = modal;
                }, {
                    scope: $rootScope,
                    animation: 'slide-in-up',
                    focusFirstInput: true
                });

                $rootScope.wifi = function () {
                    // Reverse the Paint Bug
                    $rootScope.connectivity.show();
                };

                $rootScope.cancelWifi = function () {
                    // Reverse the Paint Bug
                    $rootScope.connectivity.hide();
                };

                // listen for the event in the relevant $scope
                $rootScope.$on('gb-error', function (event, err) {

                    if (_.isObject(err) && _.has(err, "info")) {

                        // Show Connectivity Error
                        if (err.info.status == "error") {
                            $rootScope.wifi();
                        }

                    }

                });
            }


        });
    })

	.controller("MainCtrl", function ($rootScope,  $scope, $location, $state, $ionicSideMenuDelegate, $ionicHistory) {

        // Check if we are in local testing mode and then fake a user
        // and go to the Intro Views.
        if ($rootScope.config.localsecurity || typeof OAuth == 'undefined') {

            $rootScope.user = {
                "id": "1292030202022",
                "gametag": "lolperrins123",
                "avatar": "img/avatar.png",
                "firstname": "Joe",
                "lastname": "Perrins",
                "registered": false
            };
            $rootScope.member = {
                "muuid": 282992902,
                "gametag": "lolperrins123",
                "name": "Joe",
                "surname": "Perrins",
                "memberSince": "01/01/2014",
                "avatar": "img/avatar.png",
                "bio": "The best minecraft player on the planet",
                "prizes": "£23,456",
                "views": "4,343"

            };

        };


        // Prepare User for Display
		if ($rootScope.user) {

			// So we have a User lets loo
			$scope.user = $rootScope.user;
			$scope.member = $rootScope.member;

			$scope.members = 2302243;
			$scope.notifications = 6;
			$scope.videos = 3;
			$scope.favourites = 5;

			// Clear the Back stack
			$ionicHistory.nextViewOptions({
				disableBack: true
			});

		} else {

			// Clear the Back stack
			$ionicHistory.nextViewOptions({
				disableBack: true,
				disableAnimate: true
			});

		}

		$scope.logout = function () {

			// Clear the Back stack
			$ionicHistory.nextViewOptions({
				disableBack: true
			});

			// Remove the User State
			$rootScope.user = null;
			$rootScope.member = null;

			// Do an OAuth Logout Here
			$state.go("signin");

		};

	})

// Sign In Controller, navigate to Intro
	.controller("SignInCtrl", function ($cordovaNetwork, $ionicHistory, $rootScope, $state, $scope, $http, MembersService, $ionicLoading, Settings,ACCESS,$q) {

        // Clear the Back stack
		$ionicHistory.nextViewOptions({
			disableBack: true,
			disableAnimate: true
		});

		// Signon to the App
		$scope.signon = function () {

			// Lets load the Videos for the Youtube Channel
			$ionicLoading.show({
                template: '<ion-spinner class="spinner-energized" icon="lines"></ion-spinner><h3>Authenticating...</h3>'
			});

			var nextView = function () {

				// Clear the Back stack
				$ionicHistory.nextViewOptions({
					disableBack: true
				});

				// If we have displayed the screen before lets go to Main
				if (!Settings.get("INTRO")) {
					$state.go("board.genres");

				} else {
					$state.go("intro");
				}

			};

            function checkConnection() {
                var networkState = navigator.connection.type;

                var states = {};
                states[Connection.UNKNOWN]  = 'Unknown connection';
                states[Connection.ETHERNET] = 'Ethernet connection';
                states[Connection.WIFI]     = 'WiFi connection';
                states[Connection.CELL_2G]  = 'Cell 2G connection';
                states[Connection.CELL_3G]  = 'Cell 3G connection';
                states[Connection.CELL_4G]  = 'Cell 4G connection';
                states[Connection.CELL]     = 'Cell generic connection';
                states[Connection.NONE]     = 'No network connection';

                $rootScope.states = states;
                console.log("Connection : "+states[networkState]);
            }

            //
            if(navigator.connection) {
                checkConnection();
                if(navigator.connection.type === Connection.NONE && !$rootScope.config.localsecurity){
                    $ionicLoading.hide();
                    $rootScope.wifi();
                    return;
                } else {
                    console.log("We have a connection "+$rootScope.states[navigator.connection.type]);
                }
            }

            // Check if we are in local testing mode and then fake a user
			// and go to the Intro Views.
			if ($rootScope.config.localsecurity || typeof OAuth == 'undefined') {

				$rootScope.user = {
					"id": "1292030202022",
					"gametag": "lolperrins123",
					"avatar": "img/avatar.png",
					"firstname": "Joe",
					"lastname": "Perrins",
					"registered": true
				};
				$rootScope.member = {
					"muuid": 282992902,
					"gametag": "lolperrins123",
					"name": "Joe",
					"surname": "Perrins",
					"memberSince": "01/01/2014",
					"avatar": "img/avatar.png",
					"bio": "The best minecraft player on the planet",
					"prizes": "£23,456",
					"views": "4,343"

				};

				// Hide Message
				$ionicLoading.hide();

				// Havigate to the Board View
				nextView();

				return;
			}

			// Initialize Security
			// Initialize the OAuth settings
			OAuth.initialize($rootScope.config.security);

			var failFunc = function (err) {
				// TMD: isn't this covered by the second arg to 'then' ?
				$ionicLoading.hide();
                $rootScope.wifi();
			};

            // Get A Code
            Q.fcall ( function () {

                // Request a Server Side Generated Auth Code
                var def = $q.defer();

                // Get handle to the CloudCode service
                var cc = IBMCloudCode.getService();
                var uri = new IBMUriBuilder().append(ACCESS.SOCIAL_AUTH_CODE).toString();

                // Get the Genres
                cc.get(uri, {
                    "handleAs": "json"
                }).then(function (token) {
                    def.resolve(token);
                }).catch(function (err) {
                    def.reject(err);
                })

                return def.promise;

            }).then(function(token) {

                // Check we have a token
                if (_.has(token, "token")) {
                    $rootScope.security_token = token;
                } else {
                    $ionicLoading.hide();
                    $rootScope.wifi();
                }

                // Create A Banner Add when in Cordova
                if (! _.isUndefined(AdMob) ) {

                    // Create the Banner Add Area through JS
                    AdMob.createBanner(
                        {
                            adId: $rootScope.config.admobid,
                            addSize: $rootScope.config.adtype,
                            position: AdMob.AD_POSITION.BOTTOM_CENTER,
                            autoShow: true
                        }, function () {
                            console.log("banner created");
                        }, function () {
                            console.log("failed to create AdMob");
                        });

                }

                // Handle the Cordova OAuth experience
                OAuth.popup("google", {
                    cache: true,
                    state : token.token
                }).done(function (google) {

                    // Save the context so we can
                    $rootScope.google = google;

                    // Set the Security Token on IBM Bluemix
                    IBMBluemix.setSecurityToken(google.access_token, IBMBluemix.SecurityProvider.GOOGLE);

                    // Lets get some information about the User
                    google.me().done(function (user) {

                        // Get the User
                        $rootScope.user = user;

                        // Get the signing in Member and see if they are registered
                        MembersService.getMember(user.raw.id).then(function (member) {


                            // Check if we have a registered member ?
                            if (_.isObject(member)) {
                                $ionicLoading.hide();
                                $rootScope.user.registered = true;
                                $rootScope.member = member;
                            } else {
                                // If not then they need to register to do stuff
                                $rootScope.user.registered = false;
                            }

                            // Move to the Next View
                            nextView();

                        }, function (err) {

                            // If Not then force them to
                            $ionicLoading.hide();
                            $rootScope.user.registered = false;

                            // Check we have an Avatar if not give them a simple one
                            if (!_.has($rootScope.user, "avatar")) {
                                $rootScope.user.avatar = "img/avatar.png";
                            }

                            // Move to the Next view
                            nextView();
                        });

                    }).fail(function (err) {
                        $ionicLoading.hide();
                        $rootScope.wifi();
                    });
                }).fail(function (err) {
                    $ionicLoading.hide();
                    $rootScope.wifi();
                });
            }).catch(function(err){
                $ionicLoading.hide();
                $rootScope.wifi();
            });
		};

	})


// A simple controller that shows a tapped item"s data
	.controller("AboutCtrl", function ($rootScope, $scope, Settings) {

        // Get the Configuration Information
		$scope.info = $rootScope.config.info;

		// Check
		$scope.intro = Settings.get("INTRO");

		$scope.introChange = function (intro) {

			// Set the Intro Load Screen
			Settings.set("INTRO", intro);

		};


	})

	.controller("IntroCtrl", function ($scope, $state, $ionicSlideBoxDelegate, $ionicHistory, Settings) {

		// Clear the Back stack
		$ionicHistory.nextViewOptions({
			disableAnimate: true,
			disableBack: true
		});

		// Called to navigate to the main app
		$scope.startApp = function () {

			// Clear the Back stack
			$ionicHistory.nextViewOptions({
				disableAnimate: true,
				disableBack: true
			});

			// Lets set that we have been through the Load Screen and Now no longer need to display it
			Settings.set("INTRO", false);

			// Havigate to the Board View
			$state.go("board.genres");
			//$state.go("board.board",{bid:1001});
		};

		// If we have displayed the screen before lets go to Main
		if (!Settings.get("INTRO")) {
			// Clear the Back stack
			$ionicHistory.nextViewOptions({
				disableBack: true
			});

			$state.go("board.genres");
			//$state.go("board.board",{bid:1001});
		}

		$scope.next = function () {
			$ionicSlideBoxDelegate.next();
		};
		$scope.previous = function () {
			$ionicSlideBoxDelegate.previous();
		};

		// Called each time the slide changes
		$scope.slideChanged = function (index) {
			$scope.slideIndex = index;
		};
	})

	// A simple controller that shows a tapped item"s data
	.controller("PrizesCtrl", function ($rootScope, $scope, Settings) {

		// Manage the Prizes for Specific Boards and Show what is on offer


	})

    .directive('fancySelect',
    [
        '$ionicModal',
        function($ionicModal) {
            return {
                /* Only use as <fancy-select> tag */
                restrict : 'E',

                /* Our template */
                templateUrl: 'templates/fancy-select.html',

                /* Attributes to set */
                scope: {
                    'items'        : '=', /* Items list is mandatory */
                    'text'         : '=', /* Displayed text is mandatory */
                    'value'        : '=', /* Selected value binding is mandatory */
                    'callback'     : '&'
                },

                link: function (scope, element, attrs) {

                    /* Default values */
                    scope.multiSelect   = attrs.multiSelect === 'true' ? true : false;
                    scope.allowEmpty    = attrs.allowEmpty === 'false' ? false : true;

                    /* Header used in ion-header-bar */
                    scope.headerText    = attrs.headerText || '';

                    /* Text displayed on label */
                    // scope.text          = attrs.text || '';
                    scope.defaultText   = scope.text || '';

                    /* Notes in the right side of the label */
                    scope.noteText      = attrs.noteText || '';
                    scope.noteImg       = attrs.noteImg || '';
                    scope.noteImgClass  = attrs.noteImgClass || '';

                    /* Optionnal callback function */
                    // scope.callback = attrs.callback || null;

                    /* Instanciate ionic modal view and set params */

                    /* Some additionnal notes here :
                     *
                     * In previous version of the directive,
                     * we were using attrs.parentSelector
                     * to open the modal box within a selector.
                     *
                     * This is handy in particular when opening
                     * the "fancy select" from the right pane of
                     * a side view.
                     *
                     * But the problem is that I had to edit ionic.bundle.js
                     * and the modal component each time ionic team
                     * make an update of the FW.
                     *
                     * Also, seems that animations do not work
                     * anymore.
                     *
                     */
                    $ionicModal.fromTemplateUrl(
                        'templates/fancy-select-items.html',
                        {'scope': scope}
                    ).then(function(modal) {
                            scope.modal = modal;
                        });

                    /* Validate selection from header bar */
                    scope.validate = function (event) {
                        // Construct selected values and selected text
                        if (scope.multiSelect == true) {

                            // Clear values
                            scope.value = '';
                            scope.text = '';

                            // Loop on items
                            jQuery.each(scope.items, function (index, item) {
                                if (item.checked) {
                                    scope.value = scope.value + item.id+';';
                                    scope.text = scope.text + item.text+', ';
                                }
                            });

                            // Remove trailing comma
                            scope.value = scope.value.substr(0,scope.value.length - 1);
                            scope.text = scope.text.substr(0,scope.text.length - 2);
                        }

                        // Select first value if not nullable
                        if (typeof scope.value == 'undefined' || scope.value == '' || scope.value == null ) {
                            if (scope.allowEmpty == false) {
                                scope.value = scope.items[0].id;
                                scope.text = scope.items[0].text;

                                // Check for multi select
                                scope.items[0].checked = true;
                            } else {
                                scope.text = scope.defaultText;
                            }
                        }

                        // Hide modal
                        scope.hideItems();

                        // Execute callback function
                        if (typeof scope.callback == 'function') {
                            scope.callback (scope.value);
                        }
                    }

                    /* Show list */
                    scope.showItems = function (event) {
                        event.preventDefault();
                        scope.modal.show();
                    }

                    /* Hide list */
                    scope.hideItems = function () {
                        scope.modal.hide();
                    }

                    /* Destroy modal */
                    scope.$on('$destroy', function() {
                        scope.modal.remove();
                    });

                    /* Validate single with data */
                    scope.validateSingle = function (item) {

                        // Set selected text
                        scope.text = item.text;

                        // Set selected value
                        scope.value = item.id;

                        // Hide items
                        scope.hideItems();

                        // Execute callback function
                        if (typeof scope.callback == 'function') {
                            scope.callback (scope.value);
                        }
                    }
                }
            };
        }
    ]
);

