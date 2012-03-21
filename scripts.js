$(document).ready(function() {


  // load all content images on page load so that the image doesn't have to load when hovering over links
  $(".content a").each(function(){
    var link_text = $(this).text().replace(/\W|_/g,"");
    $("body").append("<img src='images/"+link_text+".png' class='hidden' />");
  });

  // make all links open in a new tab
  $("a").attr("target", "_blank");

  // alert($(".content.social h2").height());

  // helper function where given a content class, find the other two classes
  var get_first_and_second = function(this_content) {
    var all_contents = ["social","professional","personal"];
    var indexes;
    if (this_content == "social") { indexes =[1,2]; }
    else if (this_content == "professional") { indexes =[0,2]; }
    else if (this_content == "personal") { indexes =[0,1]; }
    var first = ".bg_img."+all_contents[indexes[0]];
    var second = ".bg_img."+all_contents[indexes[1]];
    return [first, second];
  }

  // when you hover over a content link in a box, images pop up in the other two boxes
  $(".content a").hover(
    function() {
      var link_text = $(this).text().replace(/\W|_/g,"");
      var this_content = $(this).closest(".content").attr("class").split(" ")[1];

      var first_and_second = get_first_and_second(this_content);
      var first = first_and_second[0];
      var second = first_and_second[1];

      $(first).css({
        backgroundPosition: "0px"
      })
      $(second).css({
        backgroundPosition: "-212px"
      });
      $(first+", "+second).stop().css({backgroundImage:"url('images/"+link_text+".png')"
        }).animate({opacity:1.0},150);
    },
    function() {
      var link_text = $(this).text().split(" ").join("");
      var this_content = $(this).closest(".content").attr("class").split(" ")[1];

      var first_and_second = get_first_and_second(this_content);
      var first = first_and_second[0];
      var second = first_and_second[1];

      $(first+", "+second).stop().animate({opacity:0.0}, 150, 
        function() { $(this).css({backgroundImage:"none"}); }
      );
    });

  // when you hover over a content box, it's opacity increases
  $(".content").hover(
    function() {
      var col = $(this).attr("class").split(" ")[1];
      var change_class = ".bg."+col;
      $(change_class).stop().animate({opacity:0.8}, 150);
    },
    function() {
      var col = $(this).attr("class").split(" ")[1];
      var change_class = ".bg."+col;
      $(change_class).stop().animate({opacity:0.4}, 150);
    });
});
