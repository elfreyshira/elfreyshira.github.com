package com.labs.hack;

import android.app.Activity;
import org.apache.cordova.*;

import com.labs.hack.SimpleGestureFilter.SimpleGestureListener;
import com.labs.hack.SimpleGestureFilter;

import android.os.AsyncTask;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ViewFlipper;

public class EmployerActivity extends DroidGap implements SimpleGestureListener{
    private String resumePageUrl="";
    private String criteriaPageUrl="";
    private WebView resumeView;
    private WebView criteriaView;
    private ViewFlipper flipView;
    
    private Animation slideLeftIn;
    private Animation slideLeftOut;
    private Animation slideRightIn;
    private Animation slideRightOut;
    
    private SimpleGestureFilter filter;
	
	/** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        bump();
        setContentView(R.layout.employer);
        resumeView = (WebView) findViewById(R.id.resumeview);
        resumeView = _clientSettings(resumeView);
        flipView = (ViewFlipper) findViewById(R.id.flipview);
        
        slideLeftIn = AnimationUtils.loadAnimation(this, R.anim.slide_in_left);
        slideLeftOut = AnimationUtils.loadAnimation(this, R.anim.slide_out_left);
        slideRightIn = AnimationUtils.loadAnimation(this, R.anim.slide_in_right);
        slideRightOut = AnimationUtils.loadAnimation(this, R.anim.slide_out_right);
        
        this.filter = new SimpleGestureFilter(this,this);
        this.filter.setMode(SimpleGestureFilter.MODE_TRANSPARENT);
        
        resumeView.loadUrl(resumePageUrl);
        resumeView.setWebViewClient(new BasicWebViewClient());
        
        new ManageViews().execute();

//        super.loadUrl(resumeUrl);
        //super.loadUrl("http://172.18.16.116:3000");
    }
    
    private void bump() {
    	//http://labkit.indeed.com/qrme?url=http%3A%2F%2Fwww.indeed.com%2Fme%2Felfreyshira
    	resumePageUrl="http://www.indeed.com/me/elfreyshira";
    	criteriaPageUrl="http://jwolfe.ausoff.indeed.net:3000/static/webpages/codiqa-app/app.html";  //Should actually be data from the bump
    }
    
    private class BasicWebViewClient extends WebViewClient {
    	@Override
    	public boolean shouldOverrideUrlLoading(WebView view, String url) {
    		view.loadUrl(url);
    		return true;
    	}    	
    	
    }
    
    @Override
    public boolean dispatchTouchEvent(MotionEvent me) {
        this.filter.onTouchEvent(me);
        return super.dispatchTouchEvent(me);
    }

    
    private class ManageViews extends AsyncTask<Void, Void, Void> {

        @Override
        protected Void doInBackground(Void... args) {
                        // cat view will load a categories webview
            criteriaView = (WebView) findViewById(R.id.criteriaview);
            criteriaView = _clientSettings(criteriaView);
            criteriaView.loadUrl(criteriaPageUrl);
            criteriaView.setWebViewClient(new BasicWebViewClient());

//                        // load a search resource
//            searchView = (WebView) findViewById(R.id.searchview);
//            searchView = _clientSettings(searchView);
//            searchView.loadUrl("file:///android_asset/test3.html");
//            searchView.setWebViewClient(new BasicWebViewCient());

            return null;
        }
    }
    
    private WebView _clientSettings(WebView view) {
    	view.getSettings().setJavaScriptEnabled(true);
    	view.setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);
    	return view;
    }
	public void onSwipe(int direction) {
		switch (direction) {

	    case SimpleGestureFilter.SWIPE_LEFT:
	            _setResume();
	        break;
	    case SimpleGestureFilter.SWIPE_RIGHT:
	            _setCriteria();
	        break;
	    case SimpleGestureFilter.SWIPE_DOWN:
	    case SimpleGestureFilter.SWIPE_UP:

	    }
	}

	private void _setCriteria() {
		// TODO Auto-generated method stub
		if(flipView.getDisplayedChild() != 0) {
			flipView.setInAnimation(slideLeftIn);
			flipView.setOutAnimation(slideRightOut);
			flipView.setDisplayedChild(0);
		}
	}

	private void _setResume() {
		// TODO Auto-generated method stub
		if(flipView.getDisplayedChild() != 1) {
			flipView.setInAnimation(slideRightIn);
			flipView.setOutAnimation(slideLeftOut);
			flipView.setDisplayedChild(1);
		}
	}

	public void onDoubleTap() {
		// TODO Auto-generated method stub
		
	}
    
}