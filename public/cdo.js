function rememberPatternChanged() {
	if (document.getElementById("rememberPattern").checked) {
		setCookies = true;
		writeCookie(stateName, state, 60);
	}
	else {
		setCookies = false;
		deleteCookie(stateName);
	}
} /* check if function used */

function rememberPatternChangedMP() {
	if (document.getElementById("rememberPattern").checked) {
		setCookies = true;
		writeCookie(cookieKey, state, 60);
		writeCookie('braid', cookieKey, 60);
	}
	else {
		setCookies = false;
		deleteCookie(cookieKey);
		deleteCookie('braid');
	}
}

function deleteCookie(key) {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() - 1);
	document.cookie = key + "=;expires=" + expiry.toUTCString();
}

function writeCookie(key, value, days, path) {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + days);
	if(typeof path === "undefined") {
		path = '';
	} else {
		path = ";path=" + path;
	}
	document.cookie = key + "=" + value + ";expires=" + expiry.toUTCString() + path;
}

function legacyCookie(state) {
	if (!setCookies && !hiddenCookie) {
		writeCookie(cookieKey, state, 60);
		$("#hiddenCookie").append("<p>We found a stored design. Do you want to see it? <a href='" + window.location.href.split('?')[0] + "'>Find it here.</a></p>");
	}
}

function appletCookie(value) {
	writeCookie("cdokb_a", value, 365 * 5, '/kumihimo'); // 5 years to expiry
	return true;
}

function stateChangeHandler(newState) {
	state=newState;
	if (state.slice(0,3) != '001') {
		if (cookieKey == 'fba') {
			state = '00101' + state;
		} else {
			altstate = '00101' + ("00"+(parseInt(state.slice(0,2),16)-1).toString(16)).slice(-2) + state.slice(2,-6);
		}
	}
	
	// need to switch colour order. Later, will only do this if not got 001 prefix, but haven't converted kongohgumi2.php yet
	if (cookieKey == 'fba') {
		state = state.slice(0,7) + state.slice(-6) + state.slice(7,-6);
	}


	if (setCookies) { writeCookie(cookieKey, state, 60);}
	// want to find sendPattern id, and update all links inside this id
	
	var submitPhoto = document.getElementById("submitPhoto");
	if (submitPhoto != null) {
		var links = submitPhoto.getElementsByTagName("a");
		for (var i = 0; i < links.length; i++) {
			links[i].href = "/add-design-to-gallery/?cdokb_a=" + braidID + "&cdokb_s=" + state;
		}
	}

	var getLink = document.getElementById("getLink");
	if (getLink != null) {
		var links = getLink.getElementsByTagName("a");
		for (var i = 0; i < links.length; i++) {
			links[i].href = document.URL.split('?')[0] + "?&cdokb_s=" + state;
		}
	}
	var getLink = document.getElementById("jsmpLink");
	if (getLink != null) {
		var links = getLink.getElementsByTagName("a");
		/* javascript code to convert links from 001 format to old mp java format
		if (stateName.indexOf("jsmp")==0) {
			altStateName = stateName.slice(2);
			altstate = ("00"+(parseInt(state.slice(5,7),16)+1).toString(16)).slice(-2) + state.slice(7) + 'ffffff';
		} else if (stateName.indexOf("mp")==0) {
			altStateName = "js"+stateName;
			altstate = '00101' + ("00"+(parseInt(state.slice(0,2),16)-1).toString(16)).slice(-2) + state.slice(2,-6);
		}
		*/
		for (var i = 0; i < links.length; i++) {
			links[i].href = document.URL.split('?')[0] + "?cdokb_s=" + state;
		}
	}
	var getLink = document.getElementById("jsmpLink2");
	if (getLink != null) {
		var links = getLink.getElementsByTagName("a");
		for (var i = 0; i < links.length; i++) {
			links[i].href = document.URL.split('?')[0] + "?cdokb_s=" + state;
		}
	}
}

