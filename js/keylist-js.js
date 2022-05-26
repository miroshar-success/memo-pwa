var presentedCards = 0;
var programcards_path = "/programcards";

var socket;
var cardsJson;
var newCard;
var interval_prog_time ;
var socketOpened = 0;

// Data is cached in the popup window
let deleteKeyList = [];
let unassignKeyList = [];
var activeUserID;
let activeKeyListIDs = [];
let activeAccordionElement;

var activeFirstName;
var activeLastName;
var activeGender;
var activeBrand;
var activeDepartment;
var activePersonnelNo;

var scrollPosition;

var jsonusers;
var jsonkeys;

$(document).ready(function() {
	getDeviceInfo();
	showLoadingGif();
	fetchKeyList();
	openWebSocket();
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

function showLoadingGif() {
	$('.screenLoader').show();
}

function hideLoadingGif() {
	$('.screenLoader').hide();
}

/*
function sendDeleteKeysList(jsonStringKeyList) {
		var SettingsPath = "/settings";
		var xhttp = new XMLHttpRequest();
		xhttp.responseType = 'text';
		xhttp.setRequestHeader("Content-Type", "application/json");
		console.log("sendList");
		console.log(jsonStringKeyList);
		xhttp.send(jsonStringKeyList);	
}
*/
function fetchUserList() {
		var Path = "/userlist.txt";
		//var jsonString = JSON.stringify({"json_type": "fetchKeyList"});
		var xhttp = new XMLHttpRequest();
		xhttp.open("GET", Path, true);
		xhttp.responseType = 'text';
	  xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
				//console.log(xhttp.responseText);
				try {
					jsonusers = JSON.parse(xhttp.responseText);
				}
				catch (e) {
					/*
					var stringJsonUsersEmpty = '{ \
					  "user": [ \
					    { \
					      "id": "", \
					      "firstname": "", \
					      "lastname": "", \
					      "gender": "", \
					      "brand": "", \
					      "department": "", \
					      "personellno": "", \
								"keys": [] \
					    } \
					  ] \
					}'; 
					*/
					//jsonusers = JSON.parse(stringJsonUsersEmpty);
					console.log("no users");
				}
				hideLoadingGif();
				processUsersAndKeys();
			}
				//showKeyList();
				//console.log(jsonObjKeyList);
				//showKeyList(jsonObj);
		}
		//xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.send();
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
				jsonkeys = JSON.parse(xhttp.responseText);
				fetchUserList();
				//processUsersAndKeys();
				//showKeyList();
				//console.log(jsonObjKeyList);
				//showKeyList(jsonObj);
			}
		}
		//xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.send();
}

function addUserToList() {
	if(jsonusers != undefined && jsonusers.user.length > 0) {
		nextUserId = jsonusers.user.length;
		jsonusers["user"].push({
      "id": nextUserId,
      "firstname": activeFirstName,
      "lastname": activeLastName,
      "gender": activeGender,
      "brand": activeBrand,
      "department": activeDepartment,
      "personellno": activePersonnelNo,
      "keys": activeKeyListIDs
    });
		jsonusers.json_type = "user_list";
	}
	else 
	{
		nextUserId = 0;
		var stringJsonUsersEmpty = '{ \
		  "user": [ \
		    { \
		      "id": "", \
		      "firstname": "", \
		      "lastname": "", \
		      "gender": "", \
		      "brand": "", \
		      "department": "", \
		      "personellno": "", \
					"keys": [] \
		    } \
		  ] \
		}'; 
		jsonusers = JSON.parse(stringJsonUsersEmpty);
		jsonusers.user[0].id = nextUserId;
		jsonusers.user[0].firstname = activeFirstName;
		jsonusers.user[0].lastname = activeLastName;
		jsonusers.user[0].gender = activeGender;
		jsonusers.user[0].brand = activeBrand;
		jsonusers.user[0].department = activeDepartment;
		jsonusers.user[0].personellno = activePersonnelNo;
		jsonusers.user[0].keys = activeKeyListIDs;
		
		jsonusers.json_type = "user_list";
	}
	console.log(jsonusers);
	//stringJsonUsers = JSON.stringify(jsonusers);
}

function sendUserList() {
	var Path = "/upload/userlist.txt";
	jsonusers.json_type = "user_list";
	var stringJsonUsers = JSON.stringify(jsonusers);
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", Path, true);
	xhttp.responseType = 'text';
	xhttp.setRequestHeader("Content-Type", "application/json");
	console.log("sendUserList");
	xhttp.send(stringJsonUsers);		
}

function sendKeyList() {
	var Path = "/upload/keylist.txt";
	//jsonkeys.json_type = "key_list";
	var stringJsonKeys = JSON.stringify(jsonkeys);
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", Path, true);
	xhttp.responseType = 'text';
	xhttp.setRequestHeader("Content-Type", "application/json");
	console.log("sendKeyList");
	xhttp.send(stringJsonKeys);			
}

