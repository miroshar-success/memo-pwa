//Global variables
var logState = 0;
var logStateCounter = 0;
var nextLogFileIndex = -1;
var oldestLogFileIndex = -1;
var logFileCount = -1;

var logFileReceivedCounter = 0;
var logFileReceivePending = 0;
var userFileReceived = 0;
var scrollYPos = 0;

var jsonusers = undefined;
var jsonlogs = undefined;

var timer_FSM;
var timer_inactivity;

$(document).ready(function() {
	//timer_FSM = setInterval(LogFSM_Task, 100, NULL);
	timer_FSM = setInterval(function() {
	// Call a function repetatively with 100mSecond interval
		LogFSM_Task();
	}, 500); //mSeconds update rate
	//timer_inactivity = setInterval(FSM_Timer, 1, NULL);
	timer_inactivity = setInterval(function() {
	// Call a function repetatively with 1Second interval
		FSM_Timer();
	}, 1000); //mSeconds update rate
});

function FSM_Timer()
{
	logStateCounter++;//increment timer used for state machine
}

function LogFSM_Task()
{
	switch(logState)
	{
		case 0://Initial loading state
			getDeviceInfo();
			showLoadingGif();
			getLogFileIndex(-1);//get the most recent working file of the logs
			getUserList();//Get user list 
			getLogFileParam();//get information about how many log files are stored in memory of device and next and oldest file index name
			logStateCounter = 0;//Reset timer
			logState++;
			break;
		case 1://Wait for all initial requests to finish
/*			if(logStateCounter > 20) //20 seconds inactivity check
			{
				logStateCounter = 0;//Reset timer
				location.reload();
			}*/
			if((nextLogFileIndex >= 0) && (oldestLogFileIndex >= 0) && (logFileCount >= 0) && (userFileReceived >= 1) && (jsonlogs != undefined))
			{//All content loaded
				logStateCounter = 0;//Reset timer
				logState++;
			}
			break;
		case 2://load next log file
			if((logFileCount >= 1))
			{
				getLogFileIndex(nextLogFileIndex - logFileReceivedCounter);//get the next most recent log file
				logStateCounter = 0;//Reset timer
				logState++;
			}
			else logState = 4;
			break;
		case 3://Wait for new log file
			if((logFileReceivePending == 0))
			{
				logStateCounter = 0;//Reset timer
				logState++;
			}			
			break;
		case 4://process and display logs
			logState++;
			processLogs();
			hideLoadingGif();	
			break;
		case 5://Wait until user scrolls to the nearly the bottom to load more logs
			console.log("state 5");
/*			scrollYPos = getYScrollPosition();
			if((scrollYPos > 100) && (logFileReceivedCounter < logFileCount)) logState = 2;*/
			break;
		default:
			console.log("log state invalid");
			break;
	}
	
}

function getLogFileIndex(fileIndex) {
	var sendPath;
	if(fileIndex >= 0) sendPath = "/log/log_file" + fileIndex + ".txt";//if less than zero get base log file
	else sendPath = "/log/log_file.txt";
	 
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", sendPath);
	xhttp.responseType = 'text';
  xhttp.onreadystatechange = function() {
  	if (this.readyState == 4 && this.status == 200) 
  	{//
  		logFileReceivePending = 0;
  		logFileReceivedCounter++;//increment the received log file counter, but not for base log file		
  		var jsonlogs_received = JSON.parse(xhttp.responseText);
  		if(jsonlogs == undefined) jsonlogs = jsonlogs_received;//If no logs in jsonlogs yet, assign it to the received logs
  		else
  		{
				jsonlogs.logs = jsonlogs_received.logs.concat(jsonlogs.logs);//else, append the older, just received logs, to the beginning of jsonlogs
			}
			console.log(jsonlogs);
		}
	}
	logFileReceivePending = 1;//set flag to wait for new log file
	xhttp.send();		
}

function getLogFileParam() {
	var sendPath = "/logParam";
	 
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", sendPath);
	xhttp.responseType = 'text';
  xhttp.onreadystatechange = function() {
  	if (this.readyState == 4 && this.status == 200) 
  	{//Parse received json and save the device log file parameters
  		var jsonLogParam = JSON.parse(xhttp.responseText);
			nextLogFileIndex = jsonLogParam.next_log_file_index;
			oldestLogFileIndex = jsonLogParam.oldest_log_file_index;
			logFileCount = jsonLogParam.log_file_count;
		}
	}
	xhttp.send();		
}

