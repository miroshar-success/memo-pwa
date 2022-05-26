$(document).on("mouseup", ".btn-save", function() {
  var firstInputPass = document.querySelector('#first-passwordID');
  var htFirstInputPass = document.querySelector('#ht-first-passwordID');
  var secondInputPass = document.querySelector('#second-passwordID');
  var htSecondInputPass = document.querySelector('#ht-second-passwordID');

  if (firstInputPass.value && // if exist AND
    firstInputPass.value.length > 0 && // if value have one charecter at least
    firstInputPass.value.trim().length > 0 && // if value is not just spaces)
    secondInputPass.value && // if exist AND
    secondInputPass.value.length > 0 && // if value have one charecter at least
    secondInputPass.value.trim().length > 0 // if value is not just spaces)
  ) {
    htFirstInputPass.classList.add("hide");
    htSecondInputPass.classList.add("hide");
		
		var usernameToResetPassword = localStorage.getItem('usernameToReset');//get username from local storage
		sendNewPassword(usernameToResetPassword, firstInputPass.value);

  } else {
    if (!firstInputPass.value && // if exist AND
      !firstInputPass.value.length > 0 && // if value have one charecter at least
      !firstInputPass.value.trim().length > 0 // if value is not just spaces)
    ) {
      htFirstInputPass.classList.remove("hide");
    }else{
      htFirstInputPass.classList.add("hide");
    }
    if (!secondInputPass.value && // if exist AND
      !secondInputPass.value.length > 0 && // if value have one charecter at least
      !secondInputPass.value.trim().length > 0 // if value is not just spaces)
    ) {
      htSecondInputPass.classList.remove("hide");
    }else{
      htSecondInputPass.classList.add("hide");
    }
  }
});

function sendNewPassword(username, newPass) {
		var sendPath = "/updatePass";
		var xhttp = new XMLHttpRequest();
		xhttp.open("GET", sendPath);
		xhttp.responseType = 'text';
	  xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) 
    	{
				window.location.href = "/login.html";
			}
			else if(this.status >= 400)
			{
				windows.location.reload();		
			}
		}
		xhttp.setRequestHeader("X-username", username);
		xhttp.setRequestHeader("X-password", newPass);
		xhttp.send();		
}


$(document).on("mouseup", ".hide-password-one", function() {
  var x = document.getElementById("first-passwordID");
  var btn = document.getElementById("hideBtnOneID");

  if (x.type === "password") {
    btn.innerHTML = "Hide";
    x.type = "text";
  } else {
    btn.innerHTML = "Show";
    x.type = "password";
  }
});

$(document).on("mouseup", ".hide-password-two", function() {
  var x = document.getElementById("second-passwordID");
  var btn = document.getElementById("hideBtnTwoID");

  if (x.type === "password") {
    btn.innerHTML = "Hide";
    x.type = "text";
  } else {
    btn.innerHTML = "Show";
    x.type = "password";
  }
});
