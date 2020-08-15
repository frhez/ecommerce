//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
});

function enterSite() {
    if (checkUserInfo()) {
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
    else{
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
    /*
    if (userField.trim() === "" || passwordField.trim() === "") { //Check for empty fields
        alert("Hay campos sin completar");
        return false;
    }
    else if (userField.length > userField.trim().length || passwordField.length > passwordField.trim().length) {
        alert("No puede ingresar espacios en blanco!");
        return false;
    }
    else {
        return true;
    }
    */
}

function onSignIn() {
    location.href = "cover.html";
}

//Sign out the user
function onSignOut() {
    try {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            location.href = "index.html";
        });
    }
    catch (error) {
        console.error(error);
        location.href = "index.html";
    }
}
