M.provide("facebook", new function () {

  // Standard boilerplate for constructors
  var self = this;

  // -------------------------------------------- CORE LIBS

  var sdkInitialized = false;

  // Load the Facebook SDK Asynchronously
  self.initializeJsSdk = function (callback) {
    if(sdkInitialized) return l("Facebook js sdk already initialized");

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

}());
