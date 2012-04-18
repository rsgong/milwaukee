/* Log.js
 * Provides basic logging and tracing support in a robust way across browsers.
 */
function log(message) {
  if (console && console.log) {
    console.log(message)
  }
}

function trace(message){
  if(console && console.trace){
    console.trace(message);
  } else {
    //Try to fallback to a log
    log(message);
  }
}

function l(message) {
  log(message);
}

function t(message){
  trace(message);
}


