cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "com.ionic.keyboard.keyboard",
        "file": "plugins/com.ionic.keyboard/www/keyboard.js",
        "pluginId": "com.ionic.keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ]
    },
    {
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.ionic.keyboard": "0.0.1",
    "cordova-plugin-splashscreen": "4.0.3"
};
// BOTTOM OF METADATA
});