function processUsersAndKeys() {
	//Delete the exisiting entris in the key and users list
	//var list = document.querySelectorAll('[id*="accordion-element"][style="display: block;"]');//
	var userKeyList = document.getElementById("accordionListId");
	var list = userKeyList.querySelectorAll('[style*="block"]');//get list of all visible elements
	for(var i=0;i<list.length;i++)
	{
		list[i].remove();
	}
	
	var tableElem = document.getElementById("accordion-element");
  var tableElemNoOwner = document.getElementById("accordion-element-no-owner");
/*  var tableElemSpecialCard = document.getElementById("accordion-element-special-card");*/
  var list = document.getElementById("keyListDetailsID");
  var listElem = document.getElementById("keyListElemDetailsID");

	var assignedKeys = [];

  tableElem.style.display = "none";
  tableElemNoOwner.style.display = "none";
/*  tableElemSpecialCard.style.display = "none";*/

	if(jsonusers != undefined && jsonusers.user.length > 0) {
	  for (var i = 0; i < jsonusers.user.length; i++) {
		    var rowClone = tableElem.cloneNode(true);
		    rowClone.style.display = "block";
				//rowClone.querySelector("#accordion-element").setAttribute("title", "clone");
		    rowClone.querySelector(".accordion-headline").setAttribute("name", jsonusers.user[i].id);
		    rowClone.querySelector(".key-details-list").name = jsonusers.user[i].keys;
		
		    rowClone.querySelector("#firstNameID").innerHTML = jsonusers.user[i].firstname;
		    rowClone.querySelector("#lastNameID").innerHTML = jsonusers.user[i].lastname;
		    rowClone.querySelector("#genderID").innerHTML = jsonusers.user[i].gender;
		    rowClone.querySelector("#brandID").innerHTML = jsonusers.user[i].brand;
		    rowClone.querySelector("#departmentID").innerHTML = jsonusers.user[i].department;
				rowClone.querySelector("#personnelNoID").innerHTML = jsonusers.user[i].personellno;
		    rowClone.querySelector("#keyListElemDetailsID").style.display = "none";
		    for (var j = 0; j < jsonusers.user[i].keys.length; j++) {
					assignedKeys.push(jsonusers.user[i].keys[j]);//Save the id of the keys which are assigned
		      for (var k = 0; k < jsonkeys.key_list.length; k++) {//for each key in key list
						if(jsonkeys.key_list[k].entry_type == "ps") 
						{//check if it is a ps entry (one with output permissions)
			        if (jsonusers.user[i].keys[j] == jsonkeys.key_list[k].index) 
			        {//Add key under this user
			          var keyDetailsRowClone = listElem.cloneNode(true);
			          keyDetailsRowClone.querySelector("#typeID").innerHTML = getCardTypeFromOutputFlags(jsonkeys.key_list[k].l_out, jsonkeys.key_list[k].s_out);
			          keyDetailsRowClone.querySelector("#snID").innerHTML = parseInt(jsonkeys.key_list[k].card_sn).toString();
			          keyDetailsRowClone.style.marginBottom = "10px";
			          rowClone.querySelector("#keyListDetailsID").appendChild(keyDetailsRowClone);
			        }
						}
		      }
		    }
		    document.getElementById('accordionListId').appendChild(rowClone);
			}
		}
		for (var i = 0; i < jsonkeys.key_list.length; i++) {
			var keyIdFound = undefined;
			if(jsonkeys.key_list[i].entry_type == "ps") {//check if it is a ps entry (one with output permissions)
				keyIdFound = assignedKeys.find(element => element == jsonkeys.key_list[i].index);
			}
			if(keyIdFound == undefined)	
			{//Either no user assigned or a special card
	      var rowClone = tableElemNoOwner.cloneNode(true);
	      rowClone.style.display = "block";
	      rowClone.querySelector("#snID").innerHTML = parseInt(jsonkeys.key_list[i].card_sn);	
				if(jsonkeys.key_list[i].entry_type == 'mc') rowClone.querySelector("#typeID").innerHTML = 'System Card', rowClone.style.opacity = "0.3";
				else if (jsonkeys.key_list[i].entry_type == 'distributor') rowClone.querySelector("#typeID").innerHTML = 'Distributor Card', rowClone.style.opacity = "0.3";
				else if (jsonkeys.key_list[i].entry_type == 'programming') rowClone.querySelector("#typeID").innerHTML = 'Programming Card', rowClone.style.opacity = "0.3";
				else if (jsonkeys.key_list[i].entry_type == 'erase') rowClone.querySelector("#typeID").innerHTML = 'Erase Card', rowClone.style.opacity = "0.3";
				else if (jsonkeys.key_list[i].entry_type == 'ps') rowClone.querySelector("#typeID").innerHTML = getCardTypeFromOutputFlags(jsonkeys.key_list[i].l_out, jsonkeys.key_list[i].s_out);
				if(jsonkeys.key_list[i].entry_type != 'ps')
				{
					rowClone.querySelector(".acc-checkbox").disabled = true;
					rowClone.classList.add("disabled-accordion");
					rowClone.style.backgroundColor = "#343843";
				} 
				document.getElementById('accordionListId').appendChild(rowClone);	
			}
		}
}

function deleteUserKeyList() {
	document.getElementById("accordionListId").remove();
  //document.getElementById("accordion-element-no-owner").remove();
	//document.getElementsByTagName("tag-accordion-element").remove();
}

var SPECOUT_SALON = 0x0001;			//Special Output for Silent Alarm on
var SPECOUT_SALOFF = 0x0002;		//Special Output for Silent Alarm off
var SPECOUT_GALOFF = 0x0004;		//Special Output for General Alarm off ("Supervisor-card")
var SPECOUT_2WAYAUTH = 0x0008;		//Special Output for 2-Way-Auth card
var SPECOUT_1DOVR = 0x0010;			//Special Output for 1DoorOpen override ("994 + 995 = "local deco mode")
var SPECOUT_DOALOFF = 0x0020;		//Special Output for Door Alarm off	(Cleaning mode) ("994 + 995 = "local deco mode")
var SPECOUT_DECOM = 0x0040;			//Special Output for Deco-Mode
var SPECOUT_BLOCK = 0x0080;			//Special Output for Blocking on/off
var SPECOUT_LIMACC = 0x0100;			//Special Output for Limited Access
var SPECOUT_ALLOUTS = 0x0200;		//Special Output zum Programmieren aller Outputs netzwerkweit

