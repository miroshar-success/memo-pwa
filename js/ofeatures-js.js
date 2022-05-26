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

/* Opneing Timer Mode . Page ---------------------------------------------------*/
//Minus Button
$(document).ready(function() {
  $('.minus').click(function() {
		var settingName = $(this).attr('name');
		var settingIndex = getSettingIndex(settingName);
		if (!isNaN(Number(settingIndex)))
		{
			var minValue = parseInt(objJsonMemoryKeyValues.settings[settingIndex].Min);
			var multiplier = parseInt(objJsonMemoryKeyValues.settings[settingIndex].Multiplier);
			//minValueMultiplied = minValue*multiplier;
			//minValueMultiplied = minValueMultiplied < 1 ? 1 : minValueMultiplied;
	    var $input = $(this).parent().find('input');
	    var count = parseInt($input.val()) - multiplier;
	    count = count < minValue ? minValue : count;
	    $input.val(count);
	    $input.change();
	}
    return false;
  });
  //Plus Button
  $('.plus').click(function() {
		var settingName = $(this).attr('name');
		console.log("plus name: " + settingName);
		var settingIndex = getSettingIndex(settingName);
		if (!isNaN(Number(settingIndex)))
		{
			var maxValue = parseInt(objJsonMemoryKeyValues.settings[settingIndex].Max);
			var multiplier = parseInt(objJsonMemoryKeyValues.settings[settingIndex].Multiplier);
	    var $input = $(this).parent().find('input');
	    var count = parseInt($input.val()) + multiplier;
	    count = count > maxValue ? maxValue : count;
	    $input.val(count);
	    $input.change();
		}
    return false;
  });
});

