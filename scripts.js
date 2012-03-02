$(document).ready(function() {

  $("a").attr("target", "_blank");

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
