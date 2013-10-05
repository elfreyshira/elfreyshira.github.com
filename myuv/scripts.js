
///////////////////////////
String.prototype.strip_html = function() {
  return this.replace(/<(?:.|\n)*?>/gm, '');
}
///////////////////////

// http://www.deanclatworthy.com/imdb/
have_searched = false;
rt_id = false;
autocomplete_title = false;

imdb_id = false;
movie_title = false;
display_title = false;
year = false;



$(document).ready(function() {

  // Making sure the favorites are set
  if (!localStorage.myuv_favorites) {
    localStorage.myuv_favorites = "[]";
  }
  
  //filling up the favorites
  $(".favorites").html(JSON.parse(localStorage.myuv_favorites).join("<br>"));

  $(".cover, .loader").hide();
  $("#search").attr("placeholder","movie name -> press enter");

  // setting the movie input text
  // $("#search").attr("onblur","check_empty_blur()");
  // $("#search").attr("onfocus","check_empty_focus()");
  // check_empty_blur();

  $("#about").hide();

  // return;

  $( "#search" ).autocomplete({
    source: function( request, response ) {
      $.ajax({
        url: "http://api.rottentomatoes.com/api/public/v1.0/movies.json",
        dataType: "jsonp",
        data: {
          apikey: "f278acux2dr8vmmueege9bfv",
          page_limit: 5,
          page: 1,
          q: request.term
        },
        success: function( data ) {
          response( $.map( data.movies, function( item ) {
            // return item.title
            if (item.alternate_ids) {
              if (item.alternate_ids.imdb) {
                imdb_id = "tt"+item.alternate_ids.imdb;
              }
            }

            return {
              label: item.title+" ("+String(item.year)+")",
              value: item.title,
              imdb: imdb_id,
              rtid: item.id,
              year: String(item.year)
            }
          }));

        },
        error: function(data) {
          $("#search").autocomplete("disable").delay(5000).autocomplete("enable");
        }
      });
    },
    delay: 10,
    minLength: 1,
    position: {
      my: "top",
      at: "center bottom"
    },
    focus: function(event, ui) {
      $("#search").val(ui.item.value);
    },
    select: function(event, ui){
      imdb_id = ui.item.imdb;
      autocomplete_title = ui.item.value;
      rt_id = ui.item.rtid;

      movie_title = ui.item.value;
      year = ui.item.year;
      display_title = movie_title + " <span class='dem'>(" + year + ")</span>";
      
      // alert(imdb_id+" :: "+autocomplete_title+" :: "+rt_id)

      find_movie();
    }
    // select: function( event, ui ) {
    //   log( ui.item ?
    //     "Selected: " + ui.item.label :
    //     "Nothing selected, input was " + this.value);
    // },
    // open: function() {
    //   $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    // },
    // close: function() {
    //   $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    // }
  });

  check_and_search();



  

});


function show_about(){
  $("#about").slideToggle(500);
  // $(".source").slideToggle();
}


