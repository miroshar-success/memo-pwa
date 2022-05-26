var filepath;
var fileUploadBusy = 0;
var numberOfFiles;
var fileCounter;

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

function setpath() {
    var default_path = document.getElementById("newfile").files[0].name;
    //document.getElementById("filepath").value = default_path;
	filepath = default_path;
	var fileNamesString = " ";
	var elementChooseFile = document.getElementById("IdChooseFile");
	for(var i=0;i<document.getElementById("newfile").files.length;i++)
	{
		fileNamesString = fileNamesString.concat(document.getElementById("newfile").files[i].name)
	}
	  if (document.getElementById("newfile").files.length < 2) {
    elementChooseFile.innerHTML = fileNamesString;
  } else {
    elementChooseFile.innerHTML = document.getElementById("newfile").files.length + " files selected";
  }
}

function sendFile() {
  var filePath = document.getElementById("newfile").files[fileCounter].name;
  var upload_path = "/upload/" + filePath;
  var fileInput = document.getElementById("newfile").files;
		//upload_path = "/upload/" + filePath;
		//fileInput = document.getElementById("newfile").files[i];
  /* Max size of an individual file. Make sure this
   * value is same as that set in WebServer.c */
  var MAX_FILE_SIZE = 3000*1024;
  var MAX_FILE_SIZE_STR = "3MB";

  if (fileInput.length == 0) {
      alert("No file selected!");
  } else if (filePath.length == 0) {
      alert("File path on server is not set!");
  } else if (filePath.indexOf(' ') >= 0) {
      alert("File path on server cannot have spaces!");
  } else if (filePath[filePath.length-1] == '/') {
      alert("File name not specified after path!");
  } else if (fileInput[fileCounter].size > MAX_FILE_SIZE) {
      alert("File size must be less than 3MB!");
  } else if (upload_path.split('.').pop() == 'bin'){
      document.getElementById("newfile").disabled = true;
      document.getElementById("uploadBtnID").disabled = true;

  var xhttp = new XMLHttpRequest();
  xhttp.overrideMimeType('text/plain; charset=x-user-defined-binary');
      xhttp.onreadystatechange = function() {
          if (xhttp.readyState == 4) {
              if (xhttp.status == 200) {
									fileCounter++;
									if(fileCounter === numberOfFiles)
									{
                  	//document.open();
                  	//document.write(xhttp.responseText + "...Please wait while the controller restarts...");
                  	//document.close();	
										restartController();	
										setTimeout(function(){
											location.reload();
										}, 10000); 									
									}
									else sendFile();//send next file								
              } else if (xhttp.status == 0) {
                  alert("Server closed the connection abruptly!");
                  location.reload()
              } else {
        console.log(xhttp.status + " Error!\n" + xhttp.responseText);
                  alert(xhttp.status + " Error!\n" + xhttp.responseText);
                  location.reload()
              }
          }
      };
 	 	const reader = new FileReader();
    	reader.onload = function(evt) {
    	console.log(evt.target.result);
      xhttp.send(evt.target.result);
    };
  	xhttp.open("POST", upload_path);
  	reader.readAsArrayBuffer(fileInput[fileCounter]);
  } else {
      document.getElementById("newfile").disabled = true;
      //document.getElementById("filepath").disabled = true;
      document.getElementById("uploadBtnID").disabled = true;

      var file = fileInput[fileCounter];
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (xhttp.readyState == 4) {
              if (xhttp.status == 200) {
									fileCounter++;
									if(fileCounter === numberOfFiles)
									{
                  	//document.open();
                  	//document.write(xhttp.responseText + "...Please wait while the controller restarts...");
                  	//document.close();	
										restartController();
										setTimeout(function(){
											location.reload();
										}, 5000); 									
									}
									else sendFile();//send next file		
              } else if (xhttp.status == 0) {
                  alert("Server closed the connection abruptly!");
                  location.reload();
              } else {
        console.log(xhttp.status + " Error!\n" + xhttp.responseText);
                  alert(xhttp.status + " Error!\n" + xhttp.responseText);
                  location.reload()
              }
          }
      };
      xhttp.open("POST", upload_path, true);
      xhttp.send(file);
	}	
}

function restartController() {
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/command");
	xhttp.send("esp_reboot");
}


$(document).on("mouseup", ".btn-upload", function() {
	numberOfFiles = document.getElementById("newfile").files.length;
	this.innerHTML = "Loading...";
  this.classList.add("disabled-button");
	fileCounter = 0;
	sendFile();
});

$(document).on("mouseup", ".btn-restart-controller", function() {
	restartController();
});

//$(document).ready(function(){
//  $('input').change(function () {
//    $('p').text(this.files[0].name );
//  });
//});

$(document).on("mouseup", ".text-button-white-edit", function() {
  window.location.href = "/index.html";
});