function getCardTypeFromOutputFlags(LocalOutputFlags, SpecialOutputFlags) {
	if(SpecialOutputFlags & SPECOUT_SALON) return "Silent Alarm ON";
	else if(SpecialOutputFlags & SPECOUT_SALOFF) return "Silent Alarm OFF";
	else if(SpecialOutputFlags & SPECOUT_GALOFF) return "Supervisor";
	else if(SpecialOutputFlags & SPECOUT_2WAYAUTH) return "2-Way-Authentication";
	else if(SpecialOutputFlags & SPECOUT_1DOVR && SpecialOutputFlags & SPECOUT_DOALOFF) return "Decoration";
	else if(SpecialOutputFlags & SPECOUT_DECOM) return "Deco Mode";
	else if(SpecialOutputFlags & SPECOUT_BLOCK) return "Output Block";
	else if(SpecialOutputFlags & SPECOUT_LIMACC) return "Limited Access";
	else if(LocalOutputFlags > 0) return "Access";
	else return "OTHER";
}

//create Key list table with json data-------------------------------------------
/*$(document).ready(function() {
	//fetchUserList();
	fetchKeyList();
	openWebSocket();
});*/
//----------------------------------------------------------------------------

//Slect a checkbox in order to delete Keys---------------------------------------
$(document).on("mouseup", ".btn-delete", function(e) {
  $(".popup-edit-profil, .overlay").hide();

  var ele = document.getElementsByName('chk');
  for (var i = 0; i < ele.length; i++) {
    if (ele[i].checked) {

    }
  }
});

function selects() {
  if (!document.getElementById('allchk').checked) {
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
  }

//   if (countChck > 0) {
//     document.getElementById('delteBtnId').classList.remove("disabled-button2");
//     document.getElementById('delete-icon').src = "img/delete-icon-red.svg";

//   } else {
//     document.getElementById('delteBtnId').classList.add("disabled-button2");
//     document.getElementById('delete-icon').src = "img/delete-icon.svg";
//   }

});
//--------------------------------------------------------------------------------

//hide all three popup windows after the document has loaded
$(document).ready(function() {  
  var tableElem = document.getElementById("accordion-element");
  var tableElemNoOwner = document.getElementById("accordion-element-no-owner");

  tableElem.style.display = "none";
  tableElemNoOwner.style.display = "none";
  $('.popup-edit-profil, .overlay').hide();
  $('.popup-edit-keys, .overlay').hide();
  $('.popup-add-profil, .overlay').hide();

});
//------------------------------------------------------------------------------

//many ways to close popup window in the same the cashe is emtied--------------
$(document).on("mouseup", ".overlay", function(e) {
  removeOverlay();
  removeOverlayEditKeys();
  removeOverlayAddUser();
  deleteKeyList = [];
  unassignKeyList = [];
  activeKeyListIDs = [];

  activeFirstName = "";
  activeLastName = "";
  activeGender = "";
  activeBrand = "";
  activeDepartment = "";
  activePersonnelNo = "";
});

$(document).on("mouseup", ".btn-cancel", function(e) {
  removeOverlay();
  deleteKeyList = [];
  unassignKeyList = [];
  activeKeyListIDs = [];

  activeFirstName = "";
  activeLastName = "";
  activeGender = "";
  activeBrand = "";
  activeDepartment = "";
  activePersonnelNo = "";
});

$(document).on("mouseup", ".btn-cancel-addUser", function(e) {
  removeOverlayAddUser();

  activeFirstName = "";
  activeLastName = "";
  activeGender = "";
  activeBrand = "";
  activeDepartment = "";
  activePersonnelNo = "";
});

$(document).on("mouseup", ".btn-cancel-keys", function(e) {
  removeOverlayEditKeys();
  deleteKeyList = [];
  unassignKeyList = [];
  activeKeyListIDs = [];


});
$(document).on("mouseup", ".close-popup-icon", function(e) {
  deleteKeyList = [];
  unassignKeyList = [];
  activeKeyListIDs = [];
  removeOverlay();
  removeOverlayEditKeys();
  removeOverlayAddUser();
  activeFirstName = "";
  activeLastName = "";
  activeGender = "";
  activeBrand = "";
  activeDepartment = "";
  activePersonnelNo = "";
});
//-------------------------------------------------------------------------------

function child(event) {
  event.stopPropagation();
  console.log("Child clicked");
}

//expand or collapse Table row--------------------------------------------------
function openCloseTable(event) {
  var arrowImg = $(this).parent().find('img')[0];
  this.classList.add("active2");

  var panel = this.nextElementSibling;

  //var panel = this.nextElementSibling;
  if (panel.style.display === "block") {
    arrowImg.classList.remove('rotateOpenAnimation');
    arrowImg.classList.add('rotateCloseAnimation');
    panel.style.display = "none";
  } else {
    arrowImg.classList.remove('rotateCloseAnimation');
    arrowImg.classList.add('rotateOpenAnimation');
    panel.style.display = "block";
  }
}

$(document).on("mouseup", ".accordion-header-container", function() {
  $(this)[0].querySelector(".acc-checkbox").addEventListener("click", child);
  $(this)[0].addEventListener("click", openCloseTable);
});

/*$(document).on("mouseup", ".accordion-header-container-2", function() {
  $(this)[0].querySelector(".acc-checkbox").addEventListener("click", child2);
  $(this)[0].addEventListener("click", showOverlayAddUser);
});*/

