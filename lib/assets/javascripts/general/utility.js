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


}());



