$(document).ready(function() {

  /**
   * Reads the value of the input text, normalizes it, and adds it to the table.
   *
   * @return {Boolean}
   */
  var display_normalize = function() {

    var unnormalized = $("#input-text").val();    // The original input path.
    if (unnormalized) {                           // Only normalize it if it's a non-blank input.
      $("#input-text").val("");                   // Reset the input text.
      var normalized = normalize(unnormalized);   // Run the path string through the main normalize function.

      // Add the original path and the normalized path to the table.
      $("#normalize-table").append("<tr><td>"+unnormalized+"</td><td>"+normalized+"</td></tr>");
    }
    return false;
  };

  /**
   * Takes in a file path as a string and normalizes it.
   * ex:   foo/./bar       --> foo/bar
   *       foo/bar/../baz  --> foo/baz
   *
   * @param {String} str
   * @return {String}
   */
  var normalize = function(str) {
    
    var file_array = str.split(/\/+/);  // Using regex, split the path by slashes of one or more.
    var new_file_array = [];            // An array to hold the normalized file path locations.
    var num_go_back = 0;                // To keep the number of double dots in track.

    // Iterate backwards from the final path location to the first.
    for (var idx = file_array.length - 1; idx >= 0; idx--) {
      var location = file_array[idx];
      if (location == "..") {
        // If it's a double dot, then it has to go back up one directory.
        num_go_back += 1;
      }
      else if (location != ".") {
        if (num_go_back > 0) {
          // If there are double dots in front of the current location, then bypass it.
          num_go_back -= 1;
        }
        else {
          // If there are no double dots in ahead of the current
          // location and it's not a single dot, it's part of the final path.
          new_file_array.push(location);
        }
      }
    };

    // The array is reversed because the path location was inserted in reverse.
    return new_file_array.reverse().join("/");
  };

  // When the form is submitted, "display_normalize" is run.
  $("#input-form").submit(display_normalize);

});