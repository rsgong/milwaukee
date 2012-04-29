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

  var gaq = window._gaq;


  // If for some reason the google analytics object is not at window._gaq
  that.setGAQ = function (newGaq) {
    gaq = newGaq;
  };

  // -------------------------------------------- REGISTRATION TRACKING

  /* Registration Tracking:
   * The goal of registration tracking is correctly count the number
   * of authDialogs seen and users thus installed. To do so we store a cookie
   * that ensures the google tracking calls are only called once per user
   * per path (not domain). This allows us to track registration requests
   * unique to a particular path on the site (great for doing registration
   * testing on multiple apps on the same domain).
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
    INSTALLED_ACTION = "Installed Application",
    AUTH_COOKIE_NAME = "M.ga.trackAuthDialog",
    INSTALLED_COOKIE_NAME = "M.ga.trackInstalled";

  // Tracks when a user gets prompted with a facebook auth dialog
  that.trackAuthDialog = function (scopeArray, cb) {
    if (!$.cookie) return l("Can't track registration flow without jquery cookie");
    if (!(scope instanceof Array)) return l("Scope must be a instance of array");

    if (!($.cookie(AUTH_COOKIE_NAME) === "t")) {

      //Cookie only tracked on path it was created on
      $.cookie(AUTH_COOKIE_NAME, "t");

      var scopeString = sanitizeScope(scopeArray);
      track(REGISTRATION_CATEGORY, AUTH_DIALOG_ACTION, scopeString, null, true);

      // Give google analytics a couple milliseconds to execute the request
      // http://support.google.com/googleanalytics/bin/answer.py?hl=en&answer=55527
      setTimeout(cb, 100);
    }


  };

  // Tracks when a user installs the app
  that.trackInstalled = function (scope, cb) {
    if (!$.cookie) return l("Can't track registration flow without jquery cookie");

    if (!($.cookie(INSTALLED_COOKIE_NAME) === "t")) {

      //Cookie only tracked on path it was created on
      $.cookie(INSTALLED_COOKIE_NAME, "t");

      var scopeString = sanitizeScope(scopeArray);
      track(REGISTRATION_CATEGORY, INSTALLED_ACTION, scopeString, null, true);

      // Give google analytics a couple milliseconds to execute the request
      // http://support.google.com/googleanalytics/bin/answer.py?hl=en&answer=55527
      setTimeout(cb, 100);
    }
  };


  /**
   * Helps keep analytics clean by sanitizing each scope name and sorting the
   * scope for easier comparison later
   * @param scopeArray
   */
  function sanitizeScope(scopeArray) {
    var cleanScopeArray = [];
    $.each(scopeArray, function (index, rawScopeString) {
      cleanScopeArray.push($.trim(rawScopeString).toLowerCase());
    });

    cleanScopeArray.sort();

    return cleanScopeArray.join(",");
  }

  // -------------------------------------------- CHANNEL TRACKING

  // Tracks when a user sends app requests
  that.trackAppRequest = function () {

  };

  // Tracks when a user sends a wall post
  that.trackWallPost = function () {

  };

  // Tracks when a user gets sent a welcome email
  that.trackWelcomeEmail = function () {

  };


  function track(category, action, optLabel, optValue, optNoninteraction) {
    gaq.push(['_trackEvent', category, action, optLabel, optValue, optNoninteraction]);
  }


}());



