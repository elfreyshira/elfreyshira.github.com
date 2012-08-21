data = {
  tabs: ["Home", "About", "Events", "Candidates", "Officers"]
}
var hi = $.get("header.html", function(obj) {
  console.log(obj);
  console.log(typeof obj);  
  // text = obj.responseText;
  // console.log(responseText);
  $("header").html(Mustache.to_html(obj,data));
});