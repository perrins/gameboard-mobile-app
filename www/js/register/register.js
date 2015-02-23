'use strict';

angular.module("gameboard.register", [])

	.config(["$stateProvider", function ($stateProvider) {

        $stateProvider.state("register", {
            url: "/register",
            templateUrl: "js/register/register.html",
            controller: "RegisterCtrl"
        })
        $stateProvider.state("account", {
                url: "/account",
                templateUrl: "js/register/account.html",
                controller: "AccountCtrl"
        });

	}])

    .factory('SocialIntegration', function ($q, $cacheFactory,$rootScope, $stateParams,$http,$cookies, ACCESS) {

        return {

            getAccessToken: function (provider) {



                debugger;

                // Create a Defered, one of the collest programming patterns going
                var defer = $q.defer();

                // Get A Code
                var calls = Q.fcall ( function () {

                    /*
                    // Request a Server Side Generated Auth Code
                    var def = $q.defer();

                    // Get handle to the CloudCode service
                    var cc = IBMCloudCode.getService();
                    var uri = new IBMUriBuilder().append(ACCESS.SOCIAL_AUTH_CODE).toString();

                    // Get the Genres
                    cc.get(uri, {
                        "handleAs": "json"
                    }).then(function (token,options,data) {
                        debugger;
                        def.resolve(token);
                    }).catch(function (err) {
                        def.reject(err);
                    })

                    return def.promise;

                }).then( function(csrf) {
*/
                    var def = $q.defer();

                    if(!$rootScope.security_token) {
                        def.reject({error:"no security token which should have been resolved at signin"});
                    } else {

                        // Present Token to Popup
                        OAuth.popup(provider, {
                            cache: false,
                            state: $rootScope.security_token.token
                        }).then(function (auth) {
                            debugger;
                            def.resolve(auth);
                        }).fail(function(err){
                            def.reject(err);
                        });
                    }

                    return def.promise;

                }).then(function(auth) {

                    // Check if we need to
                    var def = $q.defer();

                    var options =  {handleAs:"json"};
                    if($rootScope.google && $rootScope.user) {
                        options.headers = {"X-GB-ACCESS-TOKEN":$rootScope.google.access_token,
                            "X-GB-USER-ID":$rootScope.user.raw.id};
                    }

                    // Add in CSRF Token
                    if(_.has($rootScope.security_token,"csrf")){
                        options.headers["x-csrf-token"] = $rootScope.security_token.csrf;
                    }

                    // Get handle to the CloudCode service
                    var cc = IBMCloudCode.getService();
                    var uri = new IBMUriBuilder().append(ACCESS.SOCIAL_AUTH).append(provider).toString();
                    uri += "?_csrf="+$rootScope.security_token;

                    console.log("CODE :"+auth.code);
                    console.log("CSRF :"+$rootScope.security_token.csrf);

                    // Now ask for the Access Token
                    cc.post(uri, {code:auth.code},options).then(function (data) {
                        // Lets Check if we have an object
                        if(!_.isObject(data)) {
                            def.reject(data);
                        } else {
                            // Resolve the Data
                            def.resolve({auth: auth, code: auth.code, token:data.token, user: data.user});
                        }
                    }).catch(function (err) {
                        def.reject(err);
                    });

                    return def.promise;

                }).fail(function(err) {
                    console.log("ERROR:"+JSON.Stringify(err));
                    defer.reject(err);
                });

                // Return the compound promise
                defer.resolve(calls);

                return defer.promise;

            }
        }

    })

