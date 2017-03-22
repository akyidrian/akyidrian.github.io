document.addEventListener("DOMContentLoaded", function() {
    var userName = "akyidrian";
    var hostName = "gmail.com";
    var email = userName + "@" + hostName;
    var emailText = document.getElementsByClassName("emailtext")[0];
    var emailLink = document.getElementsByClassName("emaillink")[0];

    emailText.innerHTML = "<i class=\"fa fa-envelope-o\"></i>&nbsp; " + email;
    emailLink.href = "mailto: " +  email;
});
