M.provide("facebook", new function () {

  // Standard boilerplate for constructors
  var that = this;

  // -------------------------------------------- CORE LIBS

  /**
   * Returns the facebook url for the given facebook id. You may also
   * pass a size parameter.
   *
   * Sizes include: (From http://developers.facebook.com/docs/reference/api/)
   * square (50x50),
   * small (50 pixels wide, variable height),
   * normal (100 pixels wide, variable height),
   * and large (about 200 pixels wide, variable height):
   *
   * @param facebookId
   * @param size
   */
  that.profilePictureUrl = function (facebookId, size) {
    var url = "https://graph.facebook.com/" + facebookId + "/picture";
    if (size) {
      url += "?type=" + size;
    }
    return url;
  }


}());
