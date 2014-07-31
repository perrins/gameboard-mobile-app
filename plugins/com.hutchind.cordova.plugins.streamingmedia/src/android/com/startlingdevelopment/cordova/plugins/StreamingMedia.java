package com.startlingdevelopment.cordova.plugins;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;

public class StreamingMedia extends CordovaPlugin {
	public static final String ACTION_PLAY_VIDEO = "playVideo";
	public static final String ACTION_PLAY_AUDIO = "playAudio";

	@Override
	public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
		Runnable runnable = new Runnable() {
			public void run() {
				if (ACTION_PLAY_AUDIO.equals(action)) {
					final String url = args.getString(0);
					RelativeLayout main = new RelativeLayout(cordova.getActivity());
					main.setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
					VideoView mVideoView = new VideoView(cordova.getActivity());
					mVideoView.setVideoPath(url);
					mVideoView.setMediaController(new MediaController(cordova.getActivity()));
					mVideoView.setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
					main.addView(mVideoView);
					Dialog foo = new Dialog(this, android.R.style.Theme_NoTitleBar);
					WindowManager.LayoutParams wlp = new WindowManager.LayoutParams();
					wlp.copyFrom(foo.getWindow().getAttributes());
					wlp.width = WindowManager.LayoutParams.MATCH_PARENT;
					wlp.height = WindowManager.LayoutParams.MATCH_PARENT;
					mVideoView.setBackgroundColor(Color.WHITE);
					foo.setContentView(main);
					foo.show();
					foo.getWindow().setAttributes(wlp);
					mVideoView.requestFocus();
					mVideoView.start();
				}
			}
		};
		this.cordova.getActivity().runOnUiThread(runnable);
		return "";
	}
}