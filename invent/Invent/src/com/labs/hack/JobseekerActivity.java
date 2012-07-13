package com.labs.hack;

import android.app.Activity;
import org.apache.cordova.*;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

public class JobseekerActivity extends DroidGap implements OnClickListener{
    String companyUrl="";
	
	/** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        bump();
        setContentView(R.layout.jobseeker);
        Button feedback = (Button)findViewById(R.id.feedback_button);
        feedback.setOnClickListener(this);
        //super.loadUrl("http://172.18.16.116:3000");
    }
    
    private void bump() {
    	companyUrl="http://www.indeed.com/cmp/Indeed";  //Should actually be data from the bump
    }

	public void onClick(View v) {
		// TODO Auto-generated method stub
		super.loadUrl(companyUrl);
	}
    
}