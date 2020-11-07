const ORDER_BY_RELEVANCE = "Relevance";
const ORDER_BY_PRICE_ASC = "PriceASC"
const ORDER_BY_PRICE_DESC = "PriceDESC"
var currentProductsArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;
var searchInput = undefined;

function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_BY_RELEVANCE) {
        result = array.sort(function (a, b) {
            let aSoldCount = parseInt(a.soldCount);
            let bSoldCount = parseInt(b.soldCount);

            if (aSoldCount > bSoldCount) { return -1; }
            if (aSoldCount < bSoldCount) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_PRICE_ASC) {
        result = array.sort(function (a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if (aCost < bCost) { return -1; }
            if (aCost > bCost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_PRICE_DESC) {
        result = array.sort(function (a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if (aCost > bCost) { return -1; }
            if (aCost < bCost) { return 1; }
            return 0;
        });
    }
    return result;
}

function showProductsList() {

    let htmlContentToAppend = "";
    for (let i = 0; i < currentProductsArray.length; i++) {
        let product = currentProductsArray[i];

        //Check for the price filters
        if ((minCount == undefined || minCount <= parseInt(product.cost)) &&
            (maxCount == undefined || parseInt(product.cost) <= maxCount)) {

            //Check for the searched word
            if (searchInput == undefined || product.name.toLowerCase().indexOf(searchInput) != -1) {

                let productName = product.name;

                if (searchInput != undefined) {

                    productName = "";

                    let firstLetter = product.name.toLowerCase().indexOf(searchInput);
                    let lastLetter = firstLetter + searchInput.length;

                    if (firstLetter > 0) {
                        productName = product.name.substring(0, firstLetter);
                    }
                    productName += '<span style="text-decoration: underline;">';
                    productName += product.name.substring(firstLetter, lastLetter);
                    productName += '</span>';

                    if (lastLetter < product.name.length) {
                        productName += product.name.substring(lastLetter, product.name.length);
                    }
                }

                htmlContentToAppend += `
                <div class="col-12 col-md-4 my-3">
                    <button onclick="toProduct(` + i + `)" class="btn border rounded shadow h-100">
                        <div class="row d-flex p-3">
                            <div class="col">
                                <div class="row mb-3">
                                    <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
                                </div>
                                <div class="row mt-3">
                                    <div class="card">
                                        <div class="card-header">
                                            <div class="row align-items-center text-center">
                                                <h5 class="col font-weight-bold">`+ productName + `</h5>
                                                <hr class="w-100">
                                                <h4 class="col">` + convertCurrencySign(product.currency) + ` ` + product.cost.toLocaleString('es-UY') + `</h4>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <p class="">` + product.description + `</p>
                                        </div>
                                        <div class="card-footer text-right">
                                            <small class="text-muted">` + product.soldCount + ` vendidos</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </button>
                </div>
                `
            }
        }
    }

    document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
}

function sortAndShowProducts(sortCriteria, productsArray) {
    currentSortCriteria = sortCriteria;

    if (productsArray != undefined) {
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestro los productos ordenados
    showProductsList();
}


function toProduct(index){
    //localStorage.setItem('productIndex', JSON.stringify({productIndex: index}));
    window.location = "product-info.html";
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    //Gets the content of the json
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            sortAndShowProducts(ORDER_BY_RELEVANCE, resultObj.data);
        }
    });

    //Sorts the elements by relevance when click on the button
    document.getElementById("sortByRelevance").addEventListener("click", function () {
        sortAndShowProducts(ORDER_BY_RELEVANCE);
    });

    //Sorts the elements by price when click on the button from lower to higher
    document.getElementById("sortByPriceAsc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_BY_PRICE_ASC);
    });

    //Sorts the elements by price when click on the button from higher to lower
    document.getElementById("sortByPriceDesc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_BY_PRICE_DESC);
    });

    //Filter the elements by its price when click on the button 'Filtrar'
    document.getElementById("rangeFilterCount").addEventListener("click", function () {

        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
        }
        else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        }
        else {
            maxCount = undefined;
        }

        showProductsList();
    });

    //Clear the filters
    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProductsList();
    });

    //Search bar
    document.getElementById("searchProductBar").addEventListener("input", function () {
        searchInput = document.getElementById("searchProductBar").value;

        if (searchInput == undefined || searchInput === "") {
            searchInput = undefined;
        }
        else {
            searchInput = searchInput.toLowerCase()
        }

        showProductsList();
    });

});