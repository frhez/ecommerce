let cartArticles = [];

//Shows the articles in the cart
function showArticles(articlesArray) {
  let content = "";
  if (articlesArray.length > 0) {

    let cartArticlesDiv = document.getElementById("cartArticles");

    for (let i = 0; i < articlesArray.length; i++) {
      let article = articlesArray[i];

      let totalArticlePrice = article.unitCost * article.count;

      if (article.currency === "USD") {
        totalArticlePrice *= 40;
      }

      content += `
            <div id="cartArticle${i}" class="d-flex row mx-0 py-3 border-bottom">
              <div class="d-flex row h-100 align-items-center">
                <div class="col-12 col-lg-5">

                <div class="d-flex row justify-content-center p-3">
                  <img src="${article.src}" alt="${article.name}" class="img-thumbnail w-50">
                </div>
                <div class="d-flex row">
                  <h5 class="w-100 mb-0 text-center font-weight-light" id="articleName${i}">${article.name}</h5>
                </div>
                <!--
                  <div class="d-flex row align-items-center mx-0">
                    <div class="col-5 px-0">
                      <img src="${article.src}" alt="${article.name}" class="img-thumbnail">
                    </div>
                    <div class="col">
                      <div class="row mx-0 h-100">
                        <div class="col py-2 px-0">
                          <h4 class="w-100 mb-0 text-center font-weight-light" id="articleName${i}">${article.name}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  -->
                </div>
  
                <div class="col">
                  <div class="row mx-0 px-3 py-2 h-100 d-flex align-items-center border rounded">
                    <div class="col py-1 px-0">
                      <div class="d-flex row align-items-center mx-0">
                        <h6 class="col-4 mb-0 pl-1">Precio: </h6>
                        <h4 class="col mb-0 px-0 text-right">${convertCurrencySign(article.currency)} <span id="article${i}Price">${article.unitCost.toLocaleString('es-UY')}</span></h4>
                      </div>
                    </div>
                    <div class="w-100"></div>
                    <div class="col py-1 px-0">
                      <div class="d-flex row align-items-center mx-0">
                        <h6 class="col-4 mb-0 pl-1">Cantidad: </h6>
                        <input type="number" min="1" max="1000000" value="${article.count}" id="article${i}Quantity" class="col-8 form-control h-100" onchange="changeArticleTotal(${i}, '${article.currency}')">
                      </div>
                    </div>
                    <div class="w-100"></div>
                    <div class="col py-1 px-0">
                      <div class="d-flex row align-items-center mx-0">
                        <h6 class="col-4 mb-0 pl-1">Total: </h6>
                        <h4 class="col mb-0 px-0 font-weight-bold text-right"><span id="article${i}TotalPrice" class="articleTotal">${priceFromNumber(totalArticlePrice)}</span></h4>
                      </div>
                    </div>
                    <div class="w-100"></div>
                    `;

      if (article.currency === "USD") {
        content += `
                    <div class="col py-1 px-0">
                      <div class="d-flex row align-items-center mx-0">
                        <p class="col mb-0 pl-1 rounded bg-light-pink text-center text-danger" style="font-size: 0.9em;">Se utiliza un valor del dólar de $40</p>
                      </div>
                    </div>
                    `;
      }

      content += `
                      
                  </div>
                  <div class="w-100"></div>
                  <div class="col my-3 p-0">
                    <button class="btn btn-sm btn-block btn-danger" onclick="removeArticle(${i})"><span class="fas fa-trash-alt"></span> | Quitar articulo</button>
                  </div>
                </div>
              </div>
            </div>
          `;
    }
    cartArticlesDiv.innerHTML = content;

    calcSubtotal();
  }
  else {
    //Puts a message indicating there is no articles in the cart
    content += `
          <div class="">
            No cuentas con ningún articulo en tu carrito, puedes encontrar lo que quieras <a class="alert-link" href="products.html">aquí.</a>
          </div>
    `;

    document.getElementById("divCarrito").innerHTML = content;
  }
}

//Change the total price of an article when the quantity change
function changeArticleTotal(articleIdNumber, currency) {
  //Takes the price numbers from the html, also take cares of the dots in the number 
  let articlePrice = numberFromText(document.getElementById(`article${articleIdNumber}Price`).innerHTML);
  let articleQuantity = document.getElementById(`article${articleIdNumber}Quantity`);
  let articleTotalPrice = document.getElementById(`article${articleIdNumber}TotalPrice`);

  //Checks if the quantity is correct
  if (articleQuantity.value === "") {
    articleQuantity.value = articleQuantity.min;
  }
  if (parseInt(articleQuantity.value) > articleQuantity.max) {
    articleQuantity.value = articleQuantity.max;
  }
  else if (parseInt(articleQuantity.value) < articleQuantity.min) {
    articleQuantity.value = articleQuantity.min;
  }
  articleQuantity = parseInt(articleQuantity.value);


  let total = articlePrice * articleQuantity;

  if (currency === "USD") {
    total *= 40;
  }

  articleTotalPrice.innerHTML = priceFromNumber(total);

  calcSubtotal();
}

