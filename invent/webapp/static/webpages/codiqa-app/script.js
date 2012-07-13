global = {};

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
        add_question(text, "new", "questions-list", i);
        break;
      case "save-questions":
        // alert(
        var questions_array=[];
        var questions = $("#questions-list li a").toArray();
        for (var i = 0; i < questions.length; i++) {
          questions_array.push(questions[i].innerHTML);
        };

        $.ajax({
          type: 'POST',
          url: "http://jwolfe.ausoff.indeed.net:3000/criterion/1",
          data: JSON.stringify(questions_array),
          success: null,
          dataType: "jsonp"
        });
        break;
      case "edit-question":
        var text = $("#edit-question-textarea").val();
        global['edit-question'].innerHTML = text;
        break;
      case "rate-student":
        var ratings_array = [];        
        var num_ratings = $("form [data-form=rate-students]").length;
        for (var i = 0; i < num_ratings; i++) {
          var question_text = $('[data-text='+i+']').html();
          var rating = $('input:radio[name=radiobuttons'+i+']:checked').val();
          ratings_array.push([question_text,rating]);
        };

        $.ajax({
          type: 'POST',
          url: "http://jwolfe.ausoff.indeed.net:3000/criterion/1",
          data: JSON.stringify(ratings_array),
          success: null,
          dataType: "jsonp"
        });
        break;

    }
  });

  $("[data-goedit]").click( function(e) {
    var text = e.target.innerHTML;
    $("#edit-question-textarea").val(text);
    global["edit-question"] = e.target;

    // alert($(extra_selectors, activated).html());


  });

  // Clear values that should be cleared at the beginning
  $("[data-value-clear=true]").val("");


});

$( document ).delegate("#questions", "pageinit", function() {
 populate_questions();
});


$( document ).delegate("#rate-students", "pageinit", function() {
 populate_questions_rate();
});

var new_question_template = '<li><a href="{{link}}" data-rel="dialog" data-transition="pop">{{text}}</a></li>';

var add_question = function(text, type, list_id, num) {
  var data = {link: "#edit-question",
            text: text,
            num: num};
  var template;
  if (type=="rate"){
    template = question_rate_template;
  } else {
    template = new_question_template;
  }
  console.log(template);
  console.log(data);
  var html = $(Mustache.to_html(template, data));
  console.log("#"+list_id);
  $("#"+list_id).append(html).listview('refresh').re();
}

// Populate questions-list
var populate_questions = function() {
  $.ajax({
    type: "GET",
    url: "http://jwolfe.ausoff.indeed.net:3000/criterion/1",
    dataType: "json",
    // data: JSON.stringify(questions_array),
    success: function(data) {
      console.log('success');
      for (var i = 0; i < data.length; i++) {
        add_question(data[i], "new", "questions-list", i);
      };
    },
    error: function(crap) {
      console.log(crap);
    },
    complete: function() {
      console.log('complete');
      add_question("Communication skills?","new","questions-list", 0);
      add_question("Comprehension of topic?","new","questions-list", 1);
      // alert();
    }
  });
}


var populate_questions_rate = function() {
  $.ajax({
    type: "GET",
    url: "http://jwolfe.ausoff.indeed.net:3000/criterion/1",
    dataType: "json",
    // data: JSON.stringify(questions_array),
    success: function(data) {
      for (var i = 0; i < data.length; i++) {
        add_question(data[i], "rate", "questions-rate-list", i);
      };
    },
    error: function(crap) {
      console.log("fail");
    },
    complete: function() {
      console.log("complete");
      add_question("Communication skills?","rate","questions-rate-list", 0);
      add_question("Comprehension of topic?","rate","questions-rate-list", 1);
    }
  });
}

var question_rate_template = '<li><p data-text="{{num}}">{{text}}</p><div data-role="fieldcontain">   <fieldset data-role="controlgroup" data-type="horizontal" \
  data-mini="true" data-form="rate-students">    <legend>    </legend>    <input name="radiobuttons{{num}}" id="radio1" value="1" type="radio">   \
  <label for="radio1">    1    </label>    <input name="radiobuttons{{num}}" id="radio2" value="2" type="radio">    \
  <label for="radio2">    2    </label>    <input name="radiobuttons{{num}}" id="radio3" value="3" type="radio">   \
  <label for="radio3">    3    </label>    <input name="radiobuttons{{num}}" id="radio4" value="4" type="radio">   \
  <label for="radio4">    4    </label>    <input name="radiobuttons{{num}}" id="radio5" value="5" type="radio">   \
  <label for="radio5">    5    </label>   </fieldset>   </div></li>'

// populate_questions();
