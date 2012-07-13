package com.labs.hack;

import org.apache.cordova.*;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.view.Window;


public class InventActivity extends DroidGap implements OnClickListener{	

	
    /** Called when the activity is first created. */
    @Override    
    public void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_INDETERMINATE_PROGRESS);
    	super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        Button employer = (Button)findViewById(R.id.employer_button);
        Button jobseeker = (Button)findViewById(R.id.jobseeker_button);
        employer.setOnClickListener(this);
        jobseeker.setOnClickListener(this);
    }

	public void onClick(View arg0) {
		// TODO Auto-generated method stub
		switch(arg0.getId()){
			case R.id.employer_button: 
				startActivity(new Intent(InventActivity.this, LandingEmployerActivity.class));
				break;
			case R.id.jobseeker_button: 
				startActivity(new Intent(InventActivity.this, LandingJobseekerActivity.class));
				break;
		}
	}
    
}
