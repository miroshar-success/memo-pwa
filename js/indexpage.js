//window.onload = getSettingRange(SettingRangeStart, SettingRangeEnd);
$(document).ready(function() {
	getDeviceInfo();
 	hideDeviceNamePromptMessage();
});

function getDeviceInfo() {
	var sendPath = "https://192.168.4.1/devInfo";
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
  compareDeviceName(deviceNameClean);
}

// Compare device name
function compareDeviceName(deviceNameClean){
  if(deviceNameClean.toString() == "AIR-2-ONE"){
    console.log("device name prompt")
    showDeviceNamePromptMessage();
  }
  else{
    hideDeviceNamePromptMessage();
    console.log("no device name prompt")
  }
}

// User clicked yes
$(document).on("mouseup", ".devicePrompt-yes", function() {
  window.location.href = "/deviceinfo.html";
});

// User clicked no
$(document).on("mouseup", ".devicePrompt-no", function() {
  hideDeviceNamePromptMessage();
});

// Show/hide function of device name prompt
function showDeviceNamePromptMessage() {
  $('#deviceName-prompt').show();
}

function hideDeviceNamePromptMessage() {
  $('#deviceName-prompt').hide();
}