//Calculate the subtotal and sets the subtotal price
function calcSubtotal() {
  //Gets all the articles totals in an integer array 
  let articlesTotalsNodes = document.getElementsByClassName("articleTotal");
  let articlesTotals = [];
  for (let i = 0; i < articlesTotalsNodes.length; i++) {
    articlesTotals.push(parseInt(numberFromText(articlesTotalsNodes[i].innerHTML)));
  }

  let subtotal = 0;
  for (let i = 0; i < articlesTotals.length; i++) {
    subtotal += articlesTotals[i];
  }

  document.getElementById("subtotal").innerHTML = priceFromNumber(subtotal);

  calcShippingPrice();
}

//Calcs the shipping price based on the subtotal and the shipping type
function calcShippingPrice() {
  let subtotal = numberFromText(document.getElementById("subtotal").innerHTML);
  let shippingTypeNumber = getShippingType();

  if (shippingTypeNumber != null) {
    let shippingCost = (shippingTypeNumber * subtotal) / 100;
    document.getElementById("shippingPrice").innerHTML = priceFromNumber(shippingCost);

    calcTotal();
  }
}

//Calculate the total price and show value in the page
function calcTotal() {
  //Gets the values needed
  let subtotal = numberFromText(document.getElementById("subtotal").innerHTML);
  let shippingPrice = numberFromText(document.getElementById("shippingPrice").innerHTML);

  let total = subtotal + shippingPrice;
  total = priceFromNumber(total);
  document.getElementById("total").innerHTML = total;
}

//Applies the selected shipping address
function applyShippingAddress() {
  //Gets the input fields
  let shippingAddressStreet = document.getElementById("shippingAddressStreet");
  let shippingAddressNumber = document.getElementById("shippingAddressNumber");
  let shippingAddressCorner = document.getElementById("shippingAddressCorner");
  let shippingCountry = document.getElementById("shippingCountry");


  $('#shippingTypeModal').modal('hide'); //Hide modal

  //Shows the info enter by the user
  let shippingInfoContent = `
    <div class="row align-items-center mx-0 border rounded">
      <p class="m-0 p-2" style="font-size: 0.9em;">
        <span class="font-weight-bold">Dirección del envío: </span>
        ${shippingAddressStreet.value} ${shippingAddressNumber.value}, esquina ${shippingAddressCorner.value}. ${shippingCountry.value}.
      </p>
    </div>
    `;
  document.getElementById("shippingInfo").innerHTML = shippingInfoContent;

  //Activate the confirm buy button
  document.getElementById("confirmBuyBtn").disabled = false;

}

//Gets the selected shipping type and return its value
function getShippingType() {
  let shippingType = document.getElementsByName("shippingType");
  let shippingValue = 0;
  for (let i = 0; i < shippingType.length; i++) {
    if (shippingType[i].checked) {
      shippingValue = parseInt(shippingType[i].value);
    }
  }
  return shippingValue;
}

//Removes the article from the list
function removeArticle(id) {
  let articleName = document.getElementById("articleName" + id).innerHTML;

  //Search for the name in the array
  for (let i = 0; i < cartArticles.length; i++) {
    if (cartArticles[i].name === articleName) {
      cartArticles.splice(i, 1);
      break;
    }
  }

  showArticles(cartArticles);

}

//Remove the dots and the signs return a clean number (int)
function numberFromText(price) {
  let number = price.replace(/\D/g, "");
  if (number != "") {
    number = parseInt(number);
    return number;
  }
  else {
    return null;
  }
}

//Return a number as a price in pesos uruguayos
function priceFromNumber(number) {
  let price = "$" + number.toLocaleString('es-UY');
  return price;
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  document.getElementById("confirmBuyBtn").disabled = true;

  getJSONData(CART_INFO_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      cartArticles = resultObj.data.articles;
      showArticles(cartArticles);
    }
  });

  let shippingForm = document.getElementById("shippingTypeForm");

  shippingForm.addEventListener('submit', function (event) {
    if (shippingForm.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    else {
      event.preventDefault();
      event.stopPropagation();
      applyShippingAddress();
    }
    shippingForm.classList.add("was-validated");
  });

  let shippingTypeBtns = document.getElementsByName("shippingType");

  for (let i = 0; i < shippingTypeBtns.length; i++) {
    shippingTypeBtns[i].addEventListener('click', function () {
      calcShippingPrice();
    });
  }


});