function make_url_able(str) {
  // return str.replace(/\W|_/g,"+").replace(/\++/g,"+");
  return str.replace(/_/g,"+").replace(/'\w{1}\b/g,"").replace(/[-·]/g,"_").replace(/\W+/g,"+").replace(/_/g,"-");
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

function check_and_search() {
  var id = get_url_val("id");
  if (id) {
    imdb_id = id;
    loading_movie_effect();
    query_now();
    return;
  }
  var search = get_url_val("q");
  if (search) {
    title_url = search;
    loading_movie_effect();
    query_now();
    return;
  }

}

function get_url_val( key ) {
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var expr = "[\\?&]"+key+"=([^&#]*)";
  var regex = new RegExp( expr );
  var results = regex.exec( window.location.hash );
  if( results !== null ) {
    return decodeURIComponent(results[1].replace(/\+/g, " "));
  } else {
    return false;
  }
}

function set_url_val(key, value)
{
    window.location.hash = "#s?"+key+"="+value; 
}

function loading_movie_effect() {
  $("#search").autocomplete("disable").autocomplete("close");

  $(".cover").show().animate({opacity: 0.5},200);
  $(".loader").show().animate({opacity: 1.0},200);

  $("#search").attr("placeholder","another movie -> press enter");

}

function find_movie() {
  loading_movie_effect();

  title_search = $("#search").val();
  $("#search").blur();
  title_url = make_url_able(title_search);
  if (autocomplete_title != title_url) {
    imdb_id = false;
    rt_id = false;
  }

  query_now();
}

function query_now() {
  
  source_classes = [];
  source_names = [];
  scores = [];
  out_of = [];
  count = 0;
  page_limit = "10"; // page limit for rotten tomatoes api

  ajax_count = 0;
  total = 3; // *** total number of sites it looks for ****

  if (imdb_id) {
    set_url_val("id",imdb_id);
  } else {
    set_url_val("q",title_url);
  }

  // fill_output("Inception (2010)", ["imdb","rt"], ["IMDB","Rotten Tomatoes"], ["9","60"], ["/ 10","%"]);
  // return;
  do_imdb();
  // do_rt();
  // do_tmdb();
}


imdb_fail = false;
function do_imdb() {
  var search_url = "http://www.imdbapi.com/?";
  if (imdb_id) {
    search_url += "i="+imdb_id;
  }
  else {
    search_url += "t="+title_url;
  }

  $.ajax({
    url: search_url,
    dataType: 'jsonp',
    timeout: 10000,
    success: function(data){
      if (data.Response == "True") {
        if (!year || !movie_title) {
          year = data.Year;
          movie_title = data.Title;
          display_title = movie_title + " <span class='dem'>(" + year + ")</span>";
        }
        imdb_id = data.imdbID;
        if (data.imdbRating != "N/A") {
          source_classes[count] = "imdb";
          source_names[count] = "IMDB";
          scores[count] = data.imdbRating;
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
  if (rt_id){
    search_url = "http://api.rottentomatoes.com/api/public/v1.0/movies/"+rt_id+".json?apikey=f278acux2dr8vmmueege9bfv";
  }
  else if (movie_title) {
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

      if (rt_id || data.total > 0) { //only analyze if there's some returned data

        if (!rt_id) { // check if it's loading a lot of movies or a specific movies
          var limit = Math.min(data.total, page_limit); //make sure the page_limit variable is set
          if (movie_title) { match_query = movie_title; }
          else { match_query = title_search; }

          var max_rate = 0;
          var max_rate_index = 0;
          for (i = 0; i < limit; i++) {

            // if the RT imdb_id matches the previous imdb_id
            var imdb_id_check = false;
            if (data.movies[i].alternate_ids) {
              if (data.movies[i].alternate_ids.imdb) {
                imdb_id_check = "tt"+data.movies[i].alternate_ids.imdb;
              }
            }
            if (imdb_id && imdb_id == imdb_id_check) {
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
        }
        else { movie_data = data; }

        // analyze the data

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
        if (movie_data.ratings.audience_score > 0){
        source_classes[count] = "rta";
        source_names[count] = "Rotten Tomatoes: Audience";
        scores[count] = movie_data.ratings.audience_score;
        out_of[count] = "%";
        count += 1;
        }
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
    search_url = "http://api.themoviedb.org/3/movie/" + imdb_id + "?api_key=bb0d9620f620e8097998203a8af18aec"
  }
  else {
    search_url = "http://api.themoviedb.org/3/search/movie?api_key=bb0d9620f620e8097998203a8af18aec&query=" + title_url
    if (year) {
      search_url = search_url + "&year=" + year;
    }
  }
  $.ajax({
    // type: "GET",
    url: search_url,
    dataType: 'jsonp',
    timeout: 5000,
    success: function(data){

      var vote_average;
      if (data.results && data.results.length > 0) {
        vote_average = data.results[0].vote_average
      }
      else if (data.vote_average) {
        vote_average = data.vote_average;
      }
      else {
        return;
      }

      source_classes[count] = "tmdb";
      source_names[count] = "The Movie DB";
      scores[count] = vote_average;
      out_of[count] = "/ 10";
      count += 1;
      // if (data.length > 0 && data[0].rating){
      //   if (!year || !movie_title) {
      //     year = data[0].released.split("-")[0];
      //     movie_title = data[0].name;
      //     display_title = movie_title + " <span class='dem'>(" + year + ")</span>";
      //   }
        // source_classes[count] = "tmdb";
        // source_names[count] = "The Movie DB";
        // scores[count] = data[0].rating;
        // out_of[count] = "/ 10";
        // count += 1;
      // }


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

function reset() {
  have_searched = false;
  rt_id = false;
  autocomplete_title = false;

  imdb_id = false;
  movie_title = false;
  display_title = false;
  year = false;
}


function fill_output(display_title, source_classes, source_names, scores, out_of) {

  reset();

  $("#search").autocomplete("enable");

  $(".cover, .loader").animate({opacity: 0.0},200,function() {
    $(this).hide();
  });

  if (!display_title) {
    alert("Either your internet isn't working or the movie you're searching for is too hipster for the mainstream databases.");
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
  console.log(typeof display_title)
  console.log(display_title);
  final_output += ' </div>\n\
    <div class="movie_footer"> <p>' + display_title
    + '</p> <span class="fav-button" data-movie="'
    + display_title.strip_html()
    + '"></span></div></div>';
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


  var favs_str = localStorage.myuv_favorites;
  var favs_arr = JSON.parse(favs_str);

  //check to see if the title is already a favorite
  if (favs_arr.indexOf(display_title.strip_html()) >= 0) {
    output_html.find(".fav-button").removeClass("fav-button").addClass("fav-button-clicked");
  }

  //setting the favorite button listener
  output_html.find(".fav-button").click(function() {
    var clicked_title = $(this).attr("data-movie");
    if (favs_arr.indexOf(clicked_title) < 0) {
      favs_arr.push(clicked_title);
    }
    localStorage.myuv_favorites = JSON.stringify(favs_arr);

    $(this).removeClass("fav-button").addClass("fav-button-clicked");

  });


  output_html.hide();
  $(".outputs").prepend(output_html);
  output_html.slideDown(500);
  $("#search").val("").blur();

  // $(output_html).find(".movie_footer").click( function() {
  //   // $(this).parent().find(".source").slideToggle();
  //   $(this).parent().slideToggle();
  // });
}