//$(document).on("mouseup", ".add-btn", function() {
  //$(this)[0].querySelector(".acc-checkbox").addEventListener("click", child2);
  //$(this)[0].addEventListener("click", showOverlayAddUser);
//});

function child2(event) {
  event.stopPropagation();
}

function showOverlayAddUser(event) {
  document.getElementById('popupHeaderID').innerHTML = "Add Profile";
  scrollPosition = window.pageYOffset;
  const mainEl = document.querySelector('.add-owner-container');
  mainEl.style.top = -scrollPosition + 'px';
  document.body.classList.add('show-overlay');
  $(".popup-add-profil, .overlay").show();
}
//--------------------------------------------------------------------------------


// Open popup window to edit user keys-------------------------------------------
$(document).on("mouseup", ".edit-keys-btn", function(e) {

  activeUserID = $(this).parent().parent().parent()[0].querySelector(".accordion-headline").getAttribute("name");
  activeKeyListIDs = $(this).parent().parent()[0].querySelector(".key-details-list").getAttribute("name");


  showOverlayEditKeys();
  var keyList = document.getElementById("keyListID");
  var keyListElemTemplate = document.querySelector('[id=keyListElemID][title="id"]')
  var keyListElem = document.getElementById("keyListElemID");
  //var keyListElemID = document.getElementById("popupKeyElemID");
  //keyList.innerHTML = '';
  keyListElemTemplate.style.display = "none";
	var list = document.querySelectorAll('[id^=keyListElemID][style*="display: flex;"]');
	for(var i=0;i<list.length;i++)
	{
		list[i].remove();//remove the existing keys in the pop up edit key list
	}

  accElement = $(this).parent().parent().parent()[0];

  var typeList = accElement.querySelectorAll('[name="type"]');
  var snList = accElement.querySelectorAll('[name="sn"]');


  for (var i = 1; i < typeList.length; i++) {
    var rowClone = keyListElem.cloneNode(true);
    rowClone.style.display = "flex";
    rowClone.style.justifyContent = "space-between";
    rowClone.style.alignItems = "center";
    rowClone.style.marginBottom = "20px";
    rowClone.querySelector("#popupKeyElemID").name = activeKeyListIDs[i - 1];
    rowClone.querySelector("#popupTypeID").innerHTML = typeList[i].innerHTML;
    rowClone.querySelector("#popupSnID").innerHTML = snList[i].innerHTML;
		rowClone.setAttribute("title", snList[i].innerHTML);

    keyList.appendChild(rowClone);
  }
});
//-------------------------------------------------------------------

// open popupwindow to edit user details-------------------------------------------
$(document).on("mouseup", ".edit-user-details-btn", function(e) {

  showOverlay();
  //activeUserID = $(this).parent().parent().parent()[0].querySelector(".accordion-headline").name;

  var popupWindow, accElement;

  var radioBtnMale = document.getElementById("popMaleID");
  var radioBtnFemale = document.getElementById("popFemaleID");

  accElement = $(this).parent().parent().parent()[0];
	activeUserID = accElement.querySelector("#accordionOwnerHeadlineId").getAttribute('name');
  activeFirstName = accElement.querySelector("#firstNameID").innerHTML;
  activeLastName = accElement.querySelector("#lastNameID").innerHTML;
  activeGender = accElement.querySelector("#genderID").innerHTML;
  activeBrand = accElement.querySelector("#brandID").innerHTML;
  activeDepartment = accElement.querySelector("#departmentID").innerHTML;
  activePersonnelNo = accElement.querySelector("#personnelNoID").innerHTML;

  $('#popFirstnameID').val(activeFirstName);
  $('#popLastnameID').val(activeLastName);

  if (activeGender == "male") {
    radioBtnMale.checked = true;
  } else {
    radioBtnFemale.checked = true;
  }

  $('#popBrandID').val(activeBrand);
  $('#popDepartmentID').val(activeDepartment);
  $('#popPersonnelNoID').val(activePersonnelNo);

  document.getElementById('popupHeaderID').innerHTML = "Edit User " + activeFirstName + " " + activeLastName;
});
//-------------------------------------------------------------------


// show and hide popup windows-------------------------------------------
function showOverlayEditKeys() {
  scrollPosition = window.pageYOffset;
  const mainEl = document.querySelector('.add-owner-container');
  mainEl.style.top = -scrollPosition + 'px';
  document.body.classList.add('show-overlay');
  $(".popup-edit-keys, .overlay").show();
}

function disableOverlayEditKeys() {
	$("#addKeyBtnID").prop('disabled', true);
	$("#popupSaveBtnID").prop('disabled', true);
	$(".popup-edit-keys").prop('disabled', true);
  document.body.classList.remove('show-overlay');
  window.scrollTo(0, scrollPosition);
  const mainEl = document.querySelector('.add-owner-container');
  mainEl.style.top = 0;
}

function removeOverlayEditKeys() {
  $(".popup-edit-keys, .overlay").hide();
  document.body.classList.remove('show-overlay');
  window.scrollTo(0, scrollPosition);
  const mainEl = document.querySelector('.add-owner-container');
  mainEl.style.top = 0;
}

function showOverlay() {
  scrollPosition = window.pageYOffset;
  const mainEl = document.querySelector('.add-owner-container');
  mainEl.style.top = -scrollPosition + 'px';
  document.body.classList.add('show-overlay');
  $(".popup-edit-profil, .overlay").show();
}

