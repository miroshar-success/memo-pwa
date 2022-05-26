var currentStage = 0;
var inputDevicename;
var htDeviceName;

var inputFirstname;
var htFirstname;
var inputLastname;
var htLastname;

var inputUsername;
var htUsername;
var inputEmail;
var htEmail;
var inputPassword;
var htPassword;

var inputStreet;
var htStreet;
var inputCity;
var htCity;
var inputCountry;
var htCountry;

$(document).ready(function() {
  document.getElementById("backBtnID").classList.add("disabled-button");
  document.querySelector('.inputfields-name').classList.add("hide");
  document.querySelector('.inputfields-usernam-password').classList.add("hide");
  document.querySelector('.inputfields-address').classList.add("hide");

  document.getElementById("2stepperID").classList.add("hide");
  document.getElementById("3stepperID").classList.add("hide");

  loadContent();
});

$(document).on("mouseup", ".btn-next", function() {

  inputDevicename = document.querySelector('#inputDevicenameID');
  htDeviceName = document.querySelector('#ht-devicenameID');

  inputFirstname = document.querySelector('#firstnameID');
  htFirstname = document.querySelector('#ht-firstnameID');
  inputLastname = document.querySelector('#lastnameID');
  htLastname = document.querySelector('#ht-lastnameID');

  inputUsername = document.querySelector('#usernameID');
  htUsername = document.querySelector('#ht-username');
  inputEmail = document.querySelector('#EmailID');
  htEmail = document.querySelector('#ht-Email');
  inputPassword = document.querySelector('#passwordID');
  htPassword = document.querySelector('#ht-password');

  inputStreet = document.querySelector('#streetID');
  htStreet = document.querySelector('#ht-streetID');
  inputCity = document.querySelector('#cityID');
  htCity = document.querySelector('#ht-cityID');
  inputCountry = document.querySelector('#countryID');
  htCountry = document.querySelector('#ht-countryID');

  switch (currentStage) {
    case 0:
      if (inputFirstname.value && // if exist AND
        inputFirstname.value.length > 0 && // if value have one charecter at least
        inputFirstname.value.trim().length > 0 && // if value is not just spaces)
        inputLastname.value && // if exist AND
        inputLastname.value.length > 0 && // if value have one charecter at least
        inputLastname.value.trim().length > 0 // if value is not just spaces)
      ) {
        if (currentStage < 4) {
          htFirstname.classList.add("hide");
          htLastname.classList.add("hide");
          currentStage++;
          loadContent();
        }
      } else {
        if (!inputFirstname.value && // if exist AND
          !inputFirstname.value.length > 0 && // if value have one charecter at least
          !inputFirstname.value.trim().length > 0 // if value is not just spaces)
        ) {
          htFirstname.classList.remove("hide");
        } else {
          htFirstname.classList.add("hide");
        }
        if (!inputLastname.value && // if exist AND
          !inputLastname.value.length > 0 && // if value have one charecter at least
          !inputLastname.value.trim().length > 0 // if value is not just spaces)
        ) {
          htLastname.classList.remove("hide");
        } else {
          htLastname.classList.add("hide");
        }
      }
      break;
    case 1:
      if (inputUsername.value && // if exist AND
        inputUsername.value.length > 0 && // if value have one charecter at least
        inputUsername.value.trim().length > 0 && // if value is not just spaces)
        inputPassword.value && // if exist AND
        inputPassword.value.length > 0 && // if value have one charecter at least
        inputPassword.value.trim().length > 0 // if value is not just spaces)
      ) {
        if (currentStage < 4) {
          htUsername.classList.add("hide");
          htPassword.classList.add("hide");

          currentStage++;
          loadContent();
        }
      } else {
        if (!inputUsername.value && // if exist AND
          !inputUsername.value.length > 0 && // if value have one charecter at least
          !inputUsername.value.trim().length > 0 // if value is not just spaces)
        ) {
          htUsername.classList.remove("hide");
        } else {
          htUsername.classList.add("hide");
        }

        if (!inputPassword.value && // if exist AND
          !inputPassword.value.length > 0 && // if value have one charecter at least
          !inputPassword.value.trim().length > 0 // if value is not just spaces)
        ) {
          htPassword.classList.remove("hide");
        } else {
          htPassword.classList.add("hide");
        }
      }
      break;
      case 2:
        if (inputStreet.value && // if exist AND
          inputStreet.value.length > 0 && // if value have one charecter at least
          inputStreet.value.trim().length > 0 && // if value is not just spaces)
          inputCity.value && // if exist AND
          inputCity.value.length > 0 && // if value have one charecter at least
          inputCity.value.trim().length > 0 && // if value is not just spaces)
          inputCountry.value && // if exist AND
          inputCountry.value.length > 0 && // if value have one charecter at least
          inputCountry.value.trim().length > 0 // if value is not just spaces)
        ) {
          if (currentStage < 4) {
            htStreet.classList.add("hide");
            htCity.classList.add("hide");
            htCountry.classList.add("hide");

            currentStage++;
            loadContent();
          }
        } else {
          if (!inputStreet.value && // if exist AND
            !inputStreet.value.length > 0 && // if value have one charecter at least
            !inputStreet.value.trim().length > 0 // if value is not just spaces)
          ) {
            htStreet.classList.remove("hide");
          } else {
            htStreet.classList.add("hide");
          }
          if (!inputCity.value && // if exist AND
            !inputCity.value.length > 0 && // if value have one charecter at least
            !inputCity.value.trim().length > 0 // if value is not just spaces)
          ) {
            htCity.classList.remove("hide");
          } else {
            htCity.classList.add("hide");
          }
          if (!inputCountry.value && // if exist AND
            !inputCountry.value.length > 0 && // if value have one charecter at least
            !inputCountry.value.trim().length > 0 // if value is not just spaces)
          ) {
            htCountry.classList.remove("hide");
          } else {
            htCountry.classList.add("hide");
          }
        }
        break;
    default:
      console.log("Error log");
  }
});



