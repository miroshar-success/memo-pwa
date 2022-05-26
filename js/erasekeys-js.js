var jsonObjKeyList;
//create Key list table with json data

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

$(document).ready(function() {
	showLoadingGif();
	getDeviceInfo();
  fetchKeyList();
  //jsonObjKeyList = jsonkeys;
  //showKeyList();
});

function showLoadingGif() {
	$('.screenLoader').show();
}

function hideLoadingGif() {
	$('.screenLoader').hide();
}

function showKeyList() {
  var table = document.getElementById("key-list-table");
  var entryType;
  var cardIndex;
  for (var i = 0; i < jsonObjKeyList.key_list.length; i++) {
    entryType = jsonObjKeyList.key_list[i].entry_type;
    cardIndex = jsonObjKeyList.key_list[i].index;
    if (entryType == "ps") {
      var cardSN = String(parseInt(jsonObjKeyList.key_list[i].card_sn));
      var cardType = getCardTypeFromOutputFlags(jsonObjKeyList.key_list[i].l_out, jsonObjKeyList.key_list[i].s_out);
    } else if (entryType == "mc") {
      var cardSN = String(parseInt(jsonObjKeyList.key_list[i].card_sn));
      var cardType = "System"
    } else if (entryType == "distributor") {
      var cardSN = String(parseInt(jsonObjKeyList.key_list[i].card_sn));
      var cardType = "Distributor"
    } else if (entryType == "programming") {
      var cardSN = String(parseInt(jsonObjKeyList.key_list[i].card_sn));
      var cardType = "Programming"
    } else if (entryType == "erase") {
      var cardSN = String(parseInt(jsonObjKeyList.key_list[i].card_sn));
      var cardType = "Erase"
    }

    var row = eval("row" + i + " = " + i);
    var cell1;
    var cell2;
    var cell3;

    if (entryType == "ps") {
      row = table.insertRow();
			cell1 = row.insertCell();
			cell2 = row.insertCell();
			cell3 = row.insertCell();

			cell1.innerHTML = '<td> <label class="labelClass" > <input id="' + cardSN + '" data-entryType="' + entryType + '" data-index="' + cardIndex + '" name="chk" type="checkbox"><span class="checkmark"></span></label></td>';
			//cell1.innerHTML = '<td> <label class="labelClass"> <input id="'+ cardSN +'" name="chk" type="checkbox"><span class="checkmark" ></span></label></td>';
			//cell1.id = cardSN;
			//var attributeEntryType = document.createAttribute("data-entryType");
			//var attributeIndex = document.createAttribute("data-index");
			//attributeEntryType = entryType;
			//attributeIndex = cardIndex;
			//cell1.setAttributeNode(attributeEntryType);
			//cell1.setAttributeNode(attributeIndex);
			cell2.innerHTML = '<td>' + cardType + ' Card</td>';
			cell3.innerHTML = '<td>' + cardSN + '</td>';
    } else {
    	row = table.insertRow(0);
		 	row.style.backgroundColor = "#343843";
      row.style.opacity = "0.3";
		 	cell1 = row.insertCell();
		 	cell2 = row.insertCell();
		 	cell3 = row.insertCell();

     	cell1.innerHTML = '<td> <label class="labelClass"> <input name="chk"><span class="checkmark disabled-button" ></span></label></td>';
		 	cell2.innerHTML = '<td>' + cardType + ' Card</td>';
		 	cell3.innerHTML = '<td>' + cardSN + '</td>';
    }

  }
}

var SPECOUT_SALON = 0x0001; //Special Output for Silent Alarm on
var SPECOUT_SALOFF = 0x0002; //Special Output for Silent Alarm off
var SPECOUT_GALOFF = 0x0004; //Special Output for General Alarm off ("Supervisor-card")
var SPECOUT_2WAYAUTH = 0x0008; //Special Output for 2-Way-Auth card
var SPECOUT_1DOVR = 0x0010; //Special Output for 1DoorOpen override ("994 + 995 = "local deco mode")
var SPECOUT_DOALOFF = 0x0020; //Special Output for Door Alarm off	(Cleaning mode) ("994 + 995 = "local deco mode")
var SPECOUT_DECOM = 0x0040; //Special Output for Deco-Mode
var SPECOUT_BLOCK = 0x0080; //Special Output for Blocking on/off
var SPECOUT_LIMACC = 0x0100; //Special Output for Limited Access
var SPECOUT_ALLOUTS = 0x0200; //Special Output zum Programmieren aller Outputs netzwerkweit

