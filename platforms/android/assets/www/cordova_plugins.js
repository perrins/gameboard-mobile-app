cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.google.cordova.admob/www/AdMob.js",
        "id": "com.google.cordova.admob.AdMob",
        "clobbers": [
            "window.AdMob"
        ]
    },
    {
        "file": "plugins/com.hutchind.cordova.plugins.streamingmedia/www/StreamingMedia.js",
        "id": "com.hutchind.cordova.plugins.streamingmedia.StreamingMedia",
        "clobbers": [
            "streamingMedia"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.oauthio/www/dist/oauth.js",
        "id": "com.phonegap.plugins.oauthio.OAuth",
        "merges": [
            "OAuth"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.splashscreen/www/splashscreen.js",
        "id": "org.apache.cordova.splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/com.rjfun.cordova.facebookads/www/FacebookAds.js",
        "id": "com.rjfun.cordova.facebookads.FacebookAds",
        "clobbers": [
            "window.FacebookAds"
        ]
    },
    {
        "file": "plugins/com.rjfun.cordova.flurryads/www/Flurry.js",
        "id": "com.rjfun.cordova.flurryads.FlurryAds",
        "clobbers": [
            "window.FlurryAds"
        ]
    },
    {
        "file": "plugins/com.rjfun.cordova.mmedia/www/mMedia.js",
        "id": "com.rjfun.cordova.mmedia.mMedia",
        "clobbers": [
            "window.mMedia"
        ]
    },
    {
        "file": "plugins/com.rjfun.cordova.mobfox/www/MobFox.js",
        "id": "com.rjfun.cordova.mobfox.MobFox",
        "clobbers": [
            "window.MobFox"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js",
        "id": "org.apache.cordova.inappbrowser.inappbrowser",
        "clobbers": [
            "window.open"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "android.support.v4": "21.0.1",
    "com.flurry.sdk": "5.4.0",
    "com.google.cordova.admob": "2.6.3",
    "com.google.cordova.admob-facebook": "1.0.0",
    "com.google.cordova.admob-flurry": "5.4.0",
    "com.google.cordova.admob-iad": "1.0.0",
    "com.google.cordova.admob-inmobi": "1.0.0",
    "com.google.cordova.admob-mmedia": "1.6.0",
    "com.google.cordova.admob-mobfox": "6.0.0",
    "com.hutchind.cordova.plugins.streamingmedia": "0.1.0",
    "com.phonegap.plugins.oauthio": "0.2.1",
    "org.apache.cordova.console": "0.2.8",
    "org.apache.cordova.device": "0.2.9",
    "org.apache.cordova.splashscreen": "0.3.5",
    "com.google.playservices": "19.0.0",
    "com.rjfun.cordova.extension": "1.0.6",
    "com.rjfun.cordova.facebookads": "3.21.1",
    "com.rjfun.cordova.flurryads": "2.1.0",
    "com.inmobi.sdk": "4.5.1",
    "com.rjfun.cordova.mmedia": "2.1.1",
    "com.rjfun.cordova.mobfox": "2.1.0",
    "org.apache.cordova.inappbrowser": "0.5.4"
}
// BOTTOM OF METADATA
});