function heightChangeHandler(height) {
	document.getElementById("applet").height = height;
}

function patternChangeHandler(patternID) {
	if (setCookies) { writeCookie("mp_patt", patternID, 60);}
	
	// Hide all pattern instructions, and display current one
	$("#mp_pattDescr > div").addClass("hidden");
	$("#mp_" + patternID).removeClass("hidden");
}

function setPatternLinks(locn) {
	if (hiddenCookie) $("#hiddenCookie").append("<p>Were you expecting your own saved design? <a href='" + window.location.href.split('?')[0] + "'>Find it here.</a></p>");
	$("#submitPhoto").append("<a href='/add-design-to-gallery/?cdokb_a=" + braidID + "&cdokb_s=" + state + "'><img src='/i/photo.png' width='20' height='20' /></a><a href='/add-design-to-gallery/?cdokb_a=" + braidID + "&cdokb_s=" + state + "'>Send us your design</a> with or without a photo of your finished braid.");
	$("#getLink").append("<a href='?cdokb_s=" + state + "'><img src='/i/link.png' width='20' height='20' /></a><a href='?cdokb_s=" + state + "'>Link to your design</a> - share your pattern with your friends");
	$("#allowCookies").append("<input type='checkbox' onClick='rememberPatternChangedMP();' id='rememberPattern'" + cookieString + " />Remember pattern (requires cookies)");
}

function loadLHGallery() {
	var height = $('#content').innerHeight();
	var lhcolumn = $('#lhcolumn');
	var headerSet = false;
	while (height > 0 && photoArray.length > 0) {
		var index = Math.floor(Math.random()*photoArray.length);
		var nxtPhoto = photoArray.splice(index,1);
		if (nxtPhoto[0].thWidth > nxtPhoto[0].thHeight) {
			if (nxtPhoto[0].thWidth > 150) {
				nxtPhoto[0].thHeight = 	nxtPhoto[0].thHeight * (150 / nxtPhoto[0].thWidth);
				nxtPhoto[0].thWidth = 150 
			}
		} else {
			if (nxtPhoto[0].thHeight > 150) {
				nxtPhoto[0].thWidth = 	nxtPhoto[0].thWidth * (150 / nxtPhoto[0].thHeight);
				nxtPhoto[0].thHeight = 150 
			}
		}
		if (nxtPhoto[0].thHeight + lhcolumn.innerHeight() > height) {
			continue;
		}
		if (!headerSet) {
			$('#lhcolumn h3').append('From Our Gallery');
			headerSet = true;
		}
		var imgTag = $('<img src="/gallery.old/thumb/' + nxtPhoto[0].file + '" width="' + nxtPhoto[0].thWidth + '" height="' + nxtPhoto[0].thHeight + '" />');
		var patternText = "";
		
		//imgTag.appendTo(lhcolumn).slimbox('/gallery/large/' + nxtPhoto[0].file);
		$('<a href="/gallery.old/large/' + nxtPhoto[0].file + '" rel="lightbox" title="' + nxtPhoto[0].descr + '"></a>').append(imgTag).add('').appendTo(lhcolumn).slimbox();
	}
}

function mpiconToggle(clicked) {
	if (clicked.firstChild.src.indexOf("plus") == -1) {
		clicked.firstChild.src = clicked.firstChild.src.replace("minus", "plus");
		sibling = clicked.nextSibling;
		while (sibling) {
			$(sibling).toggle();
			sibling = sibling.nextSibling;
		}
	} else {
		clicked.firstChild.src = clicked.firstChild.src.replace("plus", "minus");
		sibling = clicked.nextSibling;
		while (sibling) {
			//sibling.style.display = "inherit";
			$(sibling).toggle();
			sibling = sibling.nextSibling;
		}
	}
}

function mpiconsCollapse() {
	$(".expansion").append('<img src="/i/plus15.png" width="15" height="15" title="Click to toggle" />').click(function(){mpiconToggle(this);}).siblings(".child").toggle();
}