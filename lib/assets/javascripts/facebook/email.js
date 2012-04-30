M.provide("facebook", new function () {

  // Standard boilerplate for constructors
  var that = this;

  // -------------------------------------------- CORE LIBS

  /**
   * sendEmail is a deprecated way of sending emails for free with facebook.
   *
   * Tested Configurations (as of April 29 2012)
   *
   * Single Logged in user:
   *  short lived token for user : SENT
   *  long lived token for user : SENT
   *  app token : SENT
   *
   * Multiple users both recently logged in
   *  app_token : SENT
   *  app_token with one or more users uninstalled : SENT for valid users
   *  one of the users long lived tokens : BOTH FAILED
   *  one of the users short lived tokens: BOTH FAILED
   *
   * Same user twice
   *  app_token: BOTH SENT
   *
   * Guideline:
   *  Based on the experimental results shown above the most robust way to
   *  ensure scalable email delivery is to use the **app's token** and ensure
   *  that you have asked for extended permissions for that user. It seems
   *  like if the app still has a valid token in existance for that user
   *  you can use the app_token in lieu of the actual extended token
   *
   * Note:
   * Only one of the two messages (fbmlMessage and textMessage) is sent and
   * fbml takes precedence, text is used as a fallback when fbml is null or
   * can't be rendered correctly.
   *
   * @param options
   *
   * Required Options: facebookUserIds, subject, fbmlMessage, textMessage,
   *                   accessToken
   *
   * Optional:
   * success(userIdsSentTo), error(errorMessage)
   *
   *
   *
   */
  that.sendEmail = function (options) {
    FB.api({
      method:'notifications.sendEmail',
      recipients:facebookUserIds,
      subject:options.subject,
      fbml:options.fbmlMessage,
      text:options.textMessage,
      access_token:options.accessToken
    }, function (response) {
      if (response.error_msg) {
        // response will be a object with error_msg
        if (options.error) options.error(response.error_msg);
      } else {
        // response will be a array of userIds
        if (options.success) options.success(response);
      }

    });
  };

});
