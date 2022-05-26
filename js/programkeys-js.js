var SettingRangeStart = "72",
  SettingRangeEnd = "87";

var presentedCards = 0;
var programcards_path = "/programcards";

var socket;
var cardsJson;
var newCard;
var interval_prog_time ;
var socketOpened = 0;

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

function startActivationMode() {
		var xhttp = new XMLHttpRequest();
  	xhttp.open("POST", programcards_path, true);
 		xhttp.send();
	//openWebSocket();
  //var command_path = "/programcards";
  //var xhttp_programming = new XMLHttpRequest();

  //xhttp_programming.open("POST", command_path, true);
  //xhttp_programming.send();1276198560
  
}

function openWebSocket() {
	socket = new WebSocket("ws://192.168.4.1/ws");
	
	socket.onopen = function(e) {
		socketOpened = 1;
		
		/*
		setInterval(function() {
		  // Call a function repetatively with 2 Second interval
		  getServerValue("Programming_time");
			//getServerValue("Write_request");
		}, 500); //mSeconds update rate
		*/
		console.log("socket opened!");
	};

	socket.onmessage = function(event) {
			//console.log(event.data);
			//console.log("message received");
			//console.log(event.data);
			ws_parse_message(event.data);
	};
	
	socket.onclose = function(event) {
		socketOpened = 0;
	  if (event.wasClean) {
	    //alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
	  } else {
	    // e.g. server process killed or network down
	    // event.code is usually 1006 in this case
	    //alert('[close] Connection died');
	  }
	};
	
	socket.onerror = function(error) {
	  //alert(`[error] ${error.message}`);
		console.log(error.message);
	};
}

function getServerValue(key) {
	if(socketOpened == 1) socket.send(key);
}

function ws_parse_message(ws_message) {
	const parsedJson = JSON.parse(ws_message);
	if(parsedJson.json_type == "simple")
	{
		Object.keys(parsedJson).forEach(function(key) {
			if(key == "Programming_time")
			{
				console.log("programming time received" + parsedJson.Programming_time);
				if(parsedJson.Programming_time != "Undefined" && (!(isNaN(parsedJson.Programming_time))))
				{
					document.getElementById('timeId').innerHTML = parsedJson.Programming_time + " seconds remaining";
					
					if(parseInt(parsedJson.Programming_time) <= 0)
					{
						checkNumberPresentedCards();
			      //undisable buttons
      			document.getElementById("btnAddCardId").classList.remove("disabled-button");
      			document.getElementById("btnDoneId").classList.remove("disabled-button");

						clearInterval(interval_prog_time);
					}
				}			
			}		
		});
	}
	else if(parsedJson.json_type == "cards")
	{
		newCard = 1;
		cardsJson = parsedJson;
  	document.getElementById("typeid").innerHTML = getCardType(cardsJson.card[0].type) + " Card SN: " //myjson.card[0].type;
    document.getElementById("snid").innerHTML = cardsJson.card[0].sn;
		animateNotification();
		updatePresentedCards();
	}
}

function getCardType(cardType)
{
	if(cardType == 1) return "Access";
	else if(cardType == 2) return "System";
	else if(cardType == 3) return "Distributor";
	else if(cardType == 4) return "Programming";
	else if(cardType == 5) return "Erase";
	else if(cardType == 12) return "Supervisor";
	else if(cardType == 13) return "Decoration";
	else if(cardType == 19) return "2-Way-Auth";
	else return "Undefined";
}

function updatePresentedCards() {
  presentedCards = localStorage.getItem("presentedCards");
	console.log(presentedCards);
	presentedCards++;
	/*
  presentedCards_int = parseInt(presentedCards);
	presentedCards_int++;
	presentedCards = toString(presentedCards_int);
	*/
	console.log(presentedCards);
  localStorage.setItem("presentedCards", presentedCards);
  document.getElementById("presentedCardsID").innerHTML = "Presented Cards: " + presentedCards;
}

