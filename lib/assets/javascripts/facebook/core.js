M.provide("facebook", new function () {

  // Standard boilerplate for constructors
  var that = this;

  // -------------------------------------------- CORE LIBS

  var sdkInitialized = false;

  // Load the Facebook SDK Asynchronously
  that.initializeJsSdk = function (callback) {
    if (sdkInitialized) return l("Facebook js sdk already initialized");

    //Define the callback
    window.fbAsyncInit = callback;

    // Append the fb-root div
    var body = document.getElementsByTagName("body")[0];
    $("<div id='fb-root'></div>").appendTo(body);

    // Init the library
    (function (d) {
      var js, id = 'facebook-jssdk';
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement('script');
      js.id = id;
      js.async = true;
      js.src = "//connect.facebook.net/en_US/all.js";
      d.getElementsByTagName('head')[0].appendChild(js);
    }(document));

    sdkInitialized = true;
  };


  /**
   * Since FB.login() requires a user action and the server side calls
   * require a secondary blocking call (when not hitting a canvas app)
   * we must take matters into our own hands. We redirect to the correct
   * facebook auth page with this call.
   *
   * AppId = facebook application id
   * Scope = comma delimited string of facebook permissions
   * redirectUri = uri where fb should redirect after auth
   * display = mode to display the auth dialog
   */
  that.redirectToLogin = function (appId, scope, redirectUri, display) {
    if (!FB) return l("Facebook SDK not initialized");


    var path = "https://www.facebook.com/dialog/oauth?",
      queryParams = ["client_id=" + appId, "redirect_uri=" + redirectUri,
        "scope=" + scope, 'response_type=token'],
      query = "";

    if (display) queryParams.push("display=" + display);

    // Construct query out
    query = queryParams.join('&');

    window.top.location = path + query;
  };


  //TODO create method that checks cookie for version number and reauths
  // even if connected for new permissions.


  // Performs callback only if the user is logged in and installed

  /**
   * doIfConnected:
   * Helper that takes advantage of the cached FB.getLoginStatus function.
   * Will execute the callback passing
   * @param cb
   */
  that.doIfConnected = function (cb) {
    if (!FB) l("Facebook SDK not initialized");
    FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        // The user is logged in and connected to your app and
        // response.authResponse supplies the user’s ID, a valid access token,
        // a signed request, and the time the access token and signed request
        // each expire
        var facebookUserId = response.authResponse.userId,
          shortLivedToken = response.authResponse.accessToken,
          expiresInSeconds = response.authResponse.expiresIn;

        // Call the callback with the response parsed into what we care about.
        cb(facebookUserId, shortLivedToken, expiresInSeconds);

      } else if (response.status === 'not_authorized') {
        // The user is logged in to Facebook, but not connected to the app
        l("User is logged in but hasn't installed the app");
      } else {
        l("User is not logged into facebook");
      }
    });
  };


  /**
   * Exchange short live token for long lived token
   * @param options
   * Required Options: appId, appSecret, shortLivedToken
   * Optional: success, error (callbacks)
   */
  that.getLongLivedToken = function (options) {
    var path = "https://graph.facebook.com/oauth/access_token?",
      queryParams = ["client_id=" + options.appId, "client_secret=" + options.appSecret,
        "grant_type=fb_exchange_token", "fb_exchange_token=" + options.shortLivedToken],
      query = queryParams.join('&');
    var ajaxHash = {
      type:"GET",
      url:path + query
    };

    // Request returns the string: access_token=SOME_LONG_TOKEN&expires=5183788
    // We parse and return a orderly result
    ajaxHash.success = function (responseString) {
      if (options.success) {
        var result = M.queryParams(responseString);
        options.success(result.access_token, result.expires);
      }
    };

    ajaxHash.error = function () {
      if (options.error) options.error();
    };

    $.ajax(ajaxHash);
  };


}());
