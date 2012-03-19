// http://api.themoviedb.org/2.1/
// http://www.deanclatworthy.com/imdb/
have_searched = false;

$(document).ready(function() {
  $("#search").attr("onblur","check_empty_blur()");
  $("#search").attr("onfocus","check_empty_focus()");
  check_empty_blur();
});

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
  return str.replace(/\W|_/g,"+").replace(/\++/g,"+");
}

function find_movie() {
  // fill_output("Inception", ["imdb","rtc","rta"], ["IMDB","Critics","Audience"], ["9.4","50","98 "], ["/ 10","%","%"]);
  // return;


  have_searched = true;
  var title_search = $("#search").val();
  var title_url = make_url_able(title_search);

  var movie_title = false;
  var display_title = false;
  var source_classes = [];
  var source_names = [];
  var scores = [];
  var out_of = [];
  var year = false;
  var count = 0;
  var page_limit = "10"; // page limit for rotten tomatoes api





  // IMDB, class="imdb", out_of="/ 10", score="8.4"
  $.ajax({
    url: "http://www.imdbapi.com/?t="+title_url,
    dataType: 'jsonp',
    timeout: 10000,
    success: function(data){
      if (data.Title) {
        year = data.Year;
        movie_title = data.Title
        display_title = movie_title + " <span class='dem'>(" + year + ")</span>";
        source_classes[count] = "imdb";
        source_names[count] = "IMDB";
        scores[count] = data.Rating;
        out_of[count] = "/ 10";
        count += 1;
      }
    },
    error: function(crap){
      // alert("RT fail");
    },
    complete: function() {
      $.ajax({
        url: "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=f278acux2dr8vmmueege9bfv&page_limit="+
                                                                                      page_limit+"&q="+title_url,
        dataType: 'jsonp',
        timeout: 10000,
        success: function(data){
          if (data.total > 0) { //only analyze if there's some returned data
            var limit = Math.min(data.total, page_limit);
            for (i = 0; i < limit; i++) {
              // check to see if the searched title matches the exact json title
              if (data.movies[i].title == movie_title && data.movies[i].year == year) {
                break;
              }
            };
            if (i >= limit) {
              i = 0;
            }

            var movie_data = data.movies[i];
            if (!movie_title) {
              movie_title = movie_data.title;
              display_title = movie_title + " <span class='dem'>(" + year + ")</span>";
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
          // alert("IMDB fail");
        },
        complete: function() {
          fill_output(display_title, source_classes, source_names, scores, out_of);
        }

      });
    }
  });

}

function fill_output(display_title, source_classes, source_names, scores, out_of) {

  if (!display_title) {
    alert("your internet is probably down");
    return;
  }
  var percentages = []; //array of floats

  // filling in the html//////////////////////
  var source_entry = '<span></span> \n\
      <div class="SOURCE_CLASS source"> \n\
        <div class="empty"></div> \n\
        <p> SOURCE_NAME </p> \n\
        <div class="fill"></div> \n\
        <div class="score"> \n\
          <span class="num">SCORE</span> \n\
          <span class="dem">OUT_OF</span> \n\
        </div> \n\
      </div> ';
  var final_output = '<div class="entry_output">';
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
  final_output += ' \n\
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
}

// $(document).ready(function(){
//   var container = $('#target');
//   $('.ajaxtrigger').click(function(){
//     doAjax($(this).attr('href'));
//     return false;
//   });
//   function doAjax(url){
//     if(url.match('^http')){

//       $.getJSON("http://query.yahooapis.com/v1/public/yql?"+
//                 "q=select%20*%20from%20html%20where%20url%3D%22"+
//                 encodeURIComponent(url)+
//                 "%22&format=xml'&callback=?",
//         function(data){

//           if(data.results[0]){
//             var data = filterData(data.results[0]);
//             // var data_alert = data.results[0];
//             // alert(data_alert);
//             var j_data = $(data);
//             alert(j_data);
//             container.html();
//           } else {
//             var errormsg = '<p>Error: could not load the page.</p>';
//             container.html(errormsg);
//           }
//         }
//       );
//     } else {
//       $('#target').load(url);
//     }
//   }
//   function filterData(data){
//     data = data.replace(/<?\/body[^>]*>/g,'');
//     data = data.replace(/[\r|\n]+/g,'');
//     data = data.replace(/<--[\S\s]*?-->/g,'');
//     data = data.replace(/<noscript[^>]*>[\S\s]*?<\/noscript>/g,'');
//     data = data.replace(/<script[^>]*>[\S\s]*?<\/script>/g,'');
//     data = data.replace(/<script.*\/>/,'');
//     return data;
//   }
// });

  //     $.ajax({
  //       url: "http://www.imdbapi.com/?i=&t=inception",
  //       dataType: 'jsonp',
  //       success: function(data){
  //         var t = data.Title;
  //         alert("first: "+t);
  //       }
  //     });
  //     $.ajax({
  //       url:"http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=f278acux2dr8vmmueege9bfv&q=inception",
  //       dataType: 'jsonp',
  //       success: function(data){
  //         var t = data.movies[0].title;
  //         alert("second: "+t);
  //       }
  //     });