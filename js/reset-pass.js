var socket;

//invoke function after page completely loaded
document.addEventListener('DOMContentLoaded', function() {
	openWebSocket();
}, false);

function startResetPassMode() {
	var postPath = "/command"
	var xhttp = new XMLHttpRequest();
  xhttp.open("POST", postPath, true);
 	xhttp.send("resetPass" + '\0');
}

function openWebSocket() {
	socket = new WebSocket("ws://192.168.4.1/ws");
	
	socket.onopen = function(e) {
		startResetPassMode();
		
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

function ws_parse_message(ws_message) {
		if(ws_message == "HaveMasterCard" || ws_message == "HaveSW1")
		{
			console.log("Received message: " + ws_message);	
			window.location.href = "/newpassword.html"	
		}		
}

$(document).on("mouseup", ".text-button-white-edit", function() {
	window.location.href = "/resetpass.html";
  });