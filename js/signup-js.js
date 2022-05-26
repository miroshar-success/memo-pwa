var currentStage = 0;


$(document).ready(function() {
  document.getElementById("backBtnID").classList.add("disabled-button");
  document.querySelector('.inputfields-name').classList.add("hide");
  document.querySelector('.inputfields-usernam-password').classList.add("hide");
  document.querySelector('.inputfields-address').classList.add("hide");

  document.getElementById("2stepperID").classList.add("hide");
  document.getElementById("3stepperID").classList.add("hide");
  document.getElementById("4stepperID").classList.add("hide");

  loadContent();
});

$(document).on("mouseup", ".btn-next", function() {

  var inputDevicename = document.querySelector('#inputDevicenameID');
  var htDeviceName = document.querySelector('#ht-devicenameID');

  var inputFirstname = document.querySelector('#firstnameID');
  var htFirstname = document.querySelector('#ht-firstnameID');
  var inputLastname = document.querySelector('#lastnameID');
  var htLastname = document.querySelector('#ht-lastnameID');

  var inputUsername = document.querySelector('#usernameID');
  var htUsername = document.querySelector('#ht-username');
  var inputEmail = document.querySelector('#EmailID');
  var htEmail = document.querySelector('#ht-Email');
  var inputPassword = document.querySelector('#passwordID');
  var htPassword = document.querySelector('#ht-password');

  var inputStreet = document.querySelector('#streetID');
  var htStreet = document.querySelector('#ht-streetID');
  var inputCity = document.querySelector('#cityID');
  var htCity = document.querySelector('#ht-cityID');
  var inputCountry = document.querySelector('#countryID');
  var htCountry = document.querySelector('#ht-countryID');

  switch (currentStage) {
    case 0:
      if (inputDevicename.value && // if exist AND
        inputDevicename.value.length > 0 && // if value have one charecter at least
        inputDevicename.value.trim().length > 0 // if value is not just spaces)
      ) {
        if (currentStage < 4) {
          htDeviceName.classList.add("hide");
          currentStage++;
          loadContent();
        }
      } else {
        htDeviceName.classList.remove("hide");
      }
      break;
    case 1:
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
    case 2:
      if (inputUsername.value && // if exist AND
        inputUsername.value.length > 0 && // if value have one charecter at least
        inputUsername.value.trim().length > 0 && // if value is not just spaces)
        inputEmail.value && // if exist AND
        inputEmail.value.length > 0 && // if value have one charecter at least
        inputEmail.value.trim().length > 0 && // if value is not just spaces)
        inputPassword.value && // if exist AND
        inputPassword.value.length > 0 && // if value have one charecter at least
        inputPassword.value.trim().length > 0 // if value is not just spaces)
      ) {
        if (currentStage < 4) {
          htUsername.classList.add("hide");
          htEmail.classList.add("hide");
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
        if (!inputEmail.value && // if exist AND
          !inputEmail.value.length > 0 && // if value have one charecter at least
          !inputEmail.value.trim().length > 0 // if value is not just spaces)
        ) {
          htEmail.classList.remove("hide");
        } else {
          htEmail.classList.add("hide");
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
      case 3:
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
  }
});

function loadContent() {
  switch (currentStage) {
    case 0:
      document.getElementById("backBtnID").classList.add("disabled-button");
      document.querySelector('.inputfield-device-name').classList.remove("hide");
      document.querySelector('.inputfields-name').classList.add("hide");

      document.getElementById("1stepperID").classList.remove("hide");
      document.getElementById("2stepperID").classList.add("hide");
      document.getElementById("3stepperID").classList.add("hide");
      document.getElementById("4stepperID").classList.add("hide");
      break;
    case 1:
      document.getElementById("backBtnID").classList.remove("disabled-button");
      document.querySelector('.inputfield-device-name').classList.add("hide");
      document.querySelector('.inputfields-name').classList.remove("hide");
      document.querySelector('.inputfields-usernam-password').classList.add("hide");

      document.getElementById("1stepperID").classList.add("hide");
      document.getElementById("2stepperID").classList.remove("hide");
      document.getElementById("3stepperID").classList.add("hide");
      document.getElementById("4stepperID").classList.add("hide");
      break;
    case 2:
      document.querySelector('.inputfields-usernam-password').classList.remove("hide");
      document.querySelector('.inputfield-device-name').classList.add("hide");
      document.querySelector('.inputfields-name').classList.add("hide");
      document.querySelector('.inputfields-address').classList.add("hide");

      document.getElementById("1stepperID").classList.add("hide");
      document.getElementById("2stepperID").classList.add("hide");
      document.getElementById("3stepperID").classList.remove("hide");
      document.getElementById("4stepperID").classList.add("hide");
      break;
    case 3:
      document.querySelector('.inputfields-address').classList.remove("hide");
      document.querySelector('.inputfields-usernam-password').classList.add("hide");
      document.querySelector('.inputfield-device-name').classList.add("hide");
      document.querySelector('.inputfields-name').classList.add("hide");

      document.getElementById("1stepperID").classList.add("hide");
      document.getElementById("2stepperID").classList.add("hide");
      document.getElementById("3stepperID").classList.add("hide");
      document.getElementById("4stepperID").classList.remove("hide");
      break;
    case 4:
      document.getElementById('nextBtnID').onclick = function() {
        window.location.href = "/login.html";
      }
      break;

    default:
      console.log("Error log");

  }
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