function getUserList() {
		var Path = "/userlist.txt";
		var xhttp = new XMLHttpRequest();
		xhttp.open("GET", Path, true);
		xhttp.responseType = 'text';
	  xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
				userFileReceived = 1;
				try {
					jsonusers = JSON.parse(xhttp.responseText);
				}
				catch (e) {
					console.log("no users");
				}
			}
		}
		xhttp.send();
}

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

function processLogs() 
{
	var container = document.getElementById("cardsContainerID");//Get element of where all the log grouped are stored
	var cardPlusHeadline = document.getElementById("atCardPlusHeadlineID");//Get headline element (where date is the title of a group of logs)
	var card = document.getElementById("atCardID");//Get group container element (where logs are grouped)
  var row = document.getElementById("atRowID");//Get element of log entry

  cardPlusHeadline.style.display = "none";//Hide fixed elements
  row.style.display = "none";//Hide fixed elements
  card.style.display = "none";//Hide fixed elements

  var activeCardPlusHeadlineClone = cardPlusHeadline.cloneNode(true);
  var cardClone = activeCardPlusHeadlineClone.querySelector("#atCardID").cloneNode(true);
  cardClone.style.display = "block";
  activeCardPlusHeadlineClone.style.display = "block";
  //activeCardPlusHeadlineClone.querySelector(".at-date").innerHTML = new Date((parseInt(jsonlogs.logs[0].DT) * 1000)).toLocaleDateString("en-US");
	logCount = jsonlogs.logs.length - 1;
  for (var i = logCount; i >= 0; i--) 
  {
		var activeMessage = convertLogMessage(i, jsonlogs.logs[i].LT);
    //var activeMessageDate = new Date((parseInt(jsonlogs.logs[i].DT) * 1000)).toLocaleDateString("en-US");//convert UNIX timestamp to milliseconds and then extract date
    //var activeMessageTime = new Date((parseInt(jsonlogs.logs[i].DT) * 1000)).toLocaleTimeString("en-US");//convert UNIX timestamp to milliseconds and then extract time 

    if (i === 0) 
    {//first log
      var rowClone = activeCardPlusHeadlineClone.querySelector("#atRowID").cloneNode(true);//clone log row in the active 
      rowClone.style.display = "block";

      //rowClone.querySelector(".at-label-time").innerHTML = activeMessageTime;
      rowClone.querySelector(".at-message").innerHTML = activeMessage;
      cardClone.appendChild(rowClone);
    } 
    else 
    {
      //var previousMessageDate = new Date((parseInt(jsonlogs.logs[i-1].DT) * 1000)).toLocaleTimeString("en-US");//convert UNIX timestamp to milliseconds and then extract date//jsonlogs.logs[i - 1].date.slice(0, 10); 
      //if (previousMessageDate === activeMessageDate) {
        var rowClone = activeCardPlusHeadlineClone.querySelector("#atRowID").cloneNode(true);
        rowClone.style.display = "block";

        //rowClone.querySelector(".at-label-time").innerHTML = activeMessageTime;
        rowClone.querySelector(".at-message").innerHTML = activeMessage;
        cardClone.appendChild(rowClone);
        if (i === jsonlogs.logs.length - 1) 
        {
         activeCardPlusHeadlineClone.appendChild(cardClone);
         container.appendChild(activeCardPlusHeadlineClone);
       	}
/*      } else {

        activeCardPlusHeadlineClone.appendChild(cardClone);
        container.appendChild(activeCardPlusHeadlineClone);

        activeCardPlusHeadlineClone = cardPlusHeadline.cloneNode(true);
        cardClone = activeCardPlusHeadlineClone.querySelector("#atCardID").cloneNode(true);

        cardClone.style.display = "block";
        activeCardPlusHeadlineClone.style.display = "block";
        activeCardPlusHeadlineClone.querySelector(".at-date").innerHTML = new Date((parseInt(jsonlogs.logs[i].DT) * 1000)).toLocaleDateString("en-US");//convert UNIX timestamp to milliseconds and then extract date

        var rowClone = activeCardPlusHeadlineClone.querySelector("#atRowID").cloneNode(true);
        rowClone.style.display = "block";

        rowClone.querySelector(".at-label-time").innerHTML = activeMessageTime;
        rowClone.querySelector(".at-message").innerHTML = activeMessage;
        cardClone.appendChild(rowClone);

        if (i === jsonlogs.logs.length - 1) {
         activeCardPlusHeadlineClone.appendChild(cardClone);
         container.appendChild(activeCardPlusHeadlineClone);
       }
      } */
    }
  }
}

