
This Cordova plugin is to add InMobi SDK to cordova project, as depency of other plugins.

# How to use? #

Write dependency entry in plugin.xml of other plugins:

```xml
	<dependency id="com.inmobi.sdk" version=">=4.5.1"/>
```

Or, add it by hand:

    cordova plugin add com.inmobi.sdk
    
# Version #

* SDK for iOS v4.5.1
* SDK for Android, v4.5.1

# Proguard #

```java
-keep class com.google.android.gms.ads.identifier.AdvertisingIdClient{
     public *;
}
-keep class com.google.android.gms.ads.identifier.AdvertisingIdClient$Info{
     public *;
}
```

