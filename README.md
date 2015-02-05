Gameboard Mobile App
=====================

This project contains the code for the Mobile Client App for the Gameboard Video ranking service

## Setup

You need to use the following steps to configure and setup the project for running the mobile app, to integrate it with the Bluemix backend
make sure you have the `gameboard-cloud' node server running on your local machine and that you have the 'localserver:true' set in the 'www/config.json'.
This will make sure the App communicates with the address of the local node instance of the cloud servcies for Gameboard.

Before we begin lets make sure we have some development prereqursites are installed. We need to have already installed the following

1. NodeJS Server and NPM
2. XCode IDE and Command Line Development Tools
3. Android SDK and Development tools and installed the 19 and 21 instances of Android
4. Genymotion Android Emulator and installed a Lollipop of KitKat version of Android
5. Homebrew is recommended as it help install stuff
6. WebStorm IDE is useful for running and debugging Node code
7. POSTMAN Google add on helps with testing REST Services
8. Chrome needs to be installed

The following are the command line options for installing some of the development tools.

```bash
sudo npm install -g cordova
sudo npm install -g ionic
sudo npm install -g grunt-cli
brew install ant
```

Preparing to Run
---

The following commands can be used to prepare the development env to run:

```bash
grunt build
cordova platform add ios
cordova platofrm add android
cordova build ios android
```

If these commands run without error you are ready to run the app in two modes, the first is using Chrome as a development env for debugging
testing the code.

Running in Chrome
---

You need to create a script call `chrome.sh' in your local bin directory, before you run this command make sure you have force quit the chrome
process. This command will open it up with local web security disabled so it will be able to make cross domain calls in the same way a Cordova
application can do.
```bash
open -a Google\ Chrome --args --disable-web-security
```

Start the Chrome and then launch the app using ionic, you should notice a yellow bar display that chrome is now running with some security
features disabled.

```bash
ionic serve --lab
```

or Launch it using the full screen
```bash
ionic serve
```

You should see the app now running in Chrome.

## Issues
Issues have been disabled on this repo, if you do find an issue or have a question consider posting it on the [Ionic Forum](http://forum.ionicframework.com/).  Or else if there is truly an error, follow our guidelines for [submitting an issue](http://ionicframework.com/contribute/#issues) to the main Ionic repository. On the other hand, pull requests are welcome here!

