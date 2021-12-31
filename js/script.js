//Typewriter "The City of lights"
const app = document.getElementById("typewriter");
const typewriter = new Typewriter(app, {
    loop: true,
    delay: 75
});

typewriter
.typeString('The City of Lights')
.pauseFor(200)
.start();


//variables globales
let productGrid = document.getElementById("productGrid");
let btnCart = document.getElementById("btnCart");
let modalBody = document.getElementById("modal-body");
let btnEndPurchase = document.getElementById("btnEndPurchase");
let totalPriceParag = document.getElementById("totalPriceParag");
let accumulator;

//productos cargos en el HTML por json/API
function loadGrid(products) {
    products.forEach( product => {
        productGrid.innerHTML += `
        <div class="d-flex my-5 mx-5 icono-wrap">
            <img src="./img/${product.img}" alt="${product.img}" height="200">
            <div class="d-flex row">
              <h3 class="fs-5 mt-2 ps-4 pb1">${product.name}</h3>
              <p class="ps-4">${product.brand}</p>
              <p class="ps-4">$${product.price}</p>
              <div class="ps-4 pb1">
                <button id="btn${product.id}" type="button" class="btn btn-outline-warning">Add to cart</button>
              </div>
            </div>
          </div>
        `
    });

    products.forEach((productArray) => {
      document.getElementById(`btn${productArray.id}`).addEventListener('click', () => {
        if (productList.find(product => product.name == productArray.name)) {
          let index = productList.findIndex(product => product.name == productArray.name)
          productList[index].cant++
          localStorage.setItem('cart', JSON.stringify(productList))
        } else {
          let newProduct = new Product(productArray.id, productArray.brand, productArray.name, productArray.category, productArray.price, productArray.stock, productArray.img)
          productList.push(newProduct)
          localStorage.setItem('cart', JSON.stringify(productList))
        }
      })
    })
}


function loadProducts () {
    fetch("./products.json")
    .then(response => response.json())
    .then(data => loadGrid(data))
    .catch(error => console.error(error))
}

loadProducts();


//validación del formulario - uso de jQuery
let validateMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/; //pau@gmail.com.ar
let validateNumber = /^[0-9]{10}$/; //1234567890

$(() => {
  $("#form").submit((e) => {
    e.preventDefault();

    let dataForm = new FormData(e.target);
    $('.errorMsg').hide();

    if (!validateMail.test(dataForm.get("email"))) {
      $('#erroremail').show();
    } else if (!validateNumber.test(dataForm.get("mobile"))) {
      $('#errormobile').show();
    } else {
      swal({
        title: "Message sent!",
        text: `Thank you ${dataForm.get("name")}. We will contact you as soon as possible.`,
        icon: './img/thumbsup.png',
      });
      $("#form").trigger("reset");
    }
  })
})

