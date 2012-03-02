$(document).ready(function() {

  $("a").attr("target", "_blank");

  $(".content").hover(
    function() {
      var col = $(this).attr("class").split(" ")[1];
      var change_class = ".bg."+col;
      $(change_class).css("opacity","0.8");
    },
    function() {
      var col = $(this).attr("class").split(" ")[1];
      var change_class = ".bg."+col;
      $(change_class).css("opacity","0.4");
    });
});
