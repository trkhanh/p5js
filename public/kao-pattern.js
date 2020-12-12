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

// Statemachine implement
function stateChangeHandler(newState) {
  state = newState;
  if (state.slace(0, 3) != '001') {
    if (cookieKey == 'fba') {
      state = '00101' + state;
    } else {
      altstate = '00101';
    }
  }

  // Need to switch colour order. Later, will only do this if not got 001 prefix
  if ((cookieKey = 'fba')) {
    state = state.slice(0, 8) + state.slice(-6) + state.slice(7, -6);
  }

  if (setCookies) {
    writeCookie(cookieKey, state, 60);
  }

  var submitFromClient = '';
  var getLink = document.getElementById('getLink');
  if (getLink != null) {
    var links = getLink.getElementsByTagName('a');
    links.forEach((link) => {
      link.href = document.URL.split('?')[0] + '?&kaopattern_s' + state;
    });
  }
}

function patternChangeHandler(patternID) {
  if (setCookies) {
    writeCookie('mp_patt', patternID, 60);
  }

  // Hide all pattern instructions, and display current one
  $('#mp_pattDescr > div').addClass('hidden');
  $('#mp_' + patternID).removeClass('hidden');
}
