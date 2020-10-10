let cartArticles = [];

//Shows the articles in the cart
function showArticles(articlesArray) {
  let content = "";
  let cartArticlesDiv = document.getElementById("cartArticles");

  for (let i = 0; i < articlesArray.length; i++) {
    let article = articlesArray[i];

    let totalArticlePrice = article.unitCost * article.count;

    if (article.currency === "USD") {
      totalArticlePrice *= 40;
    }

    content += `
        <div id="cartArticle${i}" class="d-flex row mx-0 py-2 border-bottom">
              <div class="col-12 col-lg-6 p-2">
                <div class="d-flex row h-100 align-items-center mx-0">
                  <div class="col-4 px-0">
                    <img src="${article.src}" alt="${article.name}" class="img-thumbnail">
                  </div>
                  <div class="col">
                    <div class="row mx-0 h-100">
                      <div class="col py-2">
                        <h4 class="w-100 mb-0 text-center font-weight-light">${article.name}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col p-2 border rounded m-2">
                <div class="row mx-0 px-2 h-100 d-flex align-items-center">
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
                        <p class="col mb-0 pl-1 text-center text-danger" style="font-size: 0.9em;">Se utiliza un valor del dólar de $40</p>
                      </div>
                    `
        ;
    }

    content += `
                  </div>
                </div>
              </div>
            </div>
        `;
  }
  cartArticlesDiv.innerHTML = content;

  calcSubtotal();
}

//Change the total price of an article when the quantity change
function changeArticleTotal(articleIdNumber, currency) {
  //Takes the price numbers from the html, also take cares of the dots in the number 
  let articlePrice = numberFromText(document.getElementById(`article${articleIdNumber}Price`).innerHTML);
  let articleQuantity = document.getElementById(`article${articleIdNumber}Quantity`);
  let articleTotalPrice = document.getElementById(`article${articleIdNumber}TotalPrice`);

  //Checks for the max quantity
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
  let subtotal = document.getElementById("subtotal").innerHTML;
  subtotal = numberFromText(subtotal);
  let shippingTypeNumber = document.getElementById("shippingPriceInfo").innerHTML;
  shippingTypeNumber = numberFromText(shippingTypeNumber);

  if (shippingTypeNumber != null) {
    let shippingCost = (shippingTypeNumber * subtotal) / 100;
    document.getElementById("shippingPrice").innerHTML = priceFromNumber(shippingCost);

    calcTotal();
  }
}

//Calculate the total price and show value in the page
function calcTotal() {
  //Gets the values needed
  let subtotal = document.getElementById("subtotal").innerHTML;
  subtotal = numberFromText(subtotal);
  let shippingPrice = document.getElementById("shippingPrice").innerHTML;
  shippingPrice = numberFromText(shippingPrice);

  let total = subtotal + shippingPrice;
  total = priceFromNumber(total);

  document.getElementById("total").innerHTML = total;
}

//Applies the selected shipping type and sets the total price
function applyShippingType() {
  //Gets the input fields
  let shippingAddressStreet = document.getElementById("shippingAddressStreet");
  let shippingAddressNumber = document.getElementById("shippingAddressNumber");
  let shippingAddressCorner = document.getElementById("shippingAddressCorner");
  let shippingCountry = document.getElementById("shippingCountry");
  let shippingType = document.getElementsByName("shippingType");
  let shippingValue = 0;
  for (let i = 0; i < shippingType.length; i++) {
    if (shippingType[i].checked) {
      shippingValue = parseInt(shippingType[i].value);
    }
  }

  $('#shippingTypeModal').modal('hide'); //Hide modal

  //Shows the info enter by the user
  let shippingInfoContent = `
      <p class="m-0 p-2" style="font-size: 0.9em;">
        <span class="font-weight-bold">Dirección</span>: ${shippingAddressStreet.value} ${shippingAddressNumber.value}, esquina ${shippingAddressCorner.value}. ${shippingCountry.value}.
        <br>
        <span class="font-weight-bold">Método de envío</span>: Premium(<span class="text-pink">+${shippingValue}%</span>)
      </p>
    `;
  document.getElementById("shippingInfo").innerHTML = shippingInfoContent;
  document.getElementById("shippingPriceInfo").innerHTML = `+${shippingValue}%`;

  //Calculates subtotal and shipping cost and show them on the page
  let subtotal = document.getElementById("subtotal").innerHTML;
  subtotal = numberFromText(subtotal);
  let shippingCost = (shippingValue * subtotal) / 100;
  document.getElementById("shippingPrice").innerHTML = priceFromNumber(shippingCost);
  //Activate the confirm buy button
  document.getElementById("buyBtnInfo").classList.add("d-none");
  document.getElementById("confirmBuyBtn").disabled = false;

  calcTotal();
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
      applyShippingType();
    }
    shippingForm.classList.add("was-validated");
  });


});