function saveSetting(stringSettingName, stringValue, stringSelection) {
	console.log('saveSetting' + stringSettingName);
	var SettingsPath = "/setting";
	var settingIndex = getSettingIndex(stringSettingName);
	if (!isNaN(Number(settingIndex)))
	{
		var settingAdd = String(parseInt(objJsonMemoryKeyValues.settings[settingIndex].Address));
		var settingBitPos = String(parseInt(objJsonMemoryKeyValues.settings[settingIndex].BitPos));
		var settingMultiplier = parseInt(objJsonMemoryKeyValues.settings[settingIndex].Multiplier);
		var settingUnits = objJsonMemoryKeyValues.settings[settingIndex].Units;
		var settingTitle = objJsonMemoryKeyValues.settings[settingIndex].Title;
		if(stringSelection != null && settingUnits == 'select')
		{
			var selectionLength = Object.keys(objJsonMemoryKeyValues.settings[settingIndex].Selection).length;
			for(var i=0; i<selectionLength; i++)
			{
				if(objJsonMemoryKeyValues.settings[settingIndex].Selection[i] == stringSelection) break;
			}
			if(stringValue == "1") stringValue = i;//If we want to enable the setting, change the stringValue to the selection index as it is in the controller memory.
			else stringValue = "0"; //If the setting is disabled, disable all selections. TODO possible handling of selections in the future..
		}
		else
		{
			stringValue = parseInt(stringValue) / settingMultiplier;//Apply multiplier
			stringValue = String(stringValue);
		}
		var jsonString = JSON.stringify({"json_type" : "saveSetting", "settingAdd":settingAdd,"settingBitPos":settingBitPos,"settingValue":String(stringValue)});

		var xhttp = new XMLHttpRequest();
		xhttp.responseType = 'text';
		xhttp.open("POST", SettingsPath, true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.send(jsonString);

		var element = document.getElementById('notif');
	  if( element ){
		  element.addEventListener("animationstart", listener, false);
		  element.addEventListener("animationend", listener, false);
		  element.addEventListener("animationiteration", listener, false);
		  element.className = "moveout";

		  switch (settingUnits) {
		    case "toggle":
		      if (stringValue === '1') {
		        document.getElementById("notifText").innerHTML = settingTitle + " State: On";
		      } else {
		        document.getElementById("notifText").innerHTML = settingTitle + " State: Off";
		      }
		      break;
		    case "seconds":
					document.getElementById("notifText").value = parseInt(stringValue) * settingMultiplier;
		    	document.getElementById("notifText").innerHTML = settingTitle + " set to " + document.getElementById("notifText").value + " Seconds";
		      break;
		    case "Mseconds":
					document.getElementById("notifText").value = parseInt(stringValue) * settingMultiplier;
		    	document.getElementById("notifText").innerHTML = settingTitle + " set to " + document.getElementById("notifText").value + " Ms.";
		      break;
		    case "days&hours":
					var hours = parseInt(stringValue) % 24;
					var days = Math.floor(parseInt(stringValue) / 24);
		      document.getElementById("notifText").innerHTML = settingTitle + " set to " + days + " Days and " + hours + " Hours";
					break;
		    case "select":
					if(parseInt(stringValue) > 0) document.getElementById("notifText").innerHTML = settingTitle + " set to " + stringSelection;
					else document.getElementById("notifText").innerHTML = settingTitle + " set to " + objJsonMemoryKeyValues.settings[settingIndex].Selection[0];
					break;
		    case "bitmap"://TODO: handling of multiple outputs
					if(parseInt(stringValue) > 0) document.getElementById("notifText").innerHTML = settingTitle + " Enabled";
					else document.getElementById("notifText").innerHTML = settingTitle + " Disabled";
					break;
		    case "nounits":
					document.getElementById("notifText").innerHTML = settingTitle + " set to " + stringValue;
					break;
		    default:
		      console.log("Unhandled setting type in notification");
		  }
	  }
		animateNotification();
	}
	else
	{
		console.log("Error: setting name not found during save");
	}
}

function fetchSetting(settingId, stringSettingName, stringSelection) {
	var SettingsPath = "/setting";
	var settingIndex = getSettingIndex(stringSettingName);
	if (!isNaN(Number(settingIndex)))
	{
		var settingAdd = String(parseInt(objJsonMemoryKeyValues.settings[settingIndex].Address));
		var settingBitPos = String(parseInt(objJsonMemoryKeyValues.settings[settingIndex].BitPos));
		var settingUnits = objJsonMemoryKeyValues.settings[settingIndex].Units;
		var settingMultiplier = parseInt(objJsonMemoryKeyValues.settings[settingIndex].Multiplier);

		var jsonString = JSON.stringify({"json_type": "fetchSetting", "settingAdd": settingAdd ,"settingBitPos": settingBitPos});

		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", SettingsPath, true);
		xhttp.responseType = 'json';
	  xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
				var jsonObj = JSON.parse(JSON.stringify(xhttp.response));
			  switch (settingUnits) {
			    case "toggle":
			      if (jsonObj.value === '1') {
							document.getElementById(settingId).checked = true;
			      } else {
							document.getElementById(settingId).checked = false;
			      }
			      break;
			    case "seconds":
						document.getElementById(settingId).value = jsonObj.value * settingMultiplier;
			    	//document.getElementById(settingId).innerHTML = "Duration: " + document.getElementById(settingId).value + " Seconds";
			      break;
			    case "Mseconds":
						document.getElementById(settingId).value = jsonObj.value * settingMultiplier;
			      break;
			    case "days&hours":
						var hours = parseInt(jsonObj.value) % 24;
						var days = Math.floor(parseInt(jsonObj.value) / 24);
						document.getElementById('validationDays').value = days;
						document.getElementById('validationHours').value = hours;
						break;
		    	case "select":
						if(stringSelection != null)
						{
							var selectionLength = Object.keys(objJsonMemoryKeyValues.settings[settingIndex].Selection).length;
							for(var i=0; i<selectionLength; i++)
							{
								if(objJsonMemoryKeyValues.settings[settingIndex].Selection[i] == stringSelection) break;
							}
							var selectionIndex = i;
							if(selectionIndex == jsonObj.value) document.getElementById(settingId).checked = true;
							else document.getElementById(settingId).checked = false;
						}
						break;
		    	case "bitmap"://TODO: handling of multiple outputs
			      if (parseInt(jsonObj.value) > 0) {
			        //document.getElementById(settingId).innerHTML = "State: On";
							document.getElementById(settingId).checked = true;
			      } else {
			        //document.getElementById(settingId).innerHTML = "State: Off";
							document.getElementById(settingId).checked = false;
			      }
						break;
					case "nounits":
						document.getElementById(settingId).value = jsonObj.value;
						break;
			    default:
			      console.log("Unhandled setting type in fetchSetting");
			  }
	    }
	  };
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.send(jsonString);
	}
	else console.log("Error: setting name not found during fetch");
}

function getSettingDefault(stringSettingName) {
	var settingIndex = getSettingIndex(stringSettingName);
	if (!isNaN(Number(settingIndex)))
	{
		var settingDefault = parseInt(objJsonMemoryKeyValues.settings[settingIndex].Default);
		var settingMultiplier = parseInt(objJsonMemoryKeyValues.settings[settingIndex].Multiplier);
		console.log("settingDefault: " + (settingDefault*settingMultiplier));
		return settingDefault*settingMultiplier;
	}
	else
	{
		console.log("Error: setting name not found when searching for default value");
		return 0;
	}
}