function getCardTypeFromOutputFlags(LocalOutputFlags, SpecialOutputFlags) {
  if (SpecialOutputFlags & SPECOUT_SALON) return "Silent Alarm ON";
  else if (SpecialOutputFlags & SPECOUT_SALOFF) return "Silent Alarm OFF";
  else if (SpecialOutputFlags & SPECOUT_GALOFF) return "Supervisor";
  else if (SpecialOutputFlags & SPECOUT_2WAYAUTH) return "2-Way-Authentication";
  else if (SpecialOutputFlags & SPECOUT_1DOVR && SpecialOutputFlags & SPECOUT_DOALOFF) return "Decoration";
  else if (SpecialOutputFlags & SPECOUT_DECOM) return "Deco Mode";
  else if (SpecialOutputFlags & SPECOUT_BLOCK) return "Output Block";
  else if (SpecialOutputFlags & SPECOUT_LIMACC) return "Limited Access";
  else if (LocalOutputFlags > 0) return "Access";
  else return "OTHER";
}

//delete button function
$(document).on("mouseup", ".btn-delete", function(e) {
  $(".popup, .overlay").hide();
  var jsonStringDeleteKeyList = JSON.stringify({
    "json_type": "deleteKeyList",
    "key_list": []
  });
  var jsonObjDeleteKeyList = JSON.parse(jsonStringDeleteKeyList);
  //var jsonDeleteKeyList =
  var ele = document.getElementsByName('chk');
  for (var i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      console.log("deleted Key " + ele[i].id + ele[i].getAttribute('data-entryType') + ele[i].getAttribute('data-index'));
      jsonObjDeleteKeyList['key_list'].push({
        "entry_type": ele[i].getAttribute('data-entryType'),
        "index": parseInt(ele[i].getAttribute('data-index'))
      });
      console.log(i);
      console.log(jsonObjDeleteKeyList);
    }
  }
  sendDeleteKeysList(JSON.stringify(jsonObjDeleteKeyList));
  //window.location.href = ('/erasekeys');
});

function sendDeleteKeysList(jsonStringKeyList) {
  var SettingsPath = "/settings";
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", SettingsPath, true);
  xhttp.responseType = 'text';
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log('Keys deleted');
      location.reload();
    }
  }
  console.log("sendList");
  console.log(jsonStringKeyList);
  xhttp.send(jsonStringKeyList);
}

function fetchKeyList() {
  var SettingsPath = "/keylist.txt";
  //var jsonString = JSON.stringify({"json_type": "fetchKeyList"});
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", SettingsPath, true);
  xhttp.responseType = 'text';
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //console.log(xhttp.responseText);
      jsonObjKeyList = JSON.parse(xhttp.responseText);
      hideLoadingGif();
      showKeyList();
      //console.log(jsonObjKeyList);
      //showKeyList(jsonObj);
    }
  }
  //xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
}

// $("#allchk").mouseup(function(){
//   console.log("all check mouseup");
//   selects();
// });

// $(document).on("mouseup", "#allchk", function(e) {
//   selects();
// });

$(document).on("mouseup", ".tbl-left-div", function(e) {
  selects();
});

function selects() {
  if (document.getElementById('allchk').checked) {
    var ele = document.getElementsByName('chk');
    for (var i = 0; i < ele.length; i++) {
      if (ele[i].type == 'checkbox')
        ele[i].checked = false;
    }
  } else {
    var ele = document.getElementsByName('chk');
    for (var i = 0; i < ele.length; i++) {
      if (ele[i].type == 'checkbox')
        ele[i].checked = true;
    }
  }
}



$(document).on('change', 'input[type=checkbox]', function() {
  var ele = document.getElementsByName('chk');
  var countChck = 0;
  for (var i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      countChck++;
    }

    // if (ele[i].checked) {
    //   document.getElementById('delteBtnId').classList.remove("disabled-button2");
    //   document.getElementById('delete-icon').src = "/delete-icon-red.svg";

    // } else {
    //   document.getElementById('delteBtnId').classList.add("disabled-button2");
    //   document.getElementById('delete-icon').src = "/delete-icon.svg";
    // }

  }

  if (countChck > 0) {
    document.getElementById('delteBtnId').classList.remove("disabled-button2");
    document.getElementById('delete-icon').src = "/delete-icon-red.svg";

  } else {
    document.getElementById('delteBtnId').classList.add("disabled-button2");
    document.getElementById('delete-icon').src = "/delete-icon.svg";
  }
  
});



$(document).ready(function() {
  $('.popup, .overlay').hide();
  $(".delete-btn").click(function() {
    $(".popup, .overlay").show();
  });
});

$(document).on("mouseup", ".overlay", ".btn-cancel", function(e) {
  $(".popup, .overlay").hide();
});

$(document).on("mouseup", ".btn-cancel", function(e) {
  $(".popup, .overlay").hide();
});

$(document).on("mouseup", ".close-popup-icon", function(e) {
  $(".popup, .overlay").hide();
});
$(document).on("mouseup", ".close", function(e) {
  $(".popup, .overlay").hide();
});

$(document).on("mouseup", ".text-button-white-edit", function() {
  window.location.href = "/index.html";
});

/* Network Pop-up close button */
function closeFunction(){
  var x = document.getElementById("notification-popup");
  if(x.style.display === "none"){
    x.style.display = "flex";
  } else{
    x.style.display = "none";
  }
}
