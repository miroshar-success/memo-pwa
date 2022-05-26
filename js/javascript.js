//window.onload = getSettingRange(SettingRangeStart, SettingRangeEnd);
$(document).ready(function() {
	getDeviceInfo();
});

function getDeviceInfo() {
	var sendPath = "/devInfo";
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", sendPath);
	xhttp.responseType = 'text';
  xhttp.onreadystatechange = function() {
  	if (this.readyState == 4 && this.status == 200) 
  	{//
			console.log(xhttp.responseText);
			handleDeviceInfo(xhttp.responseText);
		}
	}
	xhttp.send();		
}

function handleDeviceInfo(jsonDeviceInfo)
{
	jsonObjDeviceInfo = JSON.parse(jsonDeviceInfo);
	var deviceNameNoPrefix = jsonObjDeviceInfo.ssid.slice(5);//slice to remove the prefix MEMO-
	var deviceNameClean;
	const index = deviceNameNoPrefix.indexOf('|');
	if (index !== -1) {
		var deviceNameClean = deviceNameNoPrefix.slice(0, index);//Remove the mac address from the name
	}
	else deviceNameClean = deviceNameNoPrefix;
  $('.nav-dev-name').text(deviceNameNoPrefix);
}

var getJSON = function(url, callback) {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';

  xhr.onload = function() {

    var status = xhr.status;

    if (status == 200) {
      callback(null, xhr.response);
    } else {
      callback(status);
    }
  };
  //  xhr.send();
};

getJSON('/setting/72-87', function(err, data) {
  if (err != null) {
    //      console.error(err);
  } else {
    for (var i = 0; i < data.settings.length; i++) {
      document.getElementById(data.settings[i].key).value = data.settings[i].value;
    }
  }
});

function getSettingRange(Start, End) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(xhttp.responseText);
    }
  };
  xhttp.open("GET", "/settingrange/" + Start + "-" + End, true);
  xhttp.send();
}

/* notification slide out and in   ----------------------------------------------------- */
function animateNotification() {
  var slideout = document.getElementById('notif');
  slideout.classList.toggle('visible');
}


// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
let vw = window.innerWidth * 0.01 ;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);
document.documentElement.style.setProperty('--vw', `${vw}px`);

// We listen to the resize event
window.addEventListener('resize', () => {
  // We execute the same script as before

  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  let vw = window.innerWidth * 0.01;
  document.documentElement.style.setProperty('--vw', `${vw}px`);
});

//invoke function after page completely loaded
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('stepperBottomID')) {
    changeProgrammKeysPage("onLoadPage");
  }
}, false);
