// ****************
// make it where it calls everything at once.

// http://www.deanclatworthy.com/imdb/
have_searched = false;

$(document).ready(function() {

  // setting the movie input text
  $(".cover, .loader").hide();
  $("#search").attr("onblur","check_empty_blur()");
  $("#search").attr("onfocus","check_empty_focus()");
  check_empty_blur();

  $("#about").hide();

  

});

function show_about(){
  $("#about").slideToggle(500);
  // $(".source").slideToggle();
}

function check_empty_blur() {
  if ($("#search").val() == "") {
    if (have_searched) { search_value = "another movie -> press enter"; }
    else               { search_value = "movie name -> press enter"; }
    $("#search").val(search_value)
                .css("color","#ccc");
  }
}
function check_empty_focus() {
  var search = $("#search");
  if ($("#search").val() == "movie name -> press enter" ||
                  $("#search").val() == "another movie -> press enter" ) {
    $("#search").val("")
                .css("color","#000");
  }
}


function make_url_able(str) {
  // return str.replace(/\W|_/g,"+").replace(/\++/g,"+");
  return str.replace(/[_]/g,"+").replace(/[-·]/,"_").replace(/\W+/g,"+").replace(/_/,"-");
}

function percent_match(query, found) {
  // returns how many percent of of found has query in it.
  var query_list = query.toLowerCase().split(/\W+/);
  var found_list = found.toLowerCase().split(/\W+/);
  var word_count = 0.0;
  for (var i = 0; i < found_list.length; i++) {
    if (query_list.indexOf(found_list[i]) >= 0) {
      word_count += 1.0;
    }
  };
  var percent = word_count/found_list.length;
  return percent;

}




///////////// *************************************** /////////////////////
///////////// *************************************** /////////////////////
///////////// *************************************** /////////////////////
///////////// *************************************** /////////////////////





function find_movie() {

  $(".cover").show().animate({opacity: 0.5},200);
  $(".loader").show().animate({opacity: 1.0},200);

  have_searched = true;
  title_search = $("#search").val();
  $("#search").blur();
  title_url = make_url_able(title_search);

  movie_title = false;
  display_title = false;
  source_classes = [];
  source_names = [];
  scores = [];
  out_of = [];
  year = false;
  count = 0;
  imdb_id = false;
  page_limit = "10"; // page limit for rotten tomatoes api

  ajax_count = 0;
  total = 3; // *** total number of sites it looks for ****

  // fill_output("Inception (2010)", ["imdb","rt"], ["IMDB","Rotten Tomatoes"], ["9","60"], ["/ 10","%"]);
  // return;
  do_imdb();
  // do_rt();
  // do_tmdb();
}


imdb_fail = false;
function do_imdb() {
  $.ajax({
    url: "http://www.imdbapi.com/?t="+title_url,
    dataType: 'jsonp',
    timeout: 10000,
    success: function(data){
      if (data.Response == "True") {
        if (!year || !movie_title) {
          year = data.Year;
          movie_title = data.Title;
          display_title = movie_title + " <span class='dem'>(" + year + ")</span>";
        }
        imdb_id = data.ID;
        if (data.Rating != "N/A") {
          source_classes[count] = "imdb";
          source_names[count] = "IMDB";
          scores[count] = data.Rating;
          out_of[count] = "/ 10";
          imdb_fail = false;
          count += 1;
        }
        else {
          imdb_fail = true;
        }
      }
      else {
        imdb_fail = true;
      }
    },
    error: function(crap){
      imdb_fail = true;
    },
    complete: function() {
      do_rt();
      // finish_up();
    }
  });
}


