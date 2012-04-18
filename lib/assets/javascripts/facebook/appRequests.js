M.provide("facebook", new function () {

  // Standard boilerplate for constructors
  var self = this;

  // -------------------------------------------- CORE LIBS

  /**
   * deleteAppRequests:
   * Deletes a number of appRequests, must be called after the facebook Api
   * has been initialized. Furthermore the request_ids must be constructed
   * as "REQUESTID_USERID"
   *
   * @param compoundRequestIds
   * @param access_token
   */
  self.deleteAppRequests = function (compoundRequestIds, access_token) {
    if (!compoundRequestIds) return t("compoundRequestIds invalid");
    if (!FB) return t("FB not initialized");

    for (var i = 0, len = compoundRequestIds.length; i < len; ++i) {
      FB.api(compoundRequestIds[i], {access_token:access_token},
        'delete', function (response) {
          log(response);
        });
    }
  };


  /**
   * sendAppRequests:
   * Recursively prompts users to send app requests to all passed in facebook
   * ids.
   *
   * Required options:
   * facebookUserIds: array of all ids you wish to send to
   * title: the facebook app request title
   * message: the facebook app request message
   * display: display type for fb dialog
   *
   *
   * Optional options:
   * maxAppRequest: max number to try to send in one go. FB max is 50. default is 50
   *
   *
   * Optional Callback options:
   * Callbacks are passed the app request response from facebook
   * cancel: callback when a user clicks cancel
   * sent: callback when a user sends to friends
   * finished: callback when all facebookUserIds have been looped through
   *
   * Callback response format is native fb_app_request response with
   * 'processed' key injected
   */

  var maxAppRequest = 50;
  self.sendAppRequests = function (options) {
    var facebookUserIds = options['facebookUserIds'],
      processed = options['processed'] || 0,
      remainingFacebookUserIds = [],
      maxAppRequest = options['maxAppRequest'] || 50;

    if (!facebookUserIds) return;

    // Chop the ids into manageable chunks
    if (facebookUserIds.length >= maxAppRequest) {
      remainingFacebookUserIds = facebookUserIds.slice(maxAppRequest);
      facebookUserIds = facebookUserIds.slice(0, maxAppRequest);
    }

    // Even if they hit cancel
    processed += facebookUserIds.length;

    FB.ui({
      method:'apprequests',
      title:options['title'],
      message:options['message'],
      to:facebookUserIds,
      display: options['display']
    }, function (request) {
      // If there was an error or they clicked cancel we return and continue the game
      if (!request || !request.to) {
        request = request || {};
        request.processed = processed;
        if (options['cancel']) options['cancel'](request);
      } else {
        request.processed = processed;
        if (options['sent']) options['sent'](request);
      }

      // Always continue through the full list of ids
      if (remainingFacebookUserIds && remainingFacebookUserIds.length > 0) {
        options['facebookUserIds'] = remainingFacebookUserIds;
        options['processed'] = processed;
        self.sendAppRequests(options);
      } else {
        if (options['finished']) options['finished'](request);
      }

    });
  };



}());
