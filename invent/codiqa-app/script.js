$(document).ready(function() {

  // Hide anything that should be hidden
  $("[data-hidden=true]").hide();

  // Code that reacts to any click that has a "data-activate" attribute
  $("[data-activate]").click( function() {
    var id_shown = $(this).attr("data-activate");
    var activate_type = $(this).attr("data-activate-type");
    var element_to_show = $("#"+id_shown);
    switch(activate_type) {
      case "show":
        element_to_show.slideDown("fast");
        break;
      case "hide":
        element_to_show.slideUp("fast");
        break;
    }
  });

  // Code that reacts to a submit on an input text
  $("[data-onsubmit]").click( function() {
    var input_element = $(this);
    input_element.blur();
    var text = input_element.val();
    var clone = input_element.clone();

    
    clone.val(text);
    clone.attr("readonly", "readonly");




    // clone.val(text);
    // clone.attr("readonly","readonly");
    input_element.val("");
    clone.insertBefore(input_element);
    return false;
  });

  $("[data-value-clear=true]").val("");


});