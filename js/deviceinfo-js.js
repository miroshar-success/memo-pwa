$(document).ready(function() {
	getDeviceInfo();
	stopPulsatingFunction
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
  document.getElementById('inputDeviceNameID').value = deviceNameClean;
  $('.nav-dev-name').text(deviceNameNoPrefix);
  document.getElementById('iPAddressID').innerHTML = jsonObjDeviceInfo.ip_addr;
  document.getElementById('macAddressID').innerHTML = jsonObjDeviceInfo.mac_addr;
  document.getElementById('firmwareVersionID').innerHTML = jsonObjDeviceInfo.firmware_v;
  document.getElementById('controllerTypeID').innerHTML = getHardwareName(jsonObjDeviceInfo.hardware_v);	
  compareDeviceName(deviceNameClean);
}

// Compare device name
function compareDeviceName(deviceNameClean){
  if(deviceNameClean.toString() == "AIR-2-ONE"){
    console.log("change device name prompt")
    startPulsatingFunction();
	document.getElementById('inputDeviceNameID').style.border = "1px solid #00f5d0";
  }
  else{
    stopPulsatingFunction();
    console.log("no change device name prompt")
  }
}

// Start/stop pulsating text function
function startPulsatingFunction() {
	document.getElementById('inputDeviceNameID').style.animation = "pulsate 4s infinite"
}

function stopPulsatingFunction() {
	document.getElementById('inputDeviceNameID').style.animation = "none"
}


function getHardwareName(hardwareID)
{
	if(hardwareID == '0') return "AIR-2-ONE";
	else "OTHER";
}


$(document).on("mouseup", ".btn-identify-device", function(e) {
  var btn = this;
  btn.classList.add("disabled-button");
  animateNotification();

  var timeleft = 2;
  var downloadTimer = setInterval(function() {
    if (timeleft <= 0) {
      btn.classList.remove("disabled-button");
      clearInterval(downloadTimer);
    }
    timeleft -= 1;
  }, 1000);
});

$(document).on("mouseup", ".text-button-white-edit", function() {
  window.location.href = "/index.html";
});//btn-identify-device

$(document).on("mouseup", ".btn-identify-device", function() {
  sendIdentifyDevice(5);
});//

var delayTimer;
$(document).on("focusout", ".device-name", function() {
	// clearTimeout(delayTimer);

	var deviceName = document.getElementById('inputDeviceNameID').value;
		const index = deviceName.indexOf('|');
		if (index !== -1) {
		  deviceName = deviceName.slice(0, index);//Remove the mac address from the name
		}
		 sendDeviceName(deviceName);//update the device name

	// delayTimer = setTimeout(function() {
		
    // }, 2000); // Will do the request after 2sec
});
/*
$(".device-name").change(function(){
	clearTimeout(delayTimer);
	delayTimer = setTimeout(function() {
		 sendDeviceName(document.getElementById('inputDeviceNameID').value);//update the device name
    }, 2000); // Will do the request after 2sec
 
});
*/
function sendDeviceName(newDeviceName) {
	var sendPath = "/command/devName";
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", sendPath);
	xhttp.responseType = 'text';
  xhttp.onreadystatechange = function() {
  	if (this.readyState == 4 && this.status == 200) 
  	{//
			console.log(xhttp.responseText);
		}
	}
	xhttp.setRequestHeader("X-device-ap-name", newDeviceName);
	xhttp.send("changeDeviceAPName" + '\0');		
}

function sendIdentifyDevice(timer) {
	var sendPath = "/command/identify";
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", sendPath);
	xhttp.responseType = 'text';
  xhttp.onreadystatechange = function() {
  	if (this.readyState == 4 && this.status == 200) 
  	{//
			console.log(xhttp.responseText);
		}
	}
	xhttp.setRequestHeader("X-identify-timer", timer.toString());
	xhttp.send("identifyDevice" + '\0');		
}

/* notification slide out and in   ----------------------------------------------------- */
function animateNotification() {
  var slideout = document.getElementById('notif');
  slideout.classList.remove('visible');
  slideout.offsetWidth;
  slideout.classList.add('visible');
}
