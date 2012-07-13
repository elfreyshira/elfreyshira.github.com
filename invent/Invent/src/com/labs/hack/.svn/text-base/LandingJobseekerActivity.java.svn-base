package com.labs.hack;

import android.app.Activity;
import org.apache.cordova.*;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

public class LandingJobseekerActivity extends DroidGap{
    String landingUrl="";
	
	/** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        bump();
        super.loadUrl(landingUrl);
        //setContentView(R.layout.jobseeker);
        //Button feedback = (Button)findViewById(R.id.feedback_button);
        //feedback.setOnClickListener(this);
        //super.loadUrl("http://172.18.16.116:3000");
    }
    
    private void bump() {
    	landingUrl="http://jwolfe.ausoff.indeed.net:3000/landing/jobseeker/1";  //Should actually be data from the bump
    }

	public void onClick(View v) {
		// TODO Auto-generated method stub
		super.loadUrl(landingUrl);
	}
    
}