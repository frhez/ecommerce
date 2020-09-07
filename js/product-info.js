var product;
var comments = [];


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    //Gets the content of the json
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            comments = resultObj.data;
        }

        //Gets the content of the json
        getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
            if (resultObj.status === "ok") {
                product = resultObj.data;
                seeProduct();
            }
        });
    });

    checkWriteComment();

});

//Check if there is an user logged in
function checkWriteComment() {
    if (localStorage.getItem('userName')) {
        document.getElementById("writeComment").classList.remove("d-none");
        document.getElementById("writeComment").classList.add("d-block");
    }
}

//Show the message on the screen
function publishComment() {
    //Gets the values
    let rate = document.getElementById("commentRate").value;
    let commentContent = document.getElementById("commentContent").value;
    let user = JSON.parse(localStorage.getItem('userName')).email;
    let d = new Date();
    let date = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + " " +
        ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
    let comment = { score: rate, description: commentContent, user: user, dateTime: date };

    console.log(comment);

    //Load the commment on the page
    comments.push(comment);
    document.getElementById("productComments").innerHTML = "";
    loadProductComments();

    //Clear the published message
    commentContent.value = "";
}

//Loads the product info
function loadProductInfo() {
    //Product info
    let productInfo = "";

    //Product name
    productInfo += `
        <div class="col-12 col-lg-8">
            <div class="row mt-3 mr-md-4">
                <h2 class="col-12 col-md-8 font-weight-bold">${product.name}</h2>`;

    //Load the stars
    //Calculate the average
    let rateAvg = 0;
    for (let i = 0; i < comments.length; i++) {
        rateAvg += comments[i].score;
    }
    rateAvg /= comments.length;

    productInfo += '<div class="col-12 col-md-4 text-md-right text-left">';
    productInfo += rateAsStars(rateAvg);

    productInfo += `
                <span>${rateAvg}/5</span>
                <div class="w-100"></div>
                <span class="text-muted">${product.soldCount} vendidos.</span>
            </div>
        </div>`;

    //Puts the product images on a carousel
    //Carousel starts
    productInfo += `
        <div id="carouselExampleIndicators" class="carousel slide my-3 mr-md-4" data-ride="carousel">
            <ol class="carousel-indicators">`;
    //The list of elements
    for (let i = 0; i < product.images.length; i++) {
        if (i === 0) {
            productInfo += `<li data-target="#carouselExampleIndicators" data-slide-to="` + i + `" class="active"></li>`;
        }
        else {
            productInfo += `<li data-target="#carouselExampleIndicators" data-slide-to="` + i + `"></li>`;
        }
    }
    productInfo += `
            </ol>
            <div class="carousel-inner">`;
    //The carousel images
    for (let i = 0; i < product.images.length; i++) {
        if (i === 0) {
            productInfo += `
                    <div class="carousel-item active">
                        <img class="d-block w-100" src="` + product.images[i] + `">
                    </div>
            `;
        }
        else {
            productInfo += `
                    <div class="carousel-item">
                        <img class="d-block w-100" src="` + product.images[i] + `">
                    </div>
            `;
        }
    }
    productInfo += `
                </div>
                <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>
        </div>`;
    //End with carousel

    //Puts the price and description
    productInfo += `
        <div class="col-12 col-lg-4 border rounded">
            <div class="row">
                <h1 class="w-100 text-center m-4">${product.currency} ${product.cost.toLocaleString('es-UY')}</h1>
                <div class="w-100"></div>
                <button class="btn btn-primary w-100 mx-4">Añadir al carrito</button>
                <div class="w-100 border-bottom my-4"></div>
                <p class="col mx-4 align-self-center">${product.description}</p>
            </div>
    `;


    document.getElementById("productInfo").innerHTML = productInfo;
}

function loadProductComments() {
    //Comments
    let productComments = `
        <h4 class="font-weight-bold">Comentarios</h4>
    `;

    //Display all comments
    for (let i = 0; i < comments.length; i++) {
        productComments += `
        <div class="card w-100 my-3">
            <div class="card-header py-2">
                <div class="row d-flex">
                    <div class="col-12 col-md-9">
                        <h4 class="mb-1">${comments[i].user}</h4>
                    </div>
                    <div class="col text-left text-md-right align-self-center">`;

        //Puts the rate as stars
        productComments += rateAsStars(comments[i].score);

        productComments += `
                    </div>
                </div>
            </div>
            <div class="card-body">
              <p class="mb-0">${comments[i].description}</p>
            </div>
            <div class="card-footer py-1 text-left text-md-right">
               <span class="text-muted mb-1">${comments[i].dateTime}</span>
            </div>
        </div>
        `;
    }

    document.getElementById("productComments").innerHTML = productComments;
}


//Loads the info of the product into the page
function seeProduct() {
    loadProductInfo();
    loadProductComments();
}



//Returns a string with the html code containing the stars (The returned string must be inside a div)
function rateAsStars(rate) {
    let starString = "";

    //Starts putting the stars
    let starsIn = 0;
    //The complete stars
    let completeStars = Math.trunc(rate);
    starsIn += completeStars;

    for (let i = 0; i < completeStars; i++) {
        starString += '<span class="fas fa-star star checked"></span>';
    }

    //Check for half star
    if (rate % 1 > 0 && rate % 1 <= 0.5) {
        starsIn++;
        starString += '<span class="fas fa-star-half-alt star checked"></span>';
    }

    //Empty stars
    for (let i = 0; i < 5 - starsIn; i++) {
        starString += '<span class="far fa-star star checked"></span>';
    }
    //End putting stars

    return starString;
}