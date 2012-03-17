function findMovie() {
  // search for movies in IMDB, RottenTomaties, and Netflix
  // find the one that matches
  // find each of its ratings

  // these are just temporary variables to test development of javascript
  var imdb_rating = 8.3;
  var rt_rating = 90;
  var netflix_rating = 4.6;
  var filmcrave_rating = 4.5;

  

}

$(document).ready(function(){
  var container = $('#target');
  $('.ajaxtrigger').click(function(){
    doAjax($(this).attr('href'));
    return false;
  });
  function doAjax(url){
    if(url.match('^http')){

      $.getJSON("http://query.yahooapis.com/v1/public/yql?"+
                "q=select%20*%20from%20html%20where%20url%3D%22"+
                encodeURIComponent(url)+
                "%22&format=xml'&callback=?",
        function(data){

          if(data.results[0]){
            var data = filterData(data.results[0]);
            // var data_alert = data.results[0];
            // alert(data_alert);
            var j_data = $(data);
            alert(j_data);
            container.html();
          } else {
            var errormsg = '<p>Error: could not load the page.</p>';
            container.html(errormsg);
          }
        }
      );
    } else {
      $('#target').load(url);
    }
  }
  function filterData(data){
    data = data.replace(/<?\/body[^>]*>/g,'');
    data = data.replace(/[\r|\n]+/g,'');
    data = data.replace(/<--[\S\s]*?-->/g,'');
    data = data.replace(/<noscript[^>]*>[\S\s]*?<\/noscript>/g,'');
    data = data.replace(/<script[^>]*>[\S\s]*?<\/script>/g,'');
    data = data.replace(/<script.*\/>/,'');
    return data;
  }
});

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