function removeOverlay() {
  $(".popup-edit-profil, .overlay").hide();
  document.body.classList.remove('show-overlay');
  window.scrollTo(0, scrollPosition);
  const mainEl = document.querySelector('.add-owner-container');
  mainEl.style.top = 0;
}

function removeOverlayAddUser() {
  $(".popup-add-profil, .overlay").hide();
  document.body.classList.remove('show-overlay');
  window.scrollTo(0, scrollPosition);
  const mainEl = document.querySelector('.add-owner-container');
  mainEl.style.top = 0;
}

//-------------------------------------------------------------------

//Select Gender radio Button functions ---------------------------------
function returnSelecteGender() {
	var radioBtnGender1;
	radioBtnGender1 = $("input[type='radio'][name='gender']:checked").val();
  if (radioBtnGender1 === "male") {
    return "Male";
  } else if (radioBtnGender1 === "female"){
    return "Female";
  }
	else return "Unspecified"
}

$(document).on("mouseup", ".radio-btn-male", function() {

  var radiobtn2 = document.getElementById("popFemaleID");
  radiobtn2.checked = false;
  var radiobtn = document.getElementById("popMaleID");
  radiobtn.checked = true;
});

$(document).on("mouseup", ".radio-btn-female", function() {
  var radiobtn2 = document.getElementById("popMaleID");
  radiobtn2.checked = false;
  var radiobtn = document.getElementById("popFemaleID");
  radiobtn.checked = true;
});

$(document).on("mouseup", ".radio-btn-male-AddUser", function() {

  var radiobtn2 = document.getElementById("popFemaleAddUserID");
  radiobtn2.checked = false;
  var radiobtn = document.getElementById("popMaleAddUserID");
  radiobtn.checked = true;
});

$(document).on("mouseup", ".radio-btn-female-AddUser", function() {
  var radiobtn2 = document.getElementById("popMaleAddUserID");
  radiobtn2.checked = false;
  var radiobtn = document.getElementById("popFemaleAddUserID");
  radiobtn.checked = true;
});
//-------------------------------------------------------------------


//Edit User details Popup window - Save changes------------------------------------
$(document).on("mouseup", ".btn-save", function() {
  var popupWindow, accElement;
  var radioBtnMale = document.getElementById("popMaleID");
  var radioBtnFemal = document.getElementById("popFemaleID");

  activeFirstName = $('#popFirstnameID').val();
  activeLastName = $('#popLastnameID').val();
	var selectedGender = $("input[type='radio'][name='genderEditUser']:checked").val();
  if (selectedGender === "male") {
    activeGender = "male"
  } else {
    activeGender = "female"
  }
  activeBrand = $('#popBrandID').val();
  activeDepartment = $('#popDepartmentID').val();
  activePersonnelNo = $('#popPersonnelNoID').val();
	jsonusers.user[activeUserID].firstname = activeFirstName;
	jsonusers.user[activeUserID].lastname = activeLastName;
	jsonusers.user[activeUserID].gender = activeGender;
	jsonusers.user[activeUserID].brand = activeBrand;
	jsonusers.user[activeUserID].department = activeDepartment;
	jsonusers.user[activeUserID].personellno = activePersonnelNo;
	processUsersAndKeys();
  removeOverlay();
});
//-------------------------------------------------------------------

//Add User Popup window - Save changes------------------------------------
$(document).on("mouseup", ".btn-save-addUser", function() {
	var tableElem = document.getElementById("accordion-element");
  var tableElemNoOwner = document.getElementById("accordion-element-no-owner");

  activeFirstName = $('#popFirstnameAddUserID').val();
  activeLastName = $('#popLastnameAddUserID').val();
	var selectedGender = $("input[type='radio'][name='genderAddUser']:checked").val();
  if (selectedGender === "male") {
    activeGender = "male"
  } else {
    activeGender = "female"
  }
  activeBrand = $('#popBrandAddUserID').val();
  activeDepartment = $('#popDepartmentAddUserID').val();
  activePersonnelNo = $('#popPersonnelNoAddUserID').val();

	addUserToList();
	sendUserList();
	processUsersAndKeys();
	removeOverlayAddUser();
});

$(document).on("mouseup", ".accordion-header-container-2", function() {
	var activeKeySn = jQuery(this).find("#snID").text();
	//$(this).parent().parent().parent()[0].remove();
	var activeKeyId = getKeyIdfromSn(activeKeySn);
	activeKeyListIDs = [];
	if(activeKeyId != -1)
	{//the ID of the activer key found, update user list and send
		activeKeyListIDs.push(activeKeyId);
		showOverlayAddUser();
	}	
});
//
$(document).on("mouseup", ".add-btn", function() {
	var activeKeySn = $(this).parent().parent().parent()[0].querySelector("#snID").innerHTML;
	//$(this).parent().parent().parent()[0].remove();
	var activeKeyId = getKeyIdfromSn(activeKeySn);
	activeKeyListIDs = [];
	if(activeKeyId != -1)
	{//the ID of the activer key found, update user list and send
		activeKeyListIDs.push(activeKeyId);
		showOverlayAddUser();
	}	
});

function getKeyIdfromSn(keySn) {
	var cardSnParsed;
	for(var i=0; i<jsonkeys.key_list.length; i++)
	{
		cardSnParsed = parseInt(jsonkeys.key_list[i].card_sn);
		if(cardSnParsed.toString() === keySn) return jsonkeys.key_list[i].index;
	}
	
	return -1;
	//return jsonkeys.key_list.find(element => element = keySn)
	//return jsonkeys.key_list.find(item => {
  // return item.key_list.card_sn == keySn;
//})
}

