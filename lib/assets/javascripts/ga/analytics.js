/* The goal of this file is to become opinionated on how to do google event
 * tracking for registration flows, social tracking etc.
 *
 * Rational:
 *   Lots of time is spent wasted tracking things that don't matter or making
 *   mistakes with the tracker code (mistyping categories or actions) causing
 *   a mess in our reports. Instead we say no and provide 'what you need'
 *   removing wasted times and errors.
 */
M.provide("ga", new function () {

  // Standard boilerplate for constructors
  var that = this;

  // -------------------------------------------- CORE LIBS

  // -------------------------------------------- LIBRARY REQUIREMENTS
  if (!jQuery) throw "Jquery.js not installed. Required for M.ga";
  if (!$.cookie) return l("jquery cookie not installed. Required for M.ga");

  // -------------------------------------------- REGISTRATION TRACKING

  /* Registration Tracking:
   * The goal of registration tracking is correctly count the number
   * of authDialogs seen and users thus installed. To do so we store a cookie
   * that ensures the google tracking calls are only called once per user
   * per appId. 
   *
   * Registration tracking events are set to non_interaction mode meaning
   * that they will not effect bounce rates that GA calculates.
   */


  /* Note: Don't add a landing tracking event. Its data you can get from the
   *       campaign tracking data and isn't important for registration
   *       comparison. You will want to compare cardinality and percentage
   *       of auth dialogs seen and users installed not how many landed.
   *       **This holds even if you have a landing page before auth dialog**
   */

  var REGISTRATION_CATEGORY = "Registration",
    AUTH_DIALOG_ACTION = "Saw Authentication Dialog",
    INSTALLED_ACTION = "Installed Application";

  /**
   * trackAuthDialog: tracks when a user is taken to auth the app
   *
   * Note:
   *  It is highly recommended to have a 100ms timeout wrapper on the callback
   *  if you are redirecting in it. This will allow the tracking code to complete
   *  more often. see:
   *
   *  http://support.google.com/googleanalytics/bin/answer.py?hl=en&answer=55527
   *
   * @param appId : Allows us to track auths and installes across different apps
   * @param scope
   * @param cb
   */
  that.trackAuthDialog = function (appId, scope, cb) {
    var authCookieName = "M.ga.trackAuthDialog_" + appId,
      tracking = !($.cookie(authCookieName) === "t");

    if (tracking) {
      $.cookie(authCookieName, "t", {path:'/'});

      var scopeString = sanitizeScope(scope);
      track(REGISTRATION_CATEGORY, AUTH_DIALOG_ACTION, scopeString, null, true);
    }

    cb(tracking);
  };

  // Tracks when a user installs the app
  that.trackInstalled = function (appId, scope, cb) {
    var installedCookieName = "M.ga.trackInstalled_" + appId,
      tracking = !($.cookie(installedCookieName) === "t");

    if (tracking) {
      $.cookie(installedCookieName, "t", {path:'/'});

      var scopeString = sanitizeScope(scope);
      track(REGISTRATION_CATEGORY, INSTALLED_ACTION, scopeString, null, true);
    }

    cb(tracking);
  };


  /**
   * Helps keep analytics clean by sanitizing each scope name and sorting the
   * scope for easier comparison later
   * @param scopeArray
   */
  function sanitizeScope(scopeArray) {
    // Convert the standard csv list into a array if necessary
    if (typeof scopeArray === "string") scopeArray = scopeArray.split(",");

    var cleanScopeArray = [];
    $.each(scopeArray, function (index, rawScopeString) {
      cleanScopeArray.push($.trim(rawScopeString).toLowerCase());
    });

    cleanScopeArray.sort();

    return cleanScopeArray.join(",");
  }

  // -------------------------------------------- CHANNEL TRACKING

  /* Channel Tracking:
   * The goal of channel tracking is to track a growing list of channels that
   * users can affect others on. Standardized names are very useful for goal
   * tracking in GA.
   *
   * Channel tracking events are interactive and will effect bounce rates.
   */

  var CHANNEL_CATEGORY = "Channel",
    APP_REQUEST_ACTION = "App Requests Sent",
    WALL_POST_ACTION = "Wall Post Published";

  // Tracks when a user sends app requests and the number sent
  that.trackAppRequest = function (count) {
    count = count || 1; //Default to 1 request sent
    track(CHANNEL_CATEGORY, APP_REQUEST_ACTION, null, count);
  };


  // Tracks when a user sends a wall post
  that.trackWallPost = function () {
    track(CHANNEL_CATEGORY, WALL_POST_ACTION);
  };


  function track(category, action, optLabel, optValue, optNonInteraction) {
    window._gaq.push(['_trackEvent', category, action, optLabel, optValue, optNonInteraction]);
  }


}());



