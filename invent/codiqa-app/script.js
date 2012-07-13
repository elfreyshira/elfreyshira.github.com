jQuery.prototype.re = function() {
  this.trigger('create');
}

$(document).ready(function() {

  // Hide anything that should be hidden
  $("[data-hidden=true]").hide();

  // Code that reacts to any click that has a "data-activate" attribute
  $("[data-activate]").click( function() {
    var activated = $(this);
    var id_shown = activated.attr("data-activate");
    var activate_type = activated.attr("data-activate-type");
    var element_to_activate = $("#"+id_shown);
    switch(activate_type) {
      case "show":
        element_to_activate.slideDown("fast");
        break;
      case "hide":
        element_to_activate.slideUp("fast");
        break;
      case "add-question":
        var question_text = $("#new-question-textarea").val()
        var data = {snippet: question_text,
                        text: question_text};
        
        var html = Mustache.to_html(new_question_template, data);
        // alert(html);
        element_to_activate.append(html).re();

    }
  });

  // var add_question = function()

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

  // Clear values that should be cleared at the beginning
  $("[data-value-clear=true]").val("");


  var new_question_template = '<div data-role="collapsible" data-collapsed="false"><h3>{{snippet}}</h3><div><p>{{text}}</p>\
                          <div data-role="fieldcontain">\
                            <fieldset data-role="controlgroup" data-type="horizontal" data-mini="true">\
                                <input name="radiobuttons5" id="radio12" value="radio1" type="radio" />\
                                <label for="radio12">\
                                    1\
                                </label>\
                                <input name="radiobuttons5" id="radio13" value="radio13" type="radio" />\
                                <label for="radio13">\
                                    2\
                                </label>\
                                <input name="radiobuttons5" id="radio14" value="radio14" type="radio" />\
                                <label for="radio14">\
                                    3\
                                </label>\
                                <input name="radiobuttons5" id="radio15" value="radio15" type="radio" />\
                                <label for="radio15">\
                                    4\
                                </label>\
                                <input name="radiobuttons5" id="radio16" value="radio16" type="radio" />\
                                <label for="radio16">\
                                    5\
                                </label>\
                            </fieldset>\
                        </div></div></div>';
  // var question = 
  // var test = $('<div data-role="collapsible" data-collapsed="false"> \
  //                       <h3>\
  //                           HAHA\
  //                       </h3>\
  //                       <div>\
  //                           <p>\
  //                               Communication skills?\
  //                           </p>\
  //                       </div>\
  //                   </div>');

  // $("[data-role=collapsible-set]").append(test).trigger("create");

  // populate_css(jQuery);




});