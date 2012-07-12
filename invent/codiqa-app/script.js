$(document).ready(function() {

  // Hide anything that should be hidden
  $("[data-hidden=true]").hide();

  $("[data-activate]").click( function() {
    var id_shown = $(this).attr("data-activate");
    var activate_type = $(this).attr("data-activate-type");
    var element_to_show = $("#"+id_shown);
    switch(activate_type) {
      case "show":
        element_to_show.show();
        break;
      case "hide":
        element_to_show.hide();
        break;
    }
  });
});