function do_rt() {

  var search_url;
  if (movie_title) {
    search_url = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=f278acux2dr8vmmueege9bfv&page_limit="+
                                                                  page_limit+"&q="+make_url_able(movie_title);
  }
  else {
    search_url = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=f278acux2dr8vmmueege9bfv&page_limit="+
                                                                                      page_limit+"&q="+title_url;
  }
  $.ajax({
    url: search_url,
    dataType: 'jsonp',
    timeout: 5000,
    success: function(data){

      if (data.total > 0) { //only analyze if there's some returned data

        var limit = Math.min(data.total, page_limit); //make sure the page_limit variable is set
        if (movie_title) { match_query = movie_title; }
        else { match_query = title_search; }

        max_rate = 0;
        max_rate_index = 0;
        for (i = 0; i < limit; i++) {

          // if the RT imdb_id matches the previous imdb_id
          if (imdb_id && imdb_id == "tt"+data.movies[i].alternate_ids.imdb) {
            break;
          }

          // check to see if the searched title matches the exact json title
          if (data.movies[i].title == movie_title && data.movies[i].year == year) {
            break;
          }

          // if the imdb_id is false and no title matches, then check matching rate
          var rate_match = percent_match(match_query, data.movies[i].title);
          if (rate_match > max_rate) {
            max_rate = rate_match;
            max_rate_index = i;
          }
        };
        if (i >= limit) {
          i = max_rate_index;
        }

        var movie_data = data.movies[i];

        if (!year || !movie_title) {
          year = movie_data.year.toString();;
          movie_title = movie_data.title;
          display_title = movie_title + " <span class='dem'>(" + year + ")</span>";
        }

        if (!imdb_id && movie_data.alternate_ids && movie_data.alternate_ids.imdb) {
          imdb_id = "tt"+movie_data.alternate_ids.imdb;
        }

        if (movie_data.ratings.critics_score >= 0){
          source_classes[count] = "rtc";
          source_names[count] = "Rotten Tomatoes: Critics";
          scores[count] = movie_data.ratings.critics_score;
          out_of[count] = "%";
          count += 1;
        }
        source_classes[count] = "rta";
        source_names[count] = "Rotten Tomatoes: Audience";
        scores[count] = movie_data.ratings.audience_score;
        out_of[count] = "%";
        count += 1;
      }
    },
    error: function(crap){
      // alert("RT fail");
    },
    complete: function() {
      do_tmdb();
      // finish_up();
    }
  });

}

function do_tmdb() {
  var search_url;
  if (imdb_id) {
    search_url = "http://api.themoviedb.org/2.1/Movie.imdbLookup/en/json/bb0d9620f620e8097998203a8af18aec/"+
                    imdb_id;
  }
  else {
    search_url = "http://api.themoviedb.org/2.1/Movie.search/en/json/bb0d9620f620e8097998203a8af18aec/"+
                    title_url;
    if (year) {
      search_url = search_url + "+" + year;
    }
  }
  $.ajax({
    // type: "GET",
    url: search_url,
    dataType: 'jsonp',
    timeout: 5000,
    success: function(data){
      if (data.length > 0 && data[0].rating){
        if (!year || !movie_title) {
          year = data[0].released.split("-")[0];
          movie_title = data[0].name;
          display_title = movie_title + " <span class='dem'>(" + year + ")</span>";
        }
        source_classes[count] = "tmdb";
        source_names[count] = "The Movie DB";
        scores[count] = data[0].rating;
        out_of[count] = "/ 10";
        count += 1;
      }
    },
    error: function(crap){
      // alert("RT fail");
    },
    complete: function() {
      if (imdb_fail){
        do_imdb_backup();
      }
      else {
        fill_output(display_title, source_classes, source_names, scores, out_of);
      }
      // finish_up();
    }
  });

}

function imdbapi(data){ //from do_imdb_backup from http://www.deanclatworthy.com/imdb
  if (data.code != 1 && data.rating != "n/a") {
    if (!year || !movie_title) {
      year = data.year;
      movie_title = data.title;
      display_title = movie_title + " <span class='dem'>(" + year + ")</span>";
    }
    imdb_id = data.imdbid;
    source_classes[count] = "imdb";
    source_names[count] = "IMDB";
    scores[count] = data.rating;
    out_of[count] = "/ 10";
    count += 1;
  }
}
function do_imdb_backup() {
  var search_url;
  if (imdb_id) {
    search_url = "http://www.deanclatworthy.com/imdb/?id="+imdb_id;
  }
  else if (movie_title) {
    search_url = "http://www.deanclatworthy.com/imdb/?q="+make_url_able(movie_title);
    if (year) {
      search_url = search_url + "&year=" + year;
    }
  }
  else {
    search_url = "http://www.deanclatworthy.com/imdb/?q="+title_url;
  }
  search_url = search_url + "&type=jsonp";

  $.ajax({
    url: search_url,
    dataType: 'jsonp',
    timeout: 5000,
    success: function(data){
    },
    error: function(crap){
    },
    complete: function() {
      fill_output(display_title, source_classes, source_names, scores, out_of);
      // finish_up();
    }
  });  
}




