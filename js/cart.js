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

                <div class="d-flex row justify-content-center m-2">
                  <img src="${article.src}" alt="${article.name}" class="img-thumbnail w-50">
                </div>
                <div class="d-flex row my-3">
                  <h5 class="w-100 mb-0 text-center font-weight-light" id="articleName${i}">${article.name}</h5>
                </div>
                <!-- With the image on the left and text on the right
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
                        <h6 class="col-3 mb-0 pl-1">Precio: </h6>
                        <h4 class="col mb-0 px-0 text-right">${convertCurrencySign(article.currency)} <span id="article${i}Price">${article.unitCost.toLocaleString('es-UY')}</span></h4>
                      </div>
                    </div>
                    <div class="w-100"></div>
                    <div class="col py-1 px-0">
                      <div class="d-flex row align-items-center mx-0">
                        <h6 class="col-5 mb-0 pl-1">Cantidad: </h6>
                        <input type="number" min="1" max="1000000" value="${article.count}" id="article${i}Quantity" class="col form-control h-100" onchange="changeArticleTotal(${i}, '${article.currency}')">
                      </div>
                    </div>
                    <div class="w-100"></div>
                    <div class="col py-1 px-0">
                      <div class="d-flex row align-items-center mx-0">
                        <h6 class="col-3 mb-0 pl-1">Total: </h6>
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
          <div class="alert-warning p-3 border border-warning rounded" role="alert">
            No cuentas con ningún articulo en tu carrito, puedes encontrar lo que quieras <a class="alert-link" href="products.html">haciendo click aquí.</a>
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
  document.getElementById("shippingPriceInfo").innerHTML = "+" + shippingTypeNumber + "%";

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


  $('#shippingAddressModal').modal('hide'); //Hide modal

  //Shows the info enter by the user
  let shippingInfoContent = `
    <p id="shippingAddressConfirmed" class="border rounded m-0 p-2" style="font-size: 0.9em;">
      <span class="font-weight-bold">Dirección del envío: </span>
      ${shippingAddressStreet.value} ${shippingAddressNumber.value}, esquina ${shippingAddressCorner.value}. ${shippingCountry.value}.
    </p>
    `;
  document.getElementById("shippingInfo").innerHTML = shippingInfoContent;

  //Put the success class in the button
  document.getElementById("shippingAddressBtn").classList.remove("btn-info");
  document.getElementById("shippingAddressBtn").classList.add("btn-success");
  //Activate the confirm purchase button if the payment method is correct
  if (document.getElementById("paymentMethodConfirmed")) {
    let confirmPurchaseBtn = document.getElementById("confirmPurchaseBtn");
    confirmPurchaseBtn.disabled = false
    confirmPurchaseBtn.classList.remove("btn-secondary");
    confirmPurchaseBtn.classList.add("btn-primary");
  }
}

//Change between the payment methods
function changePaymentMethod() {
  let paymentMethod = document.getElementsByName("paymentMethod");
  let creditCardForm = document.getElementById("creditCardForm");
  let bankTransferForm = document.getElementById("bankTransferForm");

  for (let i = 0; i < paymentMethod.length; i++) {
    if (paymentMethod[i].checked && paymentMethod[i].value === "1") {
      creditCardForm.classList.remove("d-none");
      bankTransferForm.classList.add("d-none");
    }
    else if (paymentMethod[i].checked && paymentMethod[i].value === "2") {
      bankTransferForm.classList.remove("d-none");
      creditCardForm.classList.add("d-none");
    }
  }
}

//Applies the paymenth method and show the info on the page
function applyPaymentMethod(method) {
  if (method === "1") {
    //Payment credit card

    let paymentInfoContent = `
    <div id="paymentMethodConfirmed" class="col border rounded p-2" style="font-size: 0.9em;">
      <p class="m-0">
        <span class="font-weight-bold">Método de pago: </span>
        Tarjeta de crédito
      </p>
      <p class="m-0">
        <span class="font-weight-bold">Titular de trajeta: </span>
        ${document.getElementById("creditCardOwner").value}
      </p>
      <p class="m-0">
        <span class="font-weight-bold">Número de trajeta: </span>
        ${document.getElementById("creditCardNumber").value}
      </p>
    </div>
    `;
    document.getElementById("paymentInfo").innerHTML = paymentInfoContent;
  }
  else if (method === "2") {
    //Payment bank transfer

    let paymentInfoContent = `
    <div id="paymentMethodConfirmed" class="col border rounded p-2" style="font-size: 0.9em;">
      <p class="m-0">
        <span class="font-weight-bold">Método de pago: </span>
        Transferencia bancaria.
      </p>
      <p class="m-0">
        <span class="font-weight-bold">Banco: </span>
        ${document.getElementById("bankName").value}
      </p>
      <p class="m-0">
        <span class="font-weight-bold">Número de cuenta: </span>
        ${document.getElementById("bankAccountNumber").value}
      </p class="m-0">
    </div>
    `;
    document.getElementById("paymentInfo").innerHTML = paymentInfoContent;
  }

  $('#paymentMethodModal').modal('hide'); //Hide modal

  //Put the success class in the button
  document.getElementById("paymentMethodBtn").classList.remove("btn-info");
  document.getElementById("paymentMethodBtn").classList.add("btn-success");
  //Activate the confirm purchase button if the shipping address is correct
  if (document.getElementById("shippingAddressConfirmed")) {
    let confirmPurchaseBtn = document.getElementById("confirmPurchaseBtn");
    confirmPurchaseBtn.disabled = false
    confirmPurchaseBtn.classList.remove("btn-secondary");
    confirmPurchaseBtn.classList.add("btn-primary");
  }
}