// A simple controller that shows a tapped item"s data
    .controller("RegisterCtrl", function ($ionicScrollDelegate,$cookies, $rootScope, $state, $scope, MembersService,$ionicLoading, WizardHandler, $ionicPopup,SocialIntegration) {

        // Check if user is defined
        if (!$rootScope.user) {
            $state.go("signin");
        }

        // Keep a Scope copy of the wizard
        $scope.init = function init() {
            $scope.wizard = WizardHandler.wizard("registerWizard");
        }

        $scope.actionText = "Next";

        // Set the Form
        $scope.setPersonalForm = function(personalForm) {
            $scope.personalForm = personalForm;
        }

        $scope.setSocialForm = function(socialForm) {
            $scope.socialForm = socialForm;
        }

        $scope.countries = [
            {id: 1, text: 'USA', checked: false, icon: "http://www.sciencekids.co.nz/images/pictures/flags680/United_States.jpg"},
            {id: 2, text: 'United Kingdom', checked: true, icon: 'http://www.sciencekids.co.nz/images/pictures/flags680/United_Kingdom.jpg'},
            {id: 3, text: 'Japan', checked: false, icon: "http://www.sciencekids.co.nz/images/pictures/flags680/Japan.jpg"},
            {id: 4, text: 'Germany', checked: false, icon: "http://www.sciencekids.co.nz/images/pictures/flags680/Germany.jpg"}];

        $scope.platforms = [
            {id: 1, text: 'PS4', checked: false, icon: null},
            {id: 2, text: 'PS3', checked: false, icon: null},
            {id: 3, text: 'XBOX 360', checked: false, icon: null},
            {id: 4, text: 'XBOX One', checked: false, icon: null},
            {id: 5, text: 'Wii', checked: false, icon: null},
            {id: 6, text: 'Wii U', checked: false, icon: null},
            {id: 7, text: 'Apple Mac', checked: false, icon: null},
            {id: 8, text: 'PC', checked: false, icon: null},
            {id: 9, text: 'Gamers PC', checked: false, icon: null},

            {id: 10, text: 'XBOX One', checked: false, icon: null},
            {id: 11, text: 'XBOX One', checked: false, icon: null},


            {id: 12, text: 'Steam', checked: false, icon: null},
            {id: 13, text: 'iPad', checked: false, icon: null},
            {id: 14, text: 'Android Tablet', checked: false, icon: null},
            {id: 15, text: 'iPhone', checked: false, icon: null},
            {id: 16, text: 'Android Phone', checked: false, icon: null}];

        // Build a Default View
        $scope.member =
        {
            twitter:false,
            facebook:false,
            google:false,
            sms:true,
            email:true,
            country:2
        };

        $scope.countries_text_single = 'Choose country';
        $scope.platforms_text_multiple = 'Choose Platforms';

        // Manage the Registration Process
        $scope.user = $rootScope.user;
        $scope.page = 0;

        // Move the Name section
        $scope.next = function () {

            // Work out where we are and then the proposed action
            $scope.page = $scope.wizard.currentStepNumber();

            switch ($scope.page ) {
                case 0:
                case 1:
                    // Validate Form 1
                    $scope.actionText = "Next";
                    break;
                case 2:
                    $scope.actionText = "Register";
                    break;
                case 3:
                    $scope.actionText = "Finish";
                    break;
            }

            // VALIDATE THE FORM
            $ionicScrollDelegate.scrollTop();
            $scope.wizard.next();
        };

        // Move the Name section
        $scope.back = function () {

            $ionicScrollDelegate.scrollTop();
            WizardHandler.wizard().previous();
        };

        // Handle Social Integration, need the FB, Twitter details to be able to
        // Post information of videos that have been added.
        $scope.authSocial = function (provider) {

            // If On THen Do it
            if($scope.member[provider]) {

                // Lets load the Videos for the Youtube Channel
                $ionicLoading.show({
                    template: "<i class=\"ion-loading-c\"></i><span>&nbsp;Authorising with "+provider.replace(/^(.){1}/,'$1'.toUpperCase())+"...</span>"
                });

                // Lets Get the socual integration
                SocialIntegration.getAccessToken(provider).then(function (access) {

                    // Check we got something back
                    if(access) {
                        // Save the
                        $scope.member[provider+"_token"] = access;
                        if(provider==="twitter") {
                            $scope.member[provider+"id"] = access.user.alias;
                        } else {
                            $scope.member[provider + "id"] = access.user.name;
                        }
                        $scope.member[provider] = true;

                    } else {
                        $scope.member[provider] = false;
                    }

                    $ionicLoading.hide();

                }, function (err) {
                    $ionicLoading.hide();
                    $scope.member.facebook = false;
                    $rootScope.wifi();
                });

            } else {
                $scope.member[provider]=false;
                delete $scope.member[provider+"id"];
                delete $scope.member[provider+"_token"];
            }

        };

        // Finish the Wizard
        $scope.register = function (member) {

            // Validate the Member information before trying to

            // Lets Validate and Add any other meta data we need
            MembersService.registerMember(member).then(function (member) {

                // Get the Global Scope
                var appscope = angular.element("body").injector().get("$rootScope");

                // Set them as Registerd
                appscope.user.registered = true;
                $scope.actionText = "Finish";

                $scope.next();

            }, function (err) {
                var alertPopup = $ionicPopup.alert({
                    title: "Register",
                    template: "Failed to register your details, please try again later"
                });
            });

        };

        // Handle the Registration Action
        $scope.action = function(member) {

            // Check what view we are on and then validate and continue
            switch($scope.page) {
                case 0:
                    $scope.next();
                    break;
                case 1:

        //            $scope.next();
        //            break;

                    // Check if Form is valid
                    if($scope.personalForm.$valid) {
                        // Display Message to Users
                        $scope.next();
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Register',
                            template: 'To complete registration, enter all your personal details, thank you'
                        });

                        alertPopup.then(function (res) {
                            // Handle the Next step
                        });
                    }
                    break;

                case 2:

                    // Check we have one Social integration
                    if($scope.socialForm.$valid) {

                        debugger;

                        // Add in the Logged in User Details
                        member.muuid = $rootScope.user.raw.id;
                        member.user = $rootScope.user;

                        $scope.register(member);
                    }

                    break;
                case 3 :
                    $scope.finish();
                    break;
            }

        }

        // Finish the Wizard
        $scope.finish = function () {
            $state.go("intro");
        };

        // Handle the the cancel
        $scope.cancel = function () {
            $state.go("intro");
        };
    })



// A simple controller that shows a tapped item"s data
    .controller("AccountCtrl", function ($ionicScrollDelegate, $ionicLoading, $rootScope, $state, $scope, MembersService, WizardHandler) {

        // Manage the Registration Process
        var user = $rootScope.user;

        // No User lets navigate
        if (!user) {
            $state.go("signin");
            return;
        }

        // If they are not registered then take them to registration
        if (!user.registered) {
            $state.go("register");
            return;
        }

        // Lets load the Videos for the Youtube Channel
        $ionicLoading.show({
            template: "Getting your membership..."
        });

        // Lets Get the Member information
        MembersService.getMember(user.raw.id).then(function (member) {

            $ionicLoading.hide();
            $rootScope.user.registered = true;
            $rootScope.member = member;
            $scope.member = member;

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }, function (err) {

            var alertPopup = $ionicPopup.alert({
                title: "Loading Register",
                template: "Failed to register your details, please try again later"
            });


        });

        // Move the Name section
        $scope.save = function () {
            // Update Account Details

        };

        // Handle the the cancel
        $scope.cancel = function () {
            $state.go("intro");
        };
    });






