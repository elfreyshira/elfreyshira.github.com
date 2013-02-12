history_count = 0;
player_times = {};
last_players_on_court = [];
/*
  {elfrey: {last: 35643536,
            total: 9000,
            },
   henry:  {last: 0,
            total: 154}
  }
*/

function addStats() {
  var str = $("#input_text").val();
  changeStats(str, "add");
}

function deleteStats(str, id_count) {
  var deleted = $("#"+id_count);
  deleted.animate({opacity:0.0},"fast",
    function() {
      $(this).remove();
    });
  changeStats(str, "delete");
}

function changeStats(str, change){

  // set the multiplier (m) depending on whether it's adding or deleting an action
  var m  = (change=="add") ? 1 : -1;
  var action, name;

  if (str.split(" ")[0].toLowerCase() == "start") {
    var players_starting = str.split(" ");
    if (players_starting.length > 1) {
      for (var i = 1; i < players_starting.length; i++) {
        changeStats( players_starting[i]+" in", "add");
      };
    }
    else {
      for (var i = 0; i < last_players_on_court.length; i++) {
        changeStats( last_players_on_court[i]+" in", "add");
      };
    }
    // for (name in player_times) {
    //   var player = player_times[name];
    //   if (player.last == 0) {
    //     player.last = Date.now();
    //   }
    // }
    // $("#history_list").prepend("<li> game on </li>");
    $("#input_text").val("");
    return false;
    // return false;
  }
  else if (str.toLowerCase() == "stop") {
    last_players_on_court = [];
    for (name in player_times) {
      var player = player_times[name];
      if (player.last != 0) {
        player.total += Date.now() - player.last;
        player.last = 0;
        last_players_on_court.push(name);
      }
    }
    $("#history_list").prepend("<li> game off </li>");
    $("#input_text").val("");
    return false;
  }
  else {
    var str_split = str.split(" ",2);
    if (str_split.length != 2){
      $("#input_text").val(str).select();
      return false
    }
    name = str_split[0].toLowerCase();
    action   = str_split[1].toLowerCase();
  }

  var arr = [0,0,0,0,0,0,0,0,0,0,0,0];
  if      (action[0]=="m"){ arr[2] += m; action = "missed a shot";}    // miss
  else if (action[0]=="b"){ arr[8] += m; action = "blocked a shot";}    // block
  else if (action[0]=="t"){ arr[10] += m; action = "turned it over";}    // turnover
  else if (action[0]=="o"){ arr[6] += m; action = "rebounded on offense";}    // rebound
  else if (action[0]=="d"){ arr[7] += m; action = "rebounded on defense";}    // rebound
  else if (action[0]=="s"){ arr[9] += m; action = "got a steal";}    // steal
  else if (action[0]=="a"){ arr[5] += m; action = "got an assist";}    // assists
  else if (action=="foul"){ arr[11] += m; action = "fouled"; }//fouls

  else if (action == "2" || action == "3"){
    arr[0] += m*parseInt(action);
    arr[1] += m*1;
    arr[2] += m*1;
    action = "made a "+action;
  }
  else if (action == "ft"){
    arr[0] += m;
    arr[3] += m;
    arr[4] += m;
    action = "made a free throw"
  }
  else if (action == "ftmiss"){
    arr[4] += m;
    action = "missed a free throw"
  }
  else if (action == "in"){
    var player = player_times[name];
    if (player){ //if the player is already in the game
      if (player.last == 0){ //he was out
        player.last = Date.now();
      }
    }
    else { //this is the first time the player is in the game
      player_times[name] = {
        last: Date.now(),
        total: 0
      };
    }
    action = "is in"
  }
  else if (action == "out"){
    var player = player_times[name];
    if (player) {
      if (player.last != 0) {
        player.total += Date.now() - player.last;
        player.last = 0;
      }
    }
    action = "is out"
  }
  else if (change == "add"){
    // if it's an incorrect input, then put the name back, but don't select it. it's assuming it got the thing wrong
    $("#input_text").val(name+" ").select();
    return false;
  }



  if (change=="delete") {
    $("#input_text").val(str).select();
  }

  else if (change=="add") {
    // put the name back into the input text so that it's easy to go to the next action if it's the same person
    $("#input_text").val(name+" ").select();

    // update history
    var onclick_str = "onClick = \"deleteStats('"+str+"'"+", "+history_count+"); return false;\"";
    $("#history_list").prepend(
      "<li id='"+history_count+"'>"+((action != "is in" && action != "is out") ? ("<a href='' "+onclick_str+" title='delete action'><img src='delete.png'/></a>"):"")+
      name+" "+action+"</li>");
    $("#"+history_count).hide().fadeIn();
    history_count += 1;
  }


  // update the stat table
  var rows = ["name","points","shots_made","shots_attempted","ft_made","ft_attempted","assists","rebounds-offese",
              "rebounds-defense","blocks","steals","turnovers", "fouls"];

  var row = $("#"+name);
  if (row.html() == null){
    // $("#stats_table").append("<p> Hello Worlds! </p>");
    var new_row = "<tr id='"+name+"'> <td class='"+rows[0]+"'>"+name+"</td>";
    for (var i = 1; i < rows.length; i++) {
      new_row += "\n <td class='"+rows[i]+"'>"+arr[i-1]+"</td>";
    };
    new_row += "\n </tr>";
    $("#stats_table").append(new_row);
    $("#"+name).hide().fadeIn();
  }
  else {
    var zero_check = 0; //to check to see if deleting a stat will put a player at all 0. in that case, delete the row.
    for (var i = 1; i < rows.length; i++) {
      var selection = "#"+name+" ."+rows[i]
      var previous = $(selection).html();
      var new_value = parseInt(previous)+arr[i-1]
      zero_check += new_value;
      $(selection).html(String(new_value));
    };
    if (zero_check == 0 && change == "delete"){
      row.animate({opacity: 0.0},"fast",
        function() {
          $(this).remove();
        }
      );
    }
  }
}

function analyze() {
  
}

