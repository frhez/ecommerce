//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

});

function onSignIn() {
    location.href = "cover.html";
}

function onSignOut() {
    var auth2;
    var signedIn;
    try {
        signedIn = auth2.isSignedIn.get();
        nonExistentFunction();
        if (signedIn) {
            gapi.auth2.GetAuthInstance().signOut().then(function () {
                location.href = "index.html";
            });
        }
    } catch (error) {
        location.href = "index.html";
    }
}