function showLoadingGif() {
	$('.screenLoader').show();
}

function hideLoadingGif() {
	$('.screenLoader').hide();
}

$(document).on("mouseup", ".text-button-white-edit", function() {
  window.location.href = "/index.html";
});

/*
//Function to convert the endianess of the card SN
*/
function Dword2SN(str_SN)
{
	var numb_SN = parseInt(str_SN);//convert string to number
	var hexString = numb_SN.toString(16);//number to hex string
	var hexStringConverted = hexString.substring(6) + hexString.substring(4,6) + hexString.substring(2,4) + hexString.substring(0,2);//change endianness
	var numb_SN_converted = parseInt('0x' + hexStringConverted);
	return numb_SN_converted;
}

function getLogMessageParameters(logIndex, logType)
{
	var str_log_param = undefined;
	if(logType >= 1 && logType <= 15)
	{//key transaction
		str_log_param = getTransactionUserProfileParam(logIndex);
		if(str_log_param == undefined) return 'S/N:  ' + Dword2SN(jsonlogs.logs[logIndex].DW1);
		else return 'USER: ' + str_log_param
		 
	}
}

function isCardTypePs(cardType)
{
	if(cardType <= 0) return 0;
	else if(cardType >= 1 || cardType <= 15) return 1;
	else return 0;
}

function getTransactionUserProfileParam(logIndex)
{
	var cardType = undefined;
	var returnString;
	if(jsonlogs.logs[logIndex].DW2 != undefined)
	{//DW2 contains the card type in byte 1 and the PS index in the rest
		cardType = (jsonlogs.logs[logIndex].DW2 & 0xFF);//get card type
		if(isCardTypePs(cardType) == 1)
		{
			if(jsonlogs.logs[logIndex].firstname != undefined) returnString = ('\nName: ' + jsonlogs.logs[logIndex].firstname);
			if(jsonlogs.logs[logIndex].firstname != undefined) returnString += (' ' + jsonlogs.logs[logIndex].lastname);
			if(jsonlogs.logs[logIndex].firstname != undefined) returnString += ('PN: ' + jsonlogs.logs[logIndex].personellno);
			return returnString;
		}
		else return undefined;
	}	
}


