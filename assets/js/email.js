document.addEventListener("DOMContentLoaded", function() {
    var userName = "akyidrian";
    var hostName = "gmail.com";
    var email = userName + "@" + hostName;
    
    var emailLinkElem = document.getElementById("email");
  	emailLinkElem.href = "mailto:" +  email;
    emailLinkElem.innerHTML += email;
});