$(document).on("mouseup", ".btn-back", function() {

  if (currentStage > 0) {
    currentStage--;
    loadContent();
  }else{
    window.location.href = "/login.html";
  }
});

function loadContent() {
  switch (currentStage) {
    case 0:
      document.getElementById("backBtnID").classList.remove("disabled-button");
      document.querySelector('.inputfields-name').classList.remove("hide");
      document.querySelector('.inputfields-usernam-password').classList.add("hide");

      document.getElementById("1stepperID").classList.remove("hide");
      document.getElementById("2stepperID").classList.add("hide");
      document.getElementById("3stepperID").classList.add("hide");
      break;
    case 1:
      document.querySelector('.inputfields-usernam-password').classList.remove("hide");
      document.querySelector('.inputfields-name').classList.add("hide");
      document.querySelector('.inputfields-address').classList.add("hide");

      document.getElementById("1stepperID").classList.add("hide");
      document.getElementById("2stepperID").classList.remove("hide");
      document.getElementById("3stepperID").classList.add("hide");
      break;
    case 2:
      document.querySelector('.inputfields-address').classList.remove("hide");
      document.querySelector('.inputfields-usernam-password').classList.add("hide");
      document.querySelector('.inputfields-name').classList.add("hide");

      document.getElementById("1stepperID").classList.add("hide");
      document.getElementById("2stepperID").classList.add("hide");
      document.getElementById("3stepperID").classList.remove("hide");
      break;
    case 3:
      document.getElementById('nextBtnID').onclick = function() {
				sendRegistration();
        //window.location.href = "/login.html";
      }
      break;

    default:
      console.log("Error log");

  }
}
function sendRegistration() {
		var sendRegSettingPath = "/setting";
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", sendRegSettingPath);
		xhttp.responseType = 'text';
	  xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
				console.log("Registration success");
				window.location.href = "/login.html";
			}
			else if(this.readyState >= 500)
			{
				location.reload();
			}
		}
		xhttp.setRequestHeader("Content-Type", "application/json");
		//var str_UserRegJson = createUserRegJSON();
		//var str_UserRegJsonForFileWrite = str_UserRegJson.replaceAll('"', '\"');//In string " is a special character so we add escape char before each one
		//console.log(str_UserRegJsonForFileWrite);
		//xhttp.send(str_UserRegJsonForFileWrite);
		xhttp.send(createUserRegJSON() + '\0');
}

function createUserRegJSON() {
	str_jsonUserAccount = '{"json_type":"userReg"}';
	jsonUserAccount = JSON.parse(str_jsonUserAccount);//parse JSON
	jsonUserAccount.firstname = inputFirstname.value;
	jsonUserAccount.lastname = inputLastname.value;
	jsonUserAccount.email = inputEmail.value;
	jsonUserAccount.username = inputUsername.value;
	jsonUserAccount.password = inputPassword.value;
	jsonUserAccount.street = inputStreet.value;
	jsonUserAccount.city = inputCity.value;
	jsonUserAccount.country = inputCountry.value;
	
	return  JSON.stringify(jsonUserAccount);
}

$(document).on("mouseup", ".hide-password", function() {
  var x = document.getElementById("passwordID");
  var btn = document.getElementById("hideBtnID");

  if (x.type === "password") {
    btn.innerHTML = "Hide";
    x.type = "text";
  } else {
    btn.innerHTML = "Show";
    x.type = "password";
  }
});
