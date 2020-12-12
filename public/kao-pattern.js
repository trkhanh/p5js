function rememberPatternChanged(params) {
  if (document.getElementById('rememberPattern')) {
    setCookies = true;
  }
}

function writeCookie(key, value, days, path) {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  if (typeof path == 'undefined') {
    path = '';
  } else {
    path = ';path=' + path;
  }
  document.cookie = `${key}=${value};exprires=${expiry.toUTCString()}${path}`;
}

function legacyCookie(state) {
  if (!setCookies && !hiddenCookie) {
    writeCookie(cookie, state, 60);
    $('#hiddenCookie').append(
      "<p>We found a stored design. Do you want to see it? <a href='" +
        window.location.href.split('?')[0] +
        "'>Find it here.</a></p>"
    );
  }
}

function appletCookie(value) {
  writeCookie('cdokb_a', value, 365 * 5, '/kumihimo'); // 5 years to expiry
  return true;
}
