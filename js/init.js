const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
//const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

var showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function (url) {
  var result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

//Sign out the user
function onSignOut() {
  let userLogged = localStorage.getItem('userName');
  if (userLogged) {
    userLogged = JSON.parse(userLogged);
    if (userLogged.isGoogleUser) {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
      });
    }
  }
  location.href = "index.html";
  localStorage.clear();
}

function loadLogInDiv(userLoggedIn) {
  let logInDiv = document.getElementById("logInDiv");

  //In the log in screen doesnt make sense
  if (logInDiv) {
    let content = "";

    if (userLoggedIn) {

      let userName = JSON.parse(userLoggedIn).email;
      content = `
              <a class="dropdown-toggle btn btn-login  rounded-pill" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                <span class="font-weight-bold">${userName}</span>
              </a>
              <div class="dropdown-menu dropdown-menu-right bg-light-pink text-center text-lg-left" aria-labelledby="navbarDropdown">
                <a class="dropdown-item text-pink px-3" href="cart.html"><i class="fas fa-shopping-cart text-center" style="width:28px"></i> Mi carrito</a>
                <a class="dropdown-item text-pink px-3" href="my-profile.html"><i class="fas fa-user text-center" style="width:28px"></i> Perfil</a>
                <div class="dropdown-divider" style="border-color: #f1cdd3;"></div>
                <button class="dropdown-item text-pink px-3" onclick="onSignOut()"><i class="fas fa-times text-center" style="width:28px"></i> Cerrar sesión</button>
              </div>
      `;
    }
    else {
      content = `
            <div id="askToLogInDiv">
              <a href="index.html" class="btn btn-login">Iniciar sesión</a>
            </div>
      `;
    }

    logInDiv.innerHTML = content;
  }

}

//Return the sign from a currency
function convertCurrencySign(currency){
  if(currency === "USD"){ return "$USD"}
  if(currency === "UYU"){ return "$"}
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

  let userName = localStorage.getItem('userName');

  loadLogInDiv(userName);

});