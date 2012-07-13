package com.labs.hack;

import android.app.Activity;
import org.apache.cordova.*;
import android.os.Bundle;

public class HackThePlanetActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("http://google.com");
        //super.loadUrl("http://172.18.16.116:3000");
    }
}