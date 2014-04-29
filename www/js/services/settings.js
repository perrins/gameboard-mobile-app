angular.module('gameboard.services', ['ngResource'])

.constant('DEFAULT_SETTINGS', {
    'tempUnits': 'f'
})

.factory('Settings', function($rootScope, DEFAULT_SETTINGS) {

    $scope.actionButtons = [{
        type: 'button-clear',
        content: '<div class="buttons"><button class="button button-icon icon ion-ios7-minus-outline"></button></div>',
        tap: function() {
            // Set the Attribute
            debugger;
            $scope.showDelete = !$scope.showDelete;
        }

    }];

    var _settings = {};
    try {
        _settings = JSON.parse(window.localStorage['settings']);
    } catch (e) {}

    // Just in case we have new settings that need to be saved
    _settings = angular.extend({}, DEFAULT_SETTINGS, _settings);

    if (!_settings) {
        window.localStorage['settings'] = JSON.stringify(_settings);
    }

    var obj = {
        getSettings: function() {
            return _settings;
        },
        // Save the settings to localStorage
        save: function() {
            window.localStorage['settings'] = JSON.stringify(_settings);
            $rootScope.$broadcast('settings.changed', _settings);
        },
        // Get a settings val
        get: function(k) {
            return _settings[k];
        },
        // Set a settings val
        set: function(k, v) {
            _settings[k] = v;
            this.save();
        },

        getTempUnits: function() {
            return _settings['tempUnits'];
        }
    }

    // Save the settings to be safe
    obj.save();
    return obj;
});