//-------------------------------------------------------------------
//Edit User Keys Popup window - Delete keys------------------------------------
$(document).on("mouseup", ".popup-delete-btn", function() {
  var undoBtn = $(this)[0].querySelector("a");
  var deleteBtn = $(this)[0].querySelector("img");
  var keyID = $(this).parent().parent()[0].querySelector("#popupKeyElemID").name;

  if ($(this)[0].querySelector("img").classList.contains('hide-btn')) {
    deleteBtn.classList.remove("hide-btn");
    undoBtn.classList.add("hide-btn");
    $(this).parent()[0].querySelector('.popup-unassign-btn').classList.remove("disabled-button");
    let pos = deleteKeyList.indexOf(keyID);
    deleteKeyList.splice(pos, 1);
  } else {
    deleteBtn.classList.add("hide-btn");
    deleteKeyList.push(keyID);
    undoBtn.classList.remove("hide-btn");
    $(this).parent()[0].querySelector('.popup-unassign-btn').classList.add("disabled-button");
  }
});

//Edit User Keys Popup window - unassign keys------------------------------------
$(document).on("mouseup", ".popup-unassign-btn", function() {
  var unassignBtn = $(this)[0].querySelector(".popup-text-btn");
  var undoBtn = $(this)[0].querySelector(".text-button-undo");

  if ($(this)[0].querySelector(".popup-text-btn").classList.contains('hide-btn')) {
    undoBtn.classList.add("hide-btn");
    unassignBtn.classList.remove("hide-btn");
    this.nextElementSibling.classList.remove("disabled-button");
    //let pos = unassignKeyList.indexOf(keyID);
    //unassignKeyList.splice(pos, 1);
  } else {
    undoBtn.classList.remove("hide-btn");
    unassignBtn.classList.add("hide-btn");
    this.nextElementSibling.classList.add("disabled-button");
  }
});

//Edit User Keys Popup window - save all changes------------------------------------
$(document).on("mouseup", ".btn-save-keys", function() { 
	removeOverlayEditKeys();
	var keyListElements = document.querySelectorAll("#keyListElemID");//Get a node list of the keys assigned to the user
	var keyListElementSn;
	for(var i=0;i<keyListElements.length;i++)
	{	
		var unassignButtonElement = keyListElements[i].querySelector(".popup-text-btn");//Get Unassign button element properties
		var unassignButtonClassList = unassignButtonElement.classList;
		var deleteButtonElement = keyListElements[i].querySelector("img");//Get delete button element properties
		var deleteButtonClassList = deleteButtonElement.classList;
		if(unassignButtonClassList.contains('hide-btn'))//Check if the unassign button is hidden, meaning it has been clicked on
		{
			keyListElementSn = keyListElements[i].querySelector('#popupSnID').innerHTML
			if (unassignKeyFromActiveUser(keyListElementSn) < 0)//Unassign key from the active user
			{
				console.log("Could not unassign key " + keyListElementSn + " from user ID " + activeUserID);
			}
			continue;
		}	
		else if(deleteButtonClassList.contains('hide-btn'))	
		{
			keyListElementSn = keyListElements[i].querySelector('#popupSnID').innerHTML
			if (unassignKeyFromActiveUser(keyListElementSn) < 0)//Unassign key from the active user
			{
				console.log("Could not unassign key " + keyListElementSn + " from user ID " + activeUserID);
			}
			if (deleteKey(keyListElementSn) < 0)//Unassign key from the active user
			{
				console.log("Could not delete key SN" + keyListElementSn);
			}
			continue;					
		}
	}
	sendUserList();
	fetchKeyList();
	//refreshUserKeyList();
	//removeOverlayEditKeys();
});

//delete button function
function deleteKey(keySN) {
	var entryType, psIndex;
	for(var i=0;i<jsonkeys.key_list.length;i++)
	{
		if((jsonkeys.key_list[i].entry_type == 'ps') && (parseInt(jsonkeys.key_list[i].card_sn) == parseInt(keySN)))
		{
			entryType = 'ps';
			psIndex = jsonkeys.key_list[i].index
			console.log('key found index: ' + jsonkeys.key_list[i].index);
		  var jsonStringDeleteKeyList = JSON.stringify({
		    "json_type": "deleteKeyList",
		    "key_list": []
		  });
		  var jsonObjDeleteKeyList = JSON.parse(jsonStringDeleteKeyList);
		  jsonObjDeleteKeyList['key_list'].push({
		    "entry_type": entryType,
		    "index": psIndex
		  });
		  console.log(jsonObjDeleteKeyList);
		  sendDeleteKeysList(JSON.stringify(jsonObjDeleteKeyList));
		}
	}
}

function sendDeleteKeysList(jsonStringKeyList) {
  var SettingsPath = "/settings";
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", SettingsPath, true);
  xhttp.responseType = 'text';
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log('Keys deleted');
    }
  }
  console.log("sendList");
  console.log(jsonStringKeyList);
  xhttp.send(jsonStringKeyList);
}

function unassignKeyFromActiveUser(keySn) {
	var keyID = getKeyIdfromSn(keySn);
	var indexOfKeyID;

	indexOfKeyID = jsonusers.user[activeUserID].keys.indexOf(keyID)
	if(indexOfKeyID >= 0) 
	{
		jsonusers.user[activeUserID].keys.splice(indexOfKeyID, 1);//unassign key from user
		return 0;
	}
	return -1;
}

