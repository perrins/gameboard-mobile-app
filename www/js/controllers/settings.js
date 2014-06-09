angular.module('gameboard.settings.controllers', [])

// A simple controller that shows a tapped item's data
.controller('SettingsCtrl', function($scope, $stateParams,Settings) {

    debugger;

    $scope.settingsList = [{
        text: "Show Intro",
        checked:Settings.get('INTRO')
    }, {
        text: "Members in Search",
        checked: Settings.get('MEMBERS_IN_SEARCH')
    }];

    $scope.pushNotificationChange = function() {
        console.log('Push Notification Change', $scope.pushNotification.checked);
    };


});