function getSettingMax(stringSettingName) {
	var settingIndex = getSettingIndex(stringSettingName);
	if (!isNaN(Number(settingIndex)))
	{
		var settingMax = parseInt(objJsonMemoryKeyValues.settings[settingIndex].Max);
		var settingMultiplier = parseInt(objJsonMemoryKeyValues.settings[settingIndex].Multiplier);
		return settingMax*settingMultiplier;
	}
	else
	{
		console.log("Error: setting name not found when searching for max value");
		return 0;
	}
}

function getSettingMin(stringSettingName) {
	var settingIndex = getSettingIndex(stringSettingName);
	if (!isNaN(Number(settingIndex)))
	{
		var settingMin = parseInt(objJsonMemoryKeyValues.settings[settingIndex].Min);
		var settingMultiplier = parseInt(objJsonMemoryKeyValues.settings[settingIndex].Multiplier);
		return settingMin*settingMultiplier;
	}
	else
	{
		console.log("Error: setting name not found when searching for min value");
		return 0;
	}
}

function getSettingMaxLen(stringSettingName) {
	var settingIndex = getSettingIndex(stringSettingName);
	if (!isNaN(Number(settingIndex)))
	{
		var settingMax = parseInt(objJsonMemoryKeyValues.settings[settingIndex].Max);
		var settingMultiplier = parseInt(objJsonMemoryKeyValues.settings[settingIndex].Multiplier);
		var settingMaxValue = settingMax*settingMultiplier;
		return settingMaxValue.toString().length;
	}
	else
	{
		console.log("Error: setting name not found when searching for max value length");
		return 0;
	}
}

function validateSettingValue(settingId) {
	var stringSettingName = document.getElementById(settingId).name;
	var settingIndex = getSettingIndex(stringSettingName);
	if (!isNaN(Number(settingIndex)))
	{
		var settingMaxValue = getSettingMax(stringSettingName);
		var settingMinValue = getSettingMin(stringSettingName);
		var settingMultiplier = parseInt(objJsonMemoryKeyValues.settings[settingIndex].Multiplier);
		var settingValue = document.getElementById(settingId).value;

		if(settingValue > settingMaxValue) settingValue = settingMaxValue;
		else if(settingValue < settingMinValue) settingValue = settingMinValue;
		else if((settingValue % settingMultiplier) != 0) settingValue = settingValue - (settingValue % settingMultiplier);
		document.getElementById(settingId).value = settingValue;//update HTML page value

		if(settingId == "validationHours")
		{
			var settingValue = parseInt(document.getElementById('validationHours').value) + parseInt(document.getElementById('validationDays').value*24);
			if(settingValue > settingMaxValue) settingValue = settingMaxValue;
			document.getElementById('validationDays').value = Math.floor(settingValue/24);
			document.getElementById('validationHours').value = (settingValue%24);
		}
		saveSetting(stringSettingName, settingValue);//save value to controller
	}
	else
	{
		alert("Error: setting name not found when validating value");
		return 0;
	}
}

/* notification slide out and in   ----------------------------------------------------- */
function animateNotification() {
  var slideout = document.getElementById('notif');
	slideout.classList.remove('visible');
	slideout.offsetWidth;
	slideout.classList.add('visible');
}


function listener(event) {
  var l = document.createElement("li");

  switch(event.type) {
    case "animationstart":
  //    l.textContent = `Started: elapsed time is ${event.elapsedTime}`;
      break;
    case "animationend":
    //  l.textContent = `Ended: elapsed time is ${event.elapsedTime}`;
        if(window.scrollX + document.querySelector('#notif').getBoundingClientRect().left == -450){
          var slideout = document.getElementById('notif');
          slideout.classList.remove('visible');
        }
      break;
    case "animationiteration":
      l.textContent = `New loop started at time ${event.elapsedTime}`;

      break;
  }

}

/* Common functions for all Opening function pages   ----------------------------------------------------- */