//Show all the info of the purchase
function confirmPurchaseInfo() {
  //Article data
  let articleContent = `
  <div class="row">
    <div class="col font-weight-bold">Nombre</div>
    <div class="col-2 font-weight-bold d-none d-md-block">Precio</div>
    <div class="col-2 font-weight-bold d-none d-md-block">Cant.</div>
    <div class="col font-weight-bold text-right">Total</div>
  </div>
  <hr>
  `;
  for (let i = 0; i < cartArticles.length; i++) {
    let article = cartArticles[i];
    articleContent += `
    <div class="row">
      <div class="col">${article.name}</div>
      <div class="col-2 d-none d-md-block">${convertCurrencySign(article.currency)} ${article.unitCost.toLocaleString('es-UY')}</div>
      <div class="col-2 d-none d-md-block">${document.getElementById(`article${i}Quantity`).value}</div>
      <div class="col text-right">${document.getElementById(`article${i}TotalPrice`).innerHTML}</div>
    </div>
    `;
    if (i < cartArticles.length - 1) {
      articleContent += "<hr>";
    }
  }
  document.getElementById("confirmPurchaseArticles").innerHTML = articleContent;

  //Shipping data
  let shippingType = getShippingType();
  let shippingTypeInfo = "";
  switch (shippingType) {
    case 5:
      {
        shippingTypeInfo = "Standard (LLegada del envío entre 12-15 días)";
      }
      break;
    case 7:
      {
        shippingTypeInfo = "Express (LLegada del envío entre 5-8 días)";
      }
      break;
    case 15:
      {
        shippingTypeInfo = "Premium (LLegada del envío entre 2-5 días)";
      }
      break;
  }
  let shippingDataContent = "";
  shippingDataContent += `
  <div class="row">
    <div class="col">
      <p><span class="font-weight-bold">Tipo: </span>
      ${shippingTypeInfo}
      </p>
    </div>
  </div>
  `;

  let shippingAddress = document.getElementById("shippingAddressConfirmed").innerHTML;
  shippingDataContent += `
  <div class="row">
    <div class="col">
      ${shippingAddress}
    </div>
  </div>
  `;
  document.getElementById("confirmPurchaseShippingData").innerHTML = shippingDataContent;

  //Costs info
  let costsContent = "";
  costsContent += `
  <div class="row align-items-end">
    <div class="col text-left font-weight-bold">Subtotal</div>
    <div class="col text-right">${document.getElementById("subtotal").innerHTML}</div>
  </div>
  <div class="row align-items-end">
    <div class="col text-left font-weight-bold">Envío</div>
    <div class="col text-right">${document.getElementById("shippingPrice").innerHTML}</div>
  </div>
  <div class="row align-items-end">
    <div class="col text-left font-weight-bold">Total</div>
    <div class="col text-right">${document.getElementById("total").innerHTML}</div>
  </div>
  `;
  document.getElementById("confirmPurchaseCosts").innerHTML = costsContent;

  //Payment data
  let paymentData = document.getElementById("paymentMethodConfirmed").innerHTML;
  let paymentDataContent = paymentData;
  document.getElementById("confirmPurchasePaymentData").innerHTML = paymentDataContent;
}

//Confirm the purchase and show a message
function confirmPurchase() {
  $('#confirmPurchaseModal').modal('hide'); //Hide modal
  let content = `
  <div class="alert-success p-3 border border-success rounded" role="alert">
    <h5>La compra ha sido realizada con éxito!</h5>
    <h5>Descubre nuevos y fascinantes artículos <a class="alert-link" href="products.html">haciendo click aquí.</a></h5>
  </div>
  `;

  document.getElementById("divCarrito").innerHTML = content;
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
  //Check if the value is correct
  if (shippingValue === 0) {
    shippingType[0].checked = true;
    shippingValue = parseInt(shippingType[0].value);
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

  //Checks for user logged
  if (localStorage.getItem('userName')) {
    document.getElementById("confirmPurchaseBtn").disabled = true;

    getJSONData(CART_INFO_URL).then(function (resultObj) {
      if (resultObj.status === "ok") {
        cartArticles = resultObj.data.articles;
        showArticles(cartArticles);
      }
    });

    //Manage the validation in the address form
    let shippingForm = document.getElementById("shippingAddressForm");

    shippingForm.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (shippingForm.checkValidity() === true) {
        applyShippingAddress();
      }
      shippingForm.classList.add("was-validated");
    });

    //Manage the validation in the payment method form
    let creditCardForm = document.getElementById("creditCardForm");

    creditCardForm.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (creditCardForm.checkValidity() === true) {
        applyPaymentMethod("1");
      }
      creditCardForm.classList.add("was-validated");
    });

    //Manage the validation in the payment method form
    let bankTransferForm = document.getElementById("bankTransferForm");

    bankTransferForm.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (bankTransferForm.checkValidity() === true) {
        applyPaymentMethod("2");
      }
      bankTransferForm.classList.add("was-validated");
    });

    //Manage the change in the shipping type
    let shippingTypeBtns = document.getElementsByName("shippingType");

    for (let i = 0; i < shippingTypeBtns.length; i++) {
      shippingTypeBtns[i].addEventListener('change', function () {
        calcShippingPrice();
      });
    }

    //Manage the change in the payment method
    let paymentMethodBtns = document.getElementsByName("paymentMethod");

    for (let i = 0; i < paymentMethodBtns.length; i++) {
      paymentMethodBtns[i].addEventListener('change', function () {
        changePaymentMethod();
      });
    }
  }
  else {
    let content = `
    <div class="alert-info p-3 border border-info rounded" role="alert">
      <h5>Ups! Parece que no has iniciado sesión puedes hacerlo <a class="alert-link" href="index.html">haciendo click aquí.</a></h5>
    </div>
    `;
    document.getElementById("divCarrito").innerHTML = content;
  }
});