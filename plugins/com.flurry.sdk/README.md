
This Cordova plugin is to add Flurry Analytics and Ads SDK to cordova project, as depency of other plugins.

# How to use? #

Write dependency entry in plugin.xml of other plugins:

```xml
	<dependency id="com.flurry.sdk" version=">=5.4.0"/>
```

Or, add it by hand:

    cordova plugin add com.flurry.sdk
    
# Version #

* Flurry Analytics SDK for Android, v4.2.0
* Flurry Ads SDK for Android, v4.2.0
* Flurry Analytics SDK for iOS, v5.4.0
* Flurry Ads SDK for iOS, v5.4.0

# ProGuard #

If you plan to run ProGuard on your APK before releasing your app, you will need to add the following to your “proguard.cfg” file:
­
```
keep class com.flurry.** { *; }
­dontwarn com.flurry.**
­keepattributes *Annotation*,EnclosingMethod ­keepclasseswithmembers class * {
	public <init>(android.content.Context, android.util.AttributeSet, int); 
}

# Google Play Services library
­keep class * extends java.util.ListResourceBundle {
￼￼	protected Object[][] getContents(); 
}
­keep public class com.google.android.gms.common.internal.safeparcel.SafeParcelable {
	public static final *** NULL; 
}
­keepnames @com.google.android.gms.common.annotation.KeepName class * ­keepclassmembernames class * {
	@com.google.android.gms.common.annotation.KeepName *; 
}
­keepnames class * implements android.os.Parcelable { 
	public static final ** CREATOR;
}
```