/* Open Door Warning and Opening Delay pages Turn ON and OFF Switch Button   ----------------------------------------------------- */
function hideContent(page) {

  switch (page) {
    case "openDoorWarning":
      if (document.getElementById('myCheckbox').checked == false) {
        document.getElementById('oContentHide').classList.add("hide");
        document.getElementById('ofHideBottom').classList.add("hide");
      } else {
        document.getElementById('oContentHide').classList.remove("hide");
        document.getElementById('ofHideBottom').classList.remove("hide");
      }
      break;
    case "openingDelay":
      if (document.getElementById('myCheckbox').checked == false) {
        document.getElementById('oContentHide').classList.add("hide");
        document.getElementById('ofHideBottom').classList.add("hide");
      } else {
        document.getElementById('oContentHide').classList.remove("hide");
        document.getElementById('ofHideBottom').classList.remove("hide");
      }
      break;
    default:
      console.log("Console log");
  }
}


/* Popup window   ----------------------------------------------------- */

function popupwindow(){

    if(document.getElementById('popup').classList.contains('hide')){
      document.getElementById('popup').classList.remove("hide");

    }else{
      document.getElementById('popup').classList.add("hide");

    }
}

/* Setting JSON definitions */
var stringJsonMemoryKeyValues = '{ \
  "settings": [ \
    { \
      "Name": "CF_AL_DOOPN_G1", \
      "Title": "Door open timeout", \
      "Description": "Door open timeout", \
      "Address": "0x88", \
      "BitPos": "0", \
      "Min": "1", \
      "Max": "120", \
			"Default": "6", \
      "Multiplier": "5", \
      "Units": "seconds" \
    }, \
    { \
      "Name": "CF_MSC3_ALDO", \
      "Title": "Door open warning", \
      "Description": "Enable/disable door open timeout", \
      "Address": "0xA4", \
      "BitPos": "0x04", \
      "Min": "0", \
      "Max": "1", \
			"Default": "1", \
      "Multiplier": "1", \
      "Units": "toggle" \
    }, \
    { \
      "Name": "CF_MSC3_ALIT", \
      "Title": "Intrusion Alarm", \
      "Description": "Enable/disable intrusion alarm", \
      "Address": "0xA4", \
      "BitPos": "0x02", \
      "Min": "0", \
      "Max": "1", \
			"Default": "1", \
      "Multiplier": "1", \
      "Units": "toggle" \
    }, \
    { \
      "Name": "CF_OUT_FLF_BASE", \
      "Title": "Output switch mode", \
      "Description": "Enable/disable output flipflop mode", \
      "Address": "0x7A", \
      "BitPos": "0", \
      "Min": "0", \
      "Max": "255", \
			"Default": "0", \
      "Multiplier": "1", \
      "Units": "bitmap" \
    }, \
    { \
      "Name": "CF_OUT_DUR_BASE", \
      "Title": "Output duration", \
      "Description": "Output duration", \
      "Address": "0x48", \
      "BitPos": "0", \
      "Min": "1", \
      "Max": "250", \
			"Default": "1", \
      "Multiplier": "1", \
      "Units": "seconds" \
    }, \
    { \
      "Name": "CF_OUT_DEL_BASE", \
      "Title": "Output delay", \
      "Description": "Output delay", \
      "Address": "0x58", \
      "BitPos": "0", \
      "Min": "0", \
      "Max": "250", \
			"Default": "1", \
      "Multiplier": "1", \
      "Units": "seconds" \
    }, \
    { \
      "Name": "CF_AL_ITDEL", \
      "Title": "Intrusion alarm delay", \
      "Description": "Intrusion alarm delay", \
      "Address": "0x97", \
      "BitPos": "0", \
      "Min": "0", \
      "Max": "240", \
			"Default": "1", \
      "Multiplier": "1", \
      "Units": "seconds" \
    }, \
    { \
      "Name": "CF_UNIT_ADR", \
      "Title": "Device address", \
      "Description": "Device address", \
      "Address": "0xA0", \
      "BitPos": "0", \
      "Min": "0", \
      "Max": "122", \
			"Default": "122", \
      "Multiplier": "1", \
      "Units": "nounits" \
    }, \
    { \
      "Name": "CF_OUT_SEC_BASE", \
      "Title": "Output security mode", \
      "Description": "Output security mode  (0=off, 1=3-eyes, 2=4-eyes and 3=2-Way-Authorization)", \
      "Address": "0x68", \
      "BitPos": "0", \
      "Min": "0", \
      "Max": "3", \
			"Default": "0", \
      "Multiplier": "1", \
      "Units": "select", \
			"Selection": [ \
				"OFF", \
				"3-EYES", \
				"4-EYES", \
				"2-WAY-AUTHORIZATION" \
			] \
    }, \
    { \
      "Name": "CF_OUT_CUT", \
      "Title": "Output security mode", \
      "Description": "Output duration cutoff (0=off, 1=local and 2=network)", \
      "Address": "0x7D", \
      "BitPos": "0", \
      "Min": "0", \
      "Max": "2", \
			"Default": "1", \
      "Multiplier": "1", \
      "Units": "select", \
			"Selection": [ \
				"OFF", \
				"LOCAL", \
				"NETWORK" \
			] \
    }, \
    { \
      "Name": "CF_TIMED_ACCESS", \
      "Title": "Access key validation", \
			"Description": "Value in hours for validity of Access cards", \
      "Address": "0x9B", \
      "BitPos": "0", \
      "Min": "0", \
      "Max": "240", \
			"Default": "0", \
      "Multiplier": "1", \
      "Units": "days&hours" \
    }, \
    { \
      "Name": "CF_OUT_CLEAR", \
      "Title": "Output clearance", \
      "Description": "Output clearance", \
      "Address": "0x7F", \
      "BitPos": "0", \
      "Min": "0", \
      "Max": "250", \
			"Default": "2", \
      "Multiplier": "100", \
      "Units": "Mseconds" \
    }, \
    { \
      "Name": "CF_MSC2_DRAWERM", \
      "Title": "Output drawer mode", \
      "Description": "Enable/disable drawer mode", \
      "Address": "0x78", \
      "BitPos": "0x80", \
      "Min": "0", \
      "Max": "255", \
			"Default": "0", \
      "Multiplier": "1", \
      "Units": "bitmap" \
    }, \
    { \
      "Name": "CF_MSC4_OUTSND", \
      "Title": "Output active sound", \
      "Description": "Enable/disable output active sound", \
      "Address": "0xA5", \
      "BitPos": "0x02", \
      "Min": "0", \
      "Max": "255", \
			"Default": "0", \
      "Multiplier": "1", \
      "Units": "bitmap" \
    }, \
    { \
      "Name": "CF_INP_ON_BM", \
      "Title": "Input sensor", \
      "Description": "Enable/disable input sensor", \
      "Address": "0x8C", \
      "BitPos": "0x03", \
      "Min": "0", \
      "Max": "255", \
			"Default": "0", \
      "Multiplier": "1", \
      "Units": "bitmap" \
    }, \
    { \
      "Name": "CF_INP_INV_BM", \
      "Title": "Input inversion", \
      "Description": "Enable/disable invert input sensor", \
      "Address": "0x90", \
      "BitPos": "0x03", \
      "Min": "0", \
      "Max": "255", \
			"Default": "0", \
      "Multiplier": "1", \
      "Units": "bitmap" \
    }, \
		{ \
      "Name": "CF_MISC_BUZZ", \
      "Title": "Device sound", \
      "Description": "Enable/disable device sound", \
      "Address": "0xA2", \
      "BitPos": "0x20", \
      "Min": "0", \
      "Max": "255", \
			"Default": "1", \
      "Multiplier": "1", \
      "Units": "bitmap" \
    }, \
    { \
      "Name": "CF_MSC4_EMER_OPEN", \
      "Title": "Emergency open", \
      "Description": "Enable/disable emergency open", \
      "Address": "0xA5", \
      "BitPos": "0x04", \
      "Min": "0", \
      "Max": "255", \
			"Default": "0", \
      "Multiplier": "1", \
      "Units": "bitmap" \
    }, \
    { \
      "Name": "CF_MSC4_INV_EMER_OPEN", \
      "Title": "Invert emergency open", \
      "Description": "Enable/disable inversion of emergency open", \
      "Address": "0xA5", \
      "BitPos": "0x08", \
      "Min": "0", \
      "Max": "255", \
			"Default": "0", \
      "Multiplier": "1", \
      "Units": "bitmap" \
    }, \
    { \
      "Name": "CF_OUT_INV_BASE", \
      "Title": "Output inversion", \
      "Description": "Enable/disable invert output logic", \
      "Address": "0x78", \
      "BitPos": "0", \
      "Min": "0", \
      "Max": "255", \
			"Default": "0", \
      "Multiplier": "1", \
      "Units": "bitmap" \
    } \
  ] \
}';
var objJsonMemoryKeyValues = JSON.parse(stringJsonMemoryKeyValues);

function getSettingIndex(settingName) {
	for(var i=0; i<Object.keys(objJsonMemoryKeyValues.settings).length; i++) {
		if(objJsonMemoryKeyValues.settings[i].Name == settingName)
			return i;
	}
	return "undefined";
}

$(document).on("mouseup", ".text-button-white-edit", function() {
  window.location.href = "/openingfeat.html";
});
	

