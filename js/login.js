//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

    let loggedInUserInfo = document.getElementById("loggedInUser");
    let userName = GetSavedUser();
    if (userName != null && loggedInUserInfo != null) {
        loggedInUserInfo.innerHTML = userName;
    }

});

function enterSite() {
    if (checkUserInfo()) {
        SaveUser(document.getElementById("userField").value, false);
        location.href = "cover.html";
    }
}

function checkUserInfo() {
    let userField = document.getElementById("userField").value;
    let passwordField = document.getElementById("passwordField").value;
    let userInfo = document.getElementById("userFieldInfo");
    let passwordInfo = document.getElementById("passwordFieldInfo");

    let userOk = false;
    let passOk = false;
    //User info
    if (userField.length > userField.trim().length) { //Check for empty fields
        userInfo.innerHTML = "No puede ingresar espacios en blanco!";
    }
    else if (userField.trim() === "") {
        userInfo.innerHTML = "El campo no puede quedar vacío!";
    }
    else {
        userInfo.innerHTML = "";
        userOk = true;
    }

    //Password info
    if (passwordField.length > passwordField.trim().length) { //Check for empty fields
        passwordInfo.innerHTML = "No puede ingresar espacios en blanco!";
        return false;
    }
    else if (passwordField.trim() === "") {
        passwordInfo.innerHTML = "El campo no puede quedar vacío!";
        return false;
    }
    else {
        passwordInfo.innerHTML = "";
        passOk = true;
    }

    return userOk && passOk;
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    SaveUser(profile.getEmail(), true);
    location.href = "cover.html";
}

//Save the logged user name
function SaveUser(userName, isGoogleUser) {
    localStorage.setItem('userName', JSON.stringify({ email: userName, isGoogleUser: isGoogleUser}));
}

function GetSavedUser() {
    if (localStorage.getItem('userName') != null) {
        return JSON.parse(localStorage.getItem('userName')).email;
    }
    else {
        return null;
    }
}