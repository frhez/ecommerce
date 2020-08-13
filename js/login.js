//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    //Loads the API
    gapi.load('auth2', function () {

        gapi.auth2.init({

            client_id: "490154075016-33kn7mda6khg18l899gn8m0bpcnbomdg.apps.googleusercontent.com",

        })
    });
});

function onSignIn() {
    location.href = "cover.html";
}

function onSignOut() {
    var signedIn;
    try {
        signedIn = auth2.isSignedIn.get();
        if (signedIn) {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                auth2.disconnect();
            });
            location.href = "index.html";
        }
        else{
            location.href = "index.html";
        }
    } catch (error) {
        console.log(error);
    }
}