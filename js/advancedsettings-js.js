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



$(document).on("mouseup", ".text-button-white-edit", function() {
  window.location.href = "/index";
});


$(document).ready(function() {
  $('.ad-popup, .ad-overlay').hide();
  $(".btn-question-mark").click(function() {
    $(".ad-popup, .ad-overlay").show();
    $("body").css({
      "position": "sticky",
      "overflow": "hidden"
    });
  });
});






$(document).on("mouseup", ".ad-overlay", ".btn-cancel", function(e) {
  $(".ad-popup, .ad-overlay").hide();
  $("body").css({
    "position": "static",
    "overflow": "auto"
  });

});

$(document).on("mouseup", ".btn-cancel", function(e) {
  $(".ad-popup, .ad-overlay").hide();
  $("body").css({
    "position": "static",
    "overflow": "auto"
  });

});

$(document).on("mouseup", ".close-popup-icon", function(e) {
  $(".ad-popup, .ad-overlay").hide();
  $("body").css({
    "position": "static",
    "overflow": "auto"
  });

});
$(document).on("mouseup", ".close", function(e) {
  $(".ad-popup, .ad-overlay").hide();
  $("body").css({
    "position": "static",
    "overflow": "auto"
  });

});


/* Question Mark buttons */
$(document).on("mouseup", ".ad-questionmark-output-inversion", function() {
  var headline = document.getElementById("adHeadlineID");
  var text = document.getElementById("adParagraphID");

  headline.innerHTML = "Output Inversion";
  text.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.";
});

/* Question Mark buttons */
$(document).on("mouseup", ".ad-questionmark-outputs-number", function() {
  var headline = document.getElementById("adHeadlineID");
  var text = document.getElementById("adParagraphID");

  headline.innerHTML = "Number of Outputs";
  text.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore";
});

/* Question Mark buttons */
$(document).on("mouseup", ".ad-questionmark-outputs-duration", function() {
  var headline = document.getElementById("adHeadlineID");
  var text = document.getElementById("adParagraphID");

  headline.innerHTML = "Output Duration Cut";
  text.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore";
});
/* Question Mark buttons */
$(document).on("mouseup", ".ad-questionmark-outputs-interval", function() {
  var headline = document.getElementById("adHeadlineID");
  var text = document.getElementById("adParagraphID");

  headline.innerHTML = "Output Interval";
  text.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore";
});
/* Question Mark buttons */
$(document).on("mouseup", ".ad-questionmark-outputs-clearance", function() {
  var headline = document.getElementById("adHeadlineID");
  var text = document.getElementById("adParagraphID");

  headline.innerHTML = "Output Clearance";
  text.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore";
});
/* Question Mark buttons */
$(document).on("mouseup", ".ad-questionmark-outputs-drawer", function() {
  var headline = document.getElementById("adHeadlineID");
  var text = document.getElementById("adParagraphID");

  headline.innerHTML = "Output drawer mode";
  text.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore";
});
/* Question Mark buttons */
$(document).on("mouseup", ".ad-questionmark-outputs-sound", function() {
  var headline = document.getElementById("adHeadlineID");
  var text = document.getElementById("adParagraphID");

  headline.innerHTML = "Output active sound";
  text.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore";
});
/* Question Mark buttons */
$(document).on("mouseup", ".ad-questionmark-door-inputs", function() {
  var headline = document.getElementById("adHeadlineID");
  var text = document.getElementById("adParagraphID");

  headline.innerHTML = "Door Input";
  text.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore";
});
/* Question Mark buttons */
$(document).on("mouseup", ".ad-questionmark-door-inversion", function() {
  var headline = document.getElementById("adHeadlineID");
  var text = document.getElementById("adParagraphID");

  headline.innerHTML = "Door Input Inversion";
  text.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore";
});
/* Question Mark buttons */
$(document).on("mouseup", ".ad-questionmark-intrusion-alarm", function() {
  var headline = document.getElementById("adHeadlineID");
  var text = document.getElementById("adParagraphID");

  headline.innerHTML = "Intrusion alarm delay";
  text.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore";
});
/* Question Mark buttons */
$(document).on("mouseup", ".ad-questionmark-unit-address", function() {
  var headline = document.getElementById("adHeadlineID");
  var text = document.getElementById("adParagraphID");

  headline.innerHTML = "Unit Address";
  text.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore";
});
/* Question Mark buttons */
$(document).on("mouseup", ".ad-questionmark-network-enabled", function() {
  var headline = document.getElementById("adHeadlineID");
  var text = document.getElementById("adParagraphID");

  headline.innerHTML = "Network Enabled";
  text.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore";
});
/* Question Mark buttons */
$(document).on("mouseup", ".ad-questionmark-sound-on", function() {
  var headline = document.getElementById("adHeadlineID");
  var text = document.getElementById("adParagraphID");

  headline.innerHTML = "Sound On";
  text.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore";
});
/* Question Mark buttons */
$(document).on("mouseup", ".ad-questionmark-emergency-function", function() {
  var headline = document.getElementById("adHeadlineID");
  var text = document.getElementById("adParagraphID");

  headline.innerHTML = "Emergency open function";
  text.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore";
});
/* Question Mark buttons */
$(document).on("mouseup", ".ad-questionmark-invert-emergency", function() {
  var headline = document.getElementById("adHeadlineID");
  var text = document.getElementById("adParagraphID");

  headline.innerHTML = "Invert emergency open function";
  text.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore";
});

$(document).on("mouseup", ".text-button-white-edit", function() {
  window.location.href = "/index.html";
});
