/** COOKIE FUNCTION **/
function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+";domain=.chanel.com;path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name, "", -1);
}

/** REFERER **/
var referer = document.referrer;
if (referer != "") {
	var parser = document.createElement('a');
	parser.href = referer;
	if (parser.hostname.search("chanel.") == -1) {
		// Current referer = external site
		// The cookie must be set here
		createCookie('initialreferer', parser.hostname, 1);
	} else {
		// Current referer = Chanel site
		// The cookie should already been set
		referer = readCookie('initialreferer');
	}
	parser = null;
} else {
	// Direct access : the cookie must be cleared
	eraseCookie('initialreferer');
}