//Edit User Keys Popup window - add keys directly to user------------------------------------
$(document).on("mouseup", ".Add-keys-btn", function() {
  var placeholder = document.getElementById("presentKeyplaceholderID");
  var addKeybtn = document.getElementById("addKeyBtnID");
	var saveKeybtn = document.getElementById("popupSaveBtnID");

	disableOverlayEditKeys();//disable the buttons
	startProgrammingMode();//Start the programming mode

  if (placeholder.classList.contains('hide')) {
    placeholder.classList.remove("hide");
    addKeybtn.classList.add('disabled-button');
		saveKeybtn.classList.add('disabled-button');
  } else {
    placeholder.classList.add("hide");
  }
});

function addElementToList() {
  var keyListElem = document.getElementById("keyListElemID");
  var list = document.getElementById("keyListID");

  var rowClone = keyListElem.cloneNode(true);
  rowClone.style.display = "flex";
  rowClone.style.justifyContent = "space-between";
  rowClone.style.alignItems = "center";
  rowClone.style.marginBottom = "20px";

  rowClone.querySelector("#popupTypeID").innerHTML = "Access Card";
  rowClone.querySelector("#popupSnID").innerHTML = "6516518441554";

  activeUserID;
  activeKeyListIDs.push(9);

  list.appendChild(rowClone);
  document.getElementById("presentKeyplaceholderID").classList.add("hide");
}
//-------------------------------------------------------------------

//---------Programming keys section----------------------
function startProgrammingMode() {
		var xhttp = new XMLHttpRequest();
  	xhttp.open("POST", programcards_path, true);
 		xhttp.send();
		interval_prog_time = setInterval(function() {
  	// Call a function repetatively with 500mSecond interval
  		getServerValue("Programming_time");
		}, 500); //mSeconds update rate
}

