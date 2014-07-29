angular.module('gameboard.settings', [])

.constant('DEFAULT_SETTINGS', {
    'UNITS': 'dollars',
    'LOADSCREEN' : true,
    'INTRO' : true,
    'AUTOREFRESH' : false
})

.factory('Settings', function($rootScope, DEFAULT_SETTINGS) {

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
        }

    };

    // Save the settings to be safe
    obj.save();

    return obj;
});
