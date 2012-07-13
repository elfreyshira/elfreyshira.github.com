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
    }
  });

  $("[data-onsubmit]").click( function() {
    var activated = $(this);
    var action = activated.attr("data-onsubmit");
    switch(action) {
      case "add-question":
        var text = $("#new-question-textarea").val();
        var data = {link: "#",
                    text: text};
        var html = $(Mustache.to_html(new_question_template, data));

        $("#questions-list").append(html).listview('refresh');
        break;
      case "save-questions":
        // alert(
        var questions_array=[]
        var questions = $("#questions-list li a").toArray();
        for (var i = questions.length - 1; i >= 0; i--) {
          questions_array.push(questions[i].innerHTML);
        };

        $.ajax({
          type: 'POST',
          url: "localhost:8000",
          data: array,
          success: null,
          dataType: "jsonp"
        });
        break;
    }
  });

  // var add_question = function()

  // Code that reacts to a submit on an input text
  // $("[data-onsubmit]").click( function() {
  //   var input_element = $(this);
  //   input_element.blur();
  //   var text = input_element.val();
  //   var clone = input_element.clone();

    
  //   clone.val(text);
  //   clone.attr("readonly", "readonly");




  //   // clone.val(text);
  //   // clone.attr("readonly","readonly");
  //   input_element.val("");
  //   clone.insertBefore(input_element);
  //   return false;
  // });

  // Clear values that should be cleared at the beginning
  $("[data-value-clear=true]").val("");


  var new_question_template = '<li><a href="{{link}}">{{text}}</a></li>';
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