function openWebSocket() {
	socket = new WebSocket("ws://192.168.4.1/ws");
	
	socket.onopen = function(e) {
		socketOpened = 1;
		console.log("socket opened!");
	};

	socket.onmessage = function(event) {
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
					document.getElementById('timerID').innerHTML = parsedJson.Programming_time + "s";
					
					if(parseInt(parsedJson.Programming_time) <= 0)
					{
						  var placeholder = document.getElementById("presentKeyplaceholderID");
  						var addKeybtn = document.getElementById("addKeyBtnID");
							var saveKeybtn = document.getElementById("popupSaveBtnID");
							var cancelKeybtn = document.getElementById("popupCancelBtnID");
							
							$("#popupSaveBtnID").prop('disabled', false);
				
			        addKeybtn.classList.remove('disabled-button');
							saveKeybtn.classList.remove('disabled-button');
							cancelKeybtn.classList.remove('disabled-button');
        			document.getElementById("timerID").innerHTML = "<a>restart</a>";
      				placeholder.classList.add("hide"); // no presented cards

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
		if(cardIsDuplicate() === false)
		{//Card not duplicate so add it to json keys
			if(cardsJson.card[0].type < 2 || cardsJson.card[0].type > 9)//Card types 2 to 9 are special cards and cannot be assigned to users
			{
				jsonkeys.key_list.push({"entry_type":"ps","index":cardsJson.card[0].ps_index,"card_sn":"0x" + cardsJson.card[0].sn.toString(16),"l_out":cardsJson.card[0].l_out,"s_out":cardsJson.card[0].s_out});
			}
			jsonusers.user[activeUserID].keys.push(cardsJson.card[0].ps_index);//Add the PS index of the new key to the active user
		}
		else //Card already saved. Check if assigned to a user, if so, remove it from that user, then assign it to the active user
		{
			var assignedKeyIndex;
			for(var j=0;j<jsonusers.user.length;j++)
			{
				assignedKeyIndex = -1;
				assignedKeyIndex = jsonusers.user[j].keys.indexOf(cardsJson.card[0].ps_index);//Search for the 
				if(assignedKeyIndex >= 0)
				{
					jsonusers.user[j].keys.splice(assignedKeyIndex, 1);//delete key from user
				}
			}
			jsonusers.user[activeUserID].keys.push(cardsJson.card[0].ps_index);//Add the existing key to the active user
		}

		//var popupKeyContainerElem = document.getElementById("keyListContainerID");
		var popupKeyElem = document.getElementById("keyListElemID");//
		var popupKeyList = document.getElementById("keyListID");
		var popupElements = popupKeyList.getElementsByTagName("p");//querySelectorAll("#popupSnID");//("keyListElemID")//("popupSnID");
		// Convert popupSnId Elements NodeList to an array
		//var popupSnIdArray = Array.prototype.slice.call(popupSnIdElements);
		var popupCardDuplicate = false;
		var newCardSn;
		for(var k=0;k<popupElements.length;k++)
		{
			newCardSn = cardsJson.card[0].sn;
			if(popupElements[k].innerHTML === newCardSn.toString()) popupCardDuplicate = true;
		}
		
		var rowClone = popupKeyElem.cloneNode(true);
		popupKeyElem.setAttribute("name", cardsJson.card[0].ps_index);//Set the name of the List entry to the ps_index (index of the card in PS memory)
		//for(var i=0;i<popupKeyListSn.length;i++)
		//{//search all cards SNs in popup list
				//var list = document.getElementById("keyListDetailsID");
			/* Check for duplicate in popup, then add row accordingly */
		if(popupCardDuplicate === true) rowClone.querySelector("#popupTypeID").innerHTML =  "DUPLICATE"; //card is duplicate in popup window
		else rowClone.querySelector("#popupTypeID").innerHTML = getCardType(cardsJson.card[0].type);
		
		rowClone.querySelector("#popupSnID").innerHTML = cardsJson.card[0].sn;
		rowClone.setAttribute("title", cardsJson.card[0].sn);
		rowClone.style.display = "flex";
		rowClone.style.justifyContent = "space-between";
		rowClone.style.alignItems = "center";
		rowClone.style.marginBottom = "20px";
		//}
		document.getElementById('keyListContainerID').appendChild(rowClone);	
		sendUserList();//send updated user list to controller
		processUsersAndKeys();//refresh the User/Key list
	}
}

//function return true is new card serail number aleady exists
function cardIsDuplicate() {
	var cardSn;
	for(var i=0;i<jsonkeys.key_list.length;i++)
	{
		cardSn = parseInt(jsonkeys.key_list[i].card_sn);
		if(cardSn === cardsJson.card[0].sn) return true;
	}
	return false;
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
	presentedCards++;
  localStorage.setItem("presentedCards", presentedCards);
  document.getElementById("presentedCardsID").innerHTML = "Presented Cards: " + presentedCards;
}

$(document).on("mouseup", ".text-button-white-edit", function() {
  window.location.href = "/index.html";
});











// $(document).on("mouseup", ".btn-save", function() {
// 	var firstname = document.getElementById("popFirstnameID").innerHTML;
// 	var lastname = document.getElementById("popLastnameID").innerHTML;
// 	var personnelnumber = document.getElementById("popPersonnelNoID").innerHTML;
  
// 	var inputFirstName = document.querySelector('#popFirstnameID');
// 	var htFirstName = document.querySelector('#ht-firstname');

// 	var inputLastName = document.querySelector('#popLastnameID');
// 	var htLastName = document.querySelector('#ht-lastname');

// 	var inputPersonnelNumber = document.querySelector('#popPersonnelNoID');
// 	var htPersonnelNumber = document.querySelector('#ht-personnelnum');
  
// 	if (inputFirstName.value && // if exist AND
// 		inputFirstName.value.length > 0 && // if value have one charecter at least
// 		inputFirstName.value.trim().length > 0 && // if value is not just spaces)

// 		inputLastName.value && // if exist AND
// 		inputLastName.value.length > 0 && // if value have one charecter at least
// 		inputLastName.value.trim().length > 0 && // if value is not just spaces)

// 		inputPersonnelNumber.value && // if exist AND
// 		inputPersonnelNumber.value.length > 0 && // if value have one charecter at least
// 		inputPersonnelNumber.value.trim().length > 0 
// 	) {
// 		htFirstName.classList.add("hide");
// 		htLastName.classList.add("hide");
// 		htPersonnelNumber.classList.add("hide");
// 	  //console.log(" test");
// 	  //window.location.href = "/index.html";
  
// 	  //  window.location.href = "/index";
  
// 	} 
// 	else {

// 	  // First Name
// 	  if (!inputFirstName.value && // if exist AND
// 		!inputFirstName.value.length > 0 && // if value have one charecter at least
// 		!inputFirstName.value.trim().length > 0 // if value is not just spaces)
// 	  ) {
// 		htFirstName.classList.remove("hide");
// 	  }else{
// 		htFirstName.classList.add("hide");
// 	  }

// 	  //Last Name
// 	  if (!inputLastName.value && // if exist AND
// 		!inputLastName.value.length > 0 && // if value have one charecter at least
// 		!inputLastName.value.trim().length > 0 // if value is not just spaces)
// 	  ) {
// 		htLastName.classList.remove("hide");
// 	  }else{
// 		htLastName.classList.add("hide");
// 	  }

// 	  //Personnel Number
// 	  if (!inputPersonnelNumber.value && // if exist AND
// 		!inputPersonnelNumber.value.length > 0 && // if value have one charecter at least
// 		!inputPersonnelNumber.value.trim().length > 0 // if value is not just spaces)
// 	  ) {
// 		htPersonnelNumber.classList.remove("hide");
// 	  }else{
// 		htPersonnelNumber.classList.add("hide");
// 	  }

// 	}
  
// 	  //sendDetails(inputFirstName.value, inputLastName.value, inputPersonnelNumber.value);//Send login credentials to controller
// });

// function sendDetails(firstName, lastName, personnelNumber) {
// 	var sendDetailsPath = "/checkDetails";
// 	var xhttp = new XMLHttpRequest();
// 	xhttp.open("GET", sendDetailsPath);
// 	xhttp.responseType = 'text';
//   xhttp.onreadystatechange = function() {
// 	if (this.readyState == 4 && this.status == 200) {
// 			setCookie("X-sessionCookie", xhttp.responseText);//, 15);//Set to approx 5 mins expiry
// 			console.log(xhttp.responseText);
// 			window.location.href = "/keylistpage.html";
// 			//getIndexPage();//Go to home page of the website after log in success
// 			//window.location.href = "/index.html";
// 		}
// 	}
// 	xhttp.setRequestHeader("X-firstname", firstName);
// 	xhttp.setRequestHeader("X-lastname", lastName);
// 	xhttp.setRequestHeader("X-personnelnumber", personnelNumber);
// 	xhttp.send();
// }

// function setCookie(cname, cvalue) {//}, exmins) {
// 	document.cookie = cname + "=" + cvalue + ";path=/";
// 	  console.log('Get X-sessionCookie' + getCookie("X-sessionCookie"));
//   }
  
//   function getCookie(name) {
// 	  var nameEQ = name + "=";
// 	  var ca = document.cookie.split(';');
// 	  for(var i=0;i < ca.length;i++) {
// 		  var c = ca[i];
// 		  while (c.charAt(0)==' ') c = c.substring(1,c.length);
// 		  if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
// 	  }
// 	  return null;
//   }


//-------------------------End of programming key section---------------------------------------

