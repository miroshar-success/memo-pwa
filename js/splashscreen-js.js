setTimeout(
	function(){
    var login_path = "/login.html";//"/index.html";
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", login_path, true);
    xhttp.send();
     //location.href ="/index.html";
		location.href = login_path;//"views/login.html";
    console.log("fire");
    }
  ,3000 /// milliseconds = 10 seconds
);