function convertLogMessage(logIndex, logType)
{
  switch (logType) //Output depends on log type byte
  {
	      //----- Transaction group ----------------------------------------- ---------
	  case 1: //PIN transaction
				return 'PIN transaction' + getLogMessageParameters(logIndex, logType);
	  case 2: //chip key transaction
	      return 'Chip key transaction' + getLogMessageParameters(logIndex, logType);
	  case 3: //Special output by PIN detected
	      return 'Special output by PIN detected' + getLogMessageParameters(logIndex, logType);
	  case 4: //Special output by chip key detected
	      return 'Special output by chip key detected' + getLogMessageParameters(logIndex, logType);
	  case 8: //invalid PIN
	      return 'invalid PIN' + getLogMessageParameters(logIndex, logType);
	  case 9: //Invalid chip key
	      return 'Invalid chip key' + getLogMessageParameters(logIndex, logType);
	  case 10: //Invalid lock entered for PIN
	      return 'Invalid lock entered for PI' + getLogMessageParameters(logIndex, logType);
	  case 11: //Invalid lock entered for chip key
	      return 'Invalid lock entered for chip key' + getLogMessageParameters(logIndex, logType);  
    	//----- Programming group ----------------------------------------- ---------
	  case 16: //PIN programmed
	      return 'PIN programmed';
	  case 17: //chip key programmed
	      return 'Chip key programmed';
	  case 18: //PIN programmed with spec. output
	      return 'PIN programmed with spec. output';
	  case 19: //Chip key programmed with spec. output
	      return 'Chip key programmed with spec. output';
	  case 24: //ID-memory full - PIN programming refused
	      return 'ID-memory full - PIN programming refused';
	  case 25: //ID-memory full - Chip key programming refused
	      return 'ID-memory full - Chip key programming refused';
	      //----- ID-memory erasing group -------------------------------------- ------
	  case 32: //1 PIN for single lock erased
	      return '1 PIN for single lock erased';
	  case 33: //1 chip key for single lock erased
	      return '1 chip key for single lock erased';
	  case 34: //1 PIN for all locks erased
	      return '1 PIN for all locks erased';
	  case 35: //1 chip key for all locks erased
	      return '1 chip key for all locks erased';
	  case 36: //All ID's for 1 lock erased
	      return 'All IDs for 1 lock erased';
	  case 37: //ID-memory entry erased by index
	      return 'ID-memory entry erased by index';
	  case 38: //Entire ID-memory erased
	      return 'Entire ID-memory erased';
	      //----- Security logging for switching-units group -------------------------
	  case 48: //intrusion alarm
	      return 'Intrusion alarm';
	  case 49: //1door-only alarm
	      return '1door-only alarm';
	  case 50: //door-open warning
	      return 'Door-open warning';
	  case 51: //Door open/close
	      return 'Door open/close';
	  case 52: //alarm input
	      return 'Alarm input';
	      //----- Security logging for alarm-unit group ------------------------------
	  case 64: //Intrusion alarm out
	      return 'Intrusion alarm out';
	  case 65: //silent alarm out
	      return 'Silent alarm out';
	  case 66: //sabotage alarm out
	      return 'Sabotage alarm out';
	  case 67: //bus configuration error out
	      return 'Bus configuration error out';
	  case 68: //Any door open out
	      return 'Any door open out';
	  case 69: //Door open warning out
	      return 'Door open warning out';
	  case 70: //bus blocking out
	      return 'Bus blocking out';
	  case 71: //Deco-mode enable
	      return 'Deco-mode enable';
	  case 72: //Deco mode
	      return 'Deco mode';
	      //----- Alarm-unit bootup/1st bootup group -------------------------------
	  case 80: //New event-log started
	      return 'New event-log started';
	  case 81: //Keypad orientation detected
	      return 'Keypad orientation detected';
	  case 82: //RTC set during 1st bootup
	      return 'RTC set during 1st bootup';
	  case 83: //Number of mastercards stored
	      return 'Number of mastercards stored';
	  case 84: //Mastercard stored
	      return 'Mastercard stored';
	  case 86: //Device S/N stored
	      return 'Device S/N stored';
	  case 87: //max. number of locks stored
	      return 'max. number of locks stored';
	  case 88: //Configuration data changed during 1st bootup
	      return 'Configuration data changed during 1st bootup';
	  case 89: //Program card stored
	      return 'Program card stored';
	  case 94: //1st bootup successful
	      return '1st bootup successful';
	  case 95: //normal bootup ok
	      return 'Normal bootup ok';
      //----- HW-test logging group -------------------------------------- --------
	  case 96: //Lock test finished
	      return 'Lock test finished';
	  case 97: //Sensor test finished
	      return 'Sensor test finished';
	  case 98: //Hand terminal test finished
	      return 'Hand terminal test finished';
	  case 99: //alarm test finished
	      return 'Alarm test finished';
	  case 100: //Rotary switch test finished
	      return 'Rotary switch test finished';
	  case 103: //Bus load display
	      return 'Bus load display';
	  case 104: //Keycard reporter
	      return 'Keycard reported';
	      //----- System admin logging group --------------------------------------- -
	  case 112: //RTC set by user
	      return 'RTC set by userd';
	  case 113: //Configuration data changed by user
	      return 'Configuration data changed by user';
	  case 114: //ID memory dumped
	      return 'ID memory dumped';
	  case 115: //Event-log erased & new event-log started by user
	      return 'Event-log erased & new event-log started by user';
	  case 116: //event log dumped
	      return 'Event log dumped';
	  case 117: //System card erased
	      return 'System card erased';
	  case 118: //System card programmed
	      return 'System card programmed';
	  case 119: //Set configuration defaults
	      return 'Set configuration defaults';
	  case 120: //HIF PIN altered
	      return 'HIF PIN altered';
	  case 121: //application unlocked
	      return 'Application unlocked';
	  case 122: //Application locked
	      return 'Application locked';
	      //----- Error logging group ---------------------------------------- --------
	  case 128: //Clock forced to Sun, 2012-01-01 00:00:00
	      return 'Clock forced to Sun, 2012-01-01 00:00:00';
	  case 129: //Log flash write address unvalid
	      return 'Log flash write address unvalid';
	  default:
	      break;
  }
}