const ORDER_BY_RELEVANCE = "Relevance";
const ORDER_BY_PRICE = "Price"
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
    } else if (criteria === ORDER_BY_PRICE) {
        result = array.sort(function (a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if (aCost < bCost) { return -1; }
            if (aCost > bCost) { return 1; }
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
            if (searchInput == undefined || product.name.toLowerCase().includes(searchInput.toLowerCase())) {
                htmlContentToAppend += `
                    <a href="product-info.html" class="list-group-item list-group-item-action">
                        <div class="row">
                            <div class="col-3">
                                <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
                            </div>
                            <div class="col">
                                <div class="d-flex w-100 justify-content-between">
                                    <h4 class="mb-1">`+ product.name + `</h4>
                                    <small class="text-muted">` + product.soldCount + ` vendidos</small>
                                    </div>
                                <p class="mb-1">` + product.description + `</p>
                                <br><br><br><h3 class="mb-1" style="text-align: right">` + product.currency + ` ` + product.cost.toLocaleString('es-UY') + `</h3>
                            </div>
                        </div>
                    </a>
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

    //Sorts the elements by price when click on the button
    document.getElementById("sortByPrice").addEventListener("click", function () {
        sortAndShowProducts(ORDER_BY_PRICE);
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
    document.getElementById("searchProductBar").addEventListener("keyup", function () {
        searchInput = document.getElementById("searchProductBar").value;

        if (searchInput == undefined || searchInput === "") {
            searchInput = undefined;
        }

        console.log(searchInput);
        showProductsList();
    });

});