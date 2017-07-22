document.addEventListener("DOMContentLoaded", function() {
    var userName = "akyidrian";
    var hostName = "gmail.com";
    var email = userName + "@" + hostName;
    
    var emailLinkElems = document.querySelectorAll("a.email");
    for (i = 0; i < emailLinkElems.length; i++) {
    	emailLinkElems[i].href = "mailto:" +  email;
    }

    var emailTextElems = document.querySelectorAll("span.email");
    for (i = 0; i < emailTextElems.length; i++) {
    	emailTextElems[i].innerHTML = email;	
    }
});