function fill_output(display_title, source_classes, source_names, scores, out_of) {

  $(".cover, .loader").animate({opacity: 0.0},200,function() {
    $(this).hide();
  });

  if (!display_title) {
    alert("Either your internet isn't working, or you're misspelling it.");
    return;
  }
  var percentages = []; //array of floats

  // filling in the html//////////////////////
  var source_entry = '\
      <div class="SOURCE_CLASS source"> \n\
        <div class="empty"></div> \n\
        <p> SOURCE_NAME </p> \n\
        <div class="fill"></div> \n\
        <div class="score"> \n\
          <span class="num">SCORE</span> \n\
          <span class="dem">OUT_OF</span> \n\
        </div> \n\
      </div> ';
  var final_output = '<div class="entry_output"> <div class="scores_output">';
  for (var i = 0; i < source_classes.length; i++) {
    scores[i] = Math.max(scores[i],0);
    final_output += source_entry.replace("SOURCE_CLASS",source_classes[i]).replace("SOURCE_NAME",source_names[i]
      ).replace("SCORE",scores[i]).replace("OUT_OF",out_of[i]);

    // if it's a percent rating, then just divide by 100. else, then take the max value and divide the score by that value
    if (out_of[i] == "%"){
      percentages[i] = parseFloat(scores[i])/100.0;
    }
    else {
      percentages[i] = parseFloat(scores[i])/parseFloat(out_of[i].split(" ")[1]);
    }
  };
  final_output += ' </div>\n\
    <div class="movie_footer"> <p>' + display_title +'</p> </div> \n\
    </div>';
  var output_html = $(final_output);


  // filling in the CSS //////////////////////////////

  var width_percent = 100.0/percentages.length;
  width_percent = width_percent.toString()+"%";
  for (var i = 0; i < percentages.length; i++) {
    // setting the width according to how many sources there are
    output_html.find("."+source_classes[i]).css("width",width_percent);

    // finding heights
    var fill_height = (percentages[i]*200.0)-2.0;
    var empty_height = 198.0 - fill_height;

    // finding colors
    var blue = 50.0, red, green;
    if (percentages[i] < 0.5) {
      red = 255.0;
      green = percentages[i]*2.0*255.0;
    }
    else {
      green = 255.0;
      red = (1.0-(percentages[i]-0.5)*2.0)*255.0;
    }


    border_red = parseInt(red/2.0).toString(16);
    border_green = parseInt(green/2.0).toString(16);
    border_blue = parseInt(blue/2.0).toString(16);

    red = parseInt(red)
    red = red.toString(16);
    green = parseInt(green).toString(16);
    blue = parseInt(blue).toString(16);
    if (red.length < 2){ red = "0"+red; }
    if (green.length < 2){ green = "0"+green; }
    if (blue.length < 2){ blue = "0"+blue; }


    // set css
    var bg_color_css = "#"+red+green+blue;
    var border_color_css = "#"+border_red+border_green+border_blue;
    output_html.find("."+source_classes[i]+" .empty").css("height",empty_height);
    output_html.find("."+source_classes[i]+" .fill").css({ height: fill_height,
                                                           backgroundColor: bg_color_css,
                                                           borderColor: border_color_css });

  };



  output_html.hide();
  $(".outputs").prepend(output_html);
  output_html.slideDown(500);
  $("#search").val("").blur();

  // $(output_html).find(".movie_footer").click( function() {
  //   // $(this).parent().find(".source").slideToggle();
  //   $(this).parent().slideToggle();
  // });
}
