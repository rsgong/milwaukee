M.provide("", new function () {

  // Standard boilerplate for constructors
  var that = this;

  // -------------------------------------------- CORE LIBS

  /**
   * Create an array from the keys in an object.
   *
   * Example: keys({'x': 2, 'y': 3'}) returns ['x', 'y']
   *
   * @param obj {Object} Source object.
   * @param proto {Boolean} Specify true to include inherited properties.
   * @return {Array} The array of keys.
   * Source: connect-js
   */
  that.keys = function (obj, proto) {
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key) || proto) {
        arr.push(key);
      }
    }
    return arr;
  };

}());


