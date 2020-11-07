//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

    //Checks for user logged
    if (localStorage.getItem('userName')) {
        
        let profileData = localStorage.getItem("profileData");

        if (profileData) {
            loadProfileData(JSON.parse(profileData));
        }
        
        let profileImageURL = document.getElementById("profileImageURL");
        profileImageURL.addEventListener("input", function () {
            document.getElementById("profileImage").src = document.getElementById("profileImageURL").value;
        });
    }
    else {
        let content = `
        <div class="alert-info p-3 border border-info rounded" role="alert">
          <h5>Ups! Parece que no has iniciado sesión puedes hacerlo <a class="alert-link" href="index.html">haciendo click aquí.</a></h5>
        </div>
        `;
        document.getElementById("divProfile").innerHTML = content;
      }
});

//Get the profile fields and save them
function saveProfile() {
    //Get the fields
    let profileImageURL = document.getElementById("profileImageURL").value;
    let profileName = document.getElementById("profileName").value;
    let profileAge = document.getElementById("profileAge").value;
    let profileEmail = document.getElementById("profileEmail").value;
    let profilePhone = document.getElementById("profilePhone").value;
    //Sets the object with the content of the fields
    let profileData = {
        image: profileImageURL,
        name: profileName,
        age: profileAge,
        email: profileEmail,
        phone: profilePhone
    }
    //Save the object in local storage
    localStorage.setItem("profileData", JSON.stringify(profileData));

    //Refresh the page
    window.location = "my-profile.html"
}

//Load the profile data on the page
function loadProfileData(data) {
    //Get the fields
    let profileImage = document.getElementById("profileImage");
    let profileImageURL = document.getElementById("profileImageURL");
    let profileName = document.getElementById("profileName");
    let profileAge = document.getElementById("profileAge");
    let profileEmail = document.getElementById("profileEmail");
    let profilePhone = document.getElementById("profilePhone");
    //Put the values in the fields
    profileImageURL.value = data.image;
    //Put the default profile image if the url is empty
    if (data.image === ""){
        profileImage.src = "img/defaultProfileImage.png";
    }
    else {
        profileImage.src = data.image;
    }
    profileName.value = data.name;
    profileAge.value = data.age;
    profileEmail.value = data.email;
    profilePhone.value = data.phone;
}

//Delete the info of the profile in local storage and from the page
function deleteProfile() {
    localStorage.removeItem("profileData");
    document.getElementById("profileImage").src = "img/defaultProfileImage.png";
    document.getElementById("profileImageURL").value = "";
    document.getElementById("profileName").value = "";
    document.getElementById("profileAge").value = "";
    document.getElementById("profileEmail").value = "";
    document.getElementById("profilePhone").value = "";
}