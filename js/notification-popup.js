var FailCounter = 0; //creating a counter
//hideNotification();
$(document).ready(function() {
    hideNotification();
});

// Interval to check connection every 15s
setInterval( 
    function(){
        //Checking to see if is online
        // if(navigator.onLine){ //online
        //     hideNotification(); //hiding notification
        //     console.log("online");

        //     //Loading the image
        //     var image = document.images[0];
        //     var downloadingImage = new Image();
        //     downloadingImage.onload = function(){
        //     image.src = this.src;   
        //     };
        //     downloadingImage.src = "/favicon.ico";
        // }

        // else{ //offline
        //     console.log("offline, " + counter);
        //     counter ++; //incrementing counter

        //     if(counter >= 2){
        //         showNotification(); //showing notification
        //     }
        // }
        getLogo();
        if(FailCounter >= 2)
        {
            showNotification(); //showing notification
        }
    }, 15000);

// Getting the Favicon Logo
function getLogo() {
    var sendPath = "/favicon.ico";
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", sendPath);
    xhttp.responseType = 'text';
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) 
        {
            if(this.status == 200)
            {
                //hide the popup when device is connected
                console.log("Connection success!");
                hideNotification();

                //sets counter equal to 0
                FailCounter = 0;
            }
            else FailCounter++;
        }
    }
    xhttp.send();
}

// Show/hide function of notification popup
function showNotification() {
    $('#notification-popup').show();
}

function hideNotification() {
    $('#notification-popup').hide();
}