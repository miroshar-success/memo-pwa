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

$(document).on("mouseup", ".btn-login", function() {
  var username = document.getElementById("usernameID").innerHTML;
  var password = document.getElementById("passwordID").innerHTML;

  var inputUsername = document.querySelector('#usernameID');
  var htUsername = document.querySelector('#ht-usernameID');
  var inputPasswordID = document.querySelector('#passwordID');
  var htPassword = document.querySelector('#ht-password');

  if (inputUsername.value && // if exist AND
    inputUsername.value.length > 0 && // if value have one charecter at least
    inputUsername.value.trim().length > 0 && // if value is not just spaces)
    inputPasswordID.value && // if exist AND
    inputPasswordID.value.length > 0 && // if value have one charecter at least
    inputPasswordID.value.trim().length > 0 // if value is not just spaces)
  ) {
    htUsername.classList.add("hide");
    htPassword.classList.add("hide");
    //console.log(" test");
    //window.location.href = "/index.html";

    //  window.location.href = "/index";

  } else {
    if (!inputUsername.value && // if exist AND
      !inputUsername.value.length > 0 && // if value have one charecter at least
      !inputUsername.value.trim().length > 0 // if value is not just spaces)
    ) {
      htUsername.classList.remove("hide");
    }else{
      htUsername.classList.add("hide");

    }

    if (!inputPasswordID.value && // if exist AND
      !inputPasswordID.value.length > 0 && // if value have one charecter at least
      !inputPasswordID.value.trim().length > 0 // if value is not just spaces)
    ) {
      htPassword.classList.remove("hide");
    }else{
      htPassword.classList.add("hide");

    }
  }

	sendLogin(inputUsername.value, inputPasswordID.value);//Send login credentials to controller
});

$(document).on("mouseup", "#btn-forgotPassID", function() {
  var username = document.getElementById("usernameID").innerHTML;

  var inputUsername = document.querySelector('#usernameID');
  var htUsername = document.querySelector('#ht-usernameID');
  
  if (inputUsername.value && // if exist AND
  			inputUsername.value.length > 0 && // if value have one charecter at least
  				inputUsername.value.trim().length > 0) // if value is not just spaces)
  {
		localStorage.setItem('usernameToReset', inputUsername.value);//store in local storage
		//window.location.href = "/resetpass.html";
		sendResetPass(inputUsername.value);
	}
	else
	{
		htUsername.classList.remove("hide");//we need the username to reset the password
	}
});


function sendResetPass(username) {
		var sendPath = "/resetPass";
		var xhttp = new XMLHttpRequest();
		xhttp.open("GET", sendPath);
		xhttp.responseType = 'text';
	  xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) 
    	{//username/email was found, move to select method of reset password
				window.location.href = "/resetpass.html";
			}
			else if(this.status >= 400)
			{
				var htIncorrectUsername = document.querySelector('#ht-incorrectUsernameID');
				htIncorrectUsername.classList.remove("hide");//we need the username to reset the password				
			}
		}
		xhttp.setRequestHeader("X-username", username);
		xhttp.send();	
}

function sendLogin(username, password) {
		var sendLoginPath = "/checkLogin";
		var xhttp = new XMLHttpRequest();
		xhttp.open("GET", sendLoginPath);
		xhttp.responseType = 'text';
	  xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
				setCookie("X-sessionCookie", xhttp.responseText);//, 15);//Set to approx 5 mins expiry
				console.log(xhttp.responseText);
				window.location.href = "/index.html";
				//getIndexPage();//Go to home page of the website after log in success
				//window.location.href = "/index.html";
			}
			else if(this.status >= 400)
			{
  				var htIncorrectLogin = document.querySelector('#ht-incorrectLoginID');
  				htIncorrectLogin.classList.remove("hide");
			}
		}
		xhttp.setRequestHeader("X-username", username);
		xhttp.setRequestHeader("X-password", password);
		xhttp.send();
}

function getIndexPage() {
		var sendPath = "/index.html";
		var xhttp = new XMLHttpRequest();
		xhttp.open("GET", sendPath);
		xhttp.responseType = 'text';
	  xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
				console.log("Login success");
				window.location.href = "/index.html";
			}
		}
		xhttp.send();
}

function setCookie(cname, cvalue) {//}, exmins) {
  document.cookie = cname + "=" + cvalue + ";path=/";
	console.log('Get X-sessionCookie' + getCookie("X-sessionCookie"));
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

$(document).on("mouseup", ".text-button-white-edit", function() {
  window.location.href = "/login.html";
});
