M.provide("", new function () {

  // Standard boilerplate for constructors
  var that = this;

  // -------------------------------------------- CORE LIBS

  /**
   * escapeRegExp will take a input string and properly escape any characters
   * that would otherwise be interpreted by the regular expression as special
   * symbols.
   *
   * This is needed when taking user input and stuffing it into a regular
   * expression
   *
   * see: http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
   *
   * @param str
   */
  that.escapeRegExp = function (str) {
    return str.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };


  /**
   * queryParams: will take a query string and convert it to a object for easy
   *              access.
   * @param queryString: window.location.search (queryParams w or w/o '?')
   * @param paramName: Name of the parameter you wish to parse
   */
  that.queryParams = function (queryString, paramName) {
    // Removes the leading question mark if present
    if (queryString[0] === '?') queryString = queryString.slice(1);

    // Tokenize on &
    var components = queryString.split("&"),
      paramObject = {};

    // Loop through tokens and split on '=' to populate response
    for (var index in components) {
      var component = components[index],
        parts = component.split("="),
        key = parts[0], value = parts[1];
      paramObject[key] = value;
    }

    return paramObject;
  }

}());



