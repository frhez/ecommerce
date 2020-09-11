const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
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
  localStorage.clear();
}

function loadLogInDiv(userLoggedIn) {
  let logInDiv = document.getElementById("logInDiv");

  //In the log in screen doesnt make sense
  if(logInDiv){
    let content = "";
  
    if (userLoggedIn){
  
      let userName = JSON.parse(userLoggedIn).email;
      content = `
            <div id="loggedInDiv" class="d-none d-md-inline-block bg-light rounded-pill border border-primary my-2">
              <span id="loggedInUser" class="pl-3 pr-1 font-weight-bold align-middle">${userName}</span>
              <button onclick="onSignOut()" class="btn btn-primary py-0 rounded-pill">Salir</button>
            </div>
      `;
    }
    else{
      content = `
            <div id="askToLogInDiv" class="d-none d-md-inline-block rounded-pill border border-primary my-2">
              <a href="index.html" class="btn btn-primary py-0 rounded-pill">Iniciar sesión</a>
            </div>
      `;
    }
  
    logInDiv.innerHTML = content;
  }

}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  
  let userName = localStorage.getItem('userName');

  loadLogInDiv(userName);

});