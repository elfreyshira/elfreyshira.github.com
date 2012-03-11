function changeStats(){
  var str = $("#input_text").val();

  
  var str_split = str.split(" ",2);
  if (str_split.length != 2){
    return false
  }
  var name = str_split[0].toLowerCase();
  var action   = str_split[1].toLowerCase();

  var arr = [0,0,0,0,0,0,0,0,0,0,0];
  if      (action[0]=="m"){ arr[2] += 1; }    // miss
  else if (action[0]=="b"){ arr[7] += 1; }    // block
  else if (action[0]=="t"){ arr[9] += 1; }    // turnover
  else if (action[0]=="r"){ arr[6] += 1; }    // rebound
  else if (action[0]=="s"){ arr[8] += 1; }    // steal
  else if (action[0]=="a"){ arr[5] += 1; }    // assists
  else if (action=="foul"){ arr[10] += 1; }//fouls

  else if (action == "2" || action == "3"){
    arr[0] += parseInt(action);
    arr[1] += 1;
    arr[2] += 1;
  }
  else if (action == "ft"){
    arr[0] += 1;
    arr[3] += 1;
    arr[4] += 1;
  }
  else if (action == "ftmiss"){
    arr[4] += 1;
  }
  else {
    // if it's an incorrect input, then put the name back, but don't select it. it's assuming it got the thing wrong
    $("#input_text").val(name+" ");
    return false;
  }

  // put the name back into the input text so that it's easy to go to the next action if it's the same person
  $("#input_text").val(name+" ").select();

  // updates the latest action
  $("#latest").animate({opacity: 0.0}, "fast",
    function() {
      $(this).html(name+" "+action).animate({opacity: 1.0}, "fast");
    });
  // update history
  $("#history_list").prepend("<li>"+str+"</li>");


  var rows = ["name","points","shots_made","shots_attempted","ft_made","ft_attempted","assists","rebounds",
              "blocks","steals","turnovers", "fouls"];

  var row = $("#"+name);
  if (row.html() == null){
    // $("#stats_table").append("<p> Hello World! </p>");
    var new_row = "<tr id='"+name+"'> <td class='"+rows[0]+"'>"+name+"</td>";
    for (var i = 1; i < rows.length; i++) {
      new_row += "\n <td class='"+rows[i]+"'>"+arr[i-1]+"</td>";
    };
    new_row += "\n </tr>";
    $("#stats_table").append(new_row);
  }
  else {
    for (var i = 1; i < rows.length; i++) {
      var selection = "#"+name+" ."+rows[i]
      var previous = $(selection).html();
      $(selection).html(String(parseInt(previous)+arr[i-1]));
    };
  }

}