//window.onload = getSettingRange(SettingRangeStart, SettingRangeEnd);

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
      jsonParseData
      console.log(xhttp.responseText)
    }
  };
  xhttp.open("GET", "/settingrange/" + Start + "-" + End, true);
  xhttp.send();
}

/* notification slide out and in   ----------------------------------------------------- */
function animateNotification() {
  var slideout = document.getElementById('notif');
	slideout.classList.remove('visible');
	slideout.offsetWidth;
	slideout.classList.add('visible');
  //slideout.classList.toggle('visible');
}

//invoke function after page completely loaded
document.addEventListener('DOMContentLoaded', function() {
	openWebSocket();
  if (document.getElementById('stepperBottomID')) {
    changeProgrammKeysPage("onLoadPage");
  }
}, false);

//update programmkeys Page
function changeProgrammKeysPage(status) {

  switch (status) {
    case "onLoadPage":
      document.getElementById('stepperBottomID').classList.add("hide");
      document.getElementById('timeId').classList.add("hide");
      document.getElementById('idTimeExpiredHeaderText').classList.add("hide");
      document.getElementById('stepperContentText').classList.add("hide");

      
      break;
    case "startProgramming":
			startActivationMode();
		  document.getElementById('idBtnStartProgramming').classList.add("hide");
		  document.getElementById('stepperBottomID').classList.remove("hide");
		  document.getElementById('idStartProgrammingHeaderText').classList.add("hide");
		  document.getElementById('stepperImageID').classList.add("hide");
		  document.getElementById('timeId').classList.remove("hide");
		  document.getElementById('stepperContentText').classList.remove("hide");
		
		  localStorage.setItem("presentedCards", "0");
			console.log("startedProgramming");
		  //disable buttons
		  document.getElementById("btnAddCardId").classList.add("disabled-button");
		  document.getElementById("btnDoneId").classList.add("disabled-button");
		  var span = document.getElementById('timeId');
			interval_prog_time = setInterval(function() {
			  // Call a function repetatively with 2 Second interval
			  getServerValue("Programming_time" + '\0');
				//getServerValue("Write_request");
			}, 500); //mSeconds update rate
		  //var countdown = new Countdown(span, 5);
		  //countdown.start();
		  break;
    case "done":
      document.getElementById('timeId').classList.add("hide");
      document.getElementById('stepperImageID').classList.remove("hide");
      document.getElementById('stepperImageID').src = "/successful-programmed.svg";
      document.getElementById('stepperTitleId').innerHTML = 'Programming Successfully Finished';
      document.getElementById('btnDoneId').onclick = function() {
        changeProgrammKeysPage('completelyDone');
      };
      document.getElementById('stepperContentText').classList.add("hide");
			//sendCommand('closeSocket');

      break;
    case "completelyDone":
      document.getElementById('btnDoneId').href = "/index.html"
      localStorage.setItem("presentedCards", "0");
			sendCommand('closeSocket');
      break;
    case "noKeys":
      document.getElementById('stepperContentText').classList.add("hide");
      document.getElementById('idTimeExpiredHeaderText').classList.remove("hide");
      document.getElementById('stepperImageID').classList.remove("hide");
      document.getElementById('stepperImageID').src = "/time-expired.svg";

      document.getElementById('btnDoneId').onclick = function() {
        changeProgrammKeysPage('completelyDone');
      }
      break;
    default:
      console.log("Console log");
  }
}

function sendCommand(command) {
  var command_path = "/command";
  var xhttp = new XMLHttpRequest();

  xhttp.open("POST", command_path, true);
  xhttp.send(command);
}

function checkNumberPresentedCards() {
  if (localStorage.getItem("presentedCards") == 0) {
    changeProgrammKeysPage('noKeys');
  } else {
    changeProgrammKeysPage('done');
  }
}

$(document).on("mouseup", ".text-button-white-edit", function() {
	window.location.href = "/index.html";
  });