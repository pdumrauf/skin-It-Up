//carrito de compras
const items = document.getElementById('items');
const footerCart = document.getElementById('footerCart')
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCart = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
const btnEndPurchase = document.getElementById('btnEndPurchase');
const formatNum = new Intl.NumberFormat();
let cart = {};

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    btnEndPurchase.setAttribute("disabled", "disabled");
    //pregunto por el localStorage
    if(localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        paintCart();
    }
});
items.addEventListener('click', (e) => {
    btnAction(e)
})

const addCart = e => {
    //console.log(e.target)
    //console.log(e.target.classList.contains('btn-warning'))
    if(e.target.classList.contains('btn-warning')) {
        setCart(e.target.parentElement)
        swal("Your product has been added to the cart!");
    }
    e.stopPropagation()
}

const fetchData = async () => {
    try {
        const res = await fetch('products.json');
        const data = await res.json();
        //console.log(data)
        paintCards(data);
    } catch (error) {
        console.log(error);
    }
}

const paintCards = data => {
    //console.log(data);
    const grid = document.getElementById('productGrid');
    data.forEach(product => {
        templateCard.querySelector('.title').textContent = product.name;
        templateCard.querySelector('.price').textContent = product.price;
        templateCard.querySelector('.imgProduct').setAttribute("src", product.img);
        const btnCard = templateCard.querySelector('.btn-warning');
        btnCard.dataset.id = product.id;
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    grid.appendChild(fragment)
    grid.querySelectorAll('.btn-warning').forEach(btn => {
        btn.addEventListener('click', addCart);
    })
}



const setCart = object => {
    //console.log(object)
    const product = {
        id: object.querySelector('.btn-warning').dataset.id,
        title: object.querySelector('.title').textContent,
        price: object.querySelector('.price').textContent,
        amount: 1
    }

    if(cart.hasOwnProperty(product.id)) {
        product.amount = cart[product.id].amount + 1
    }
    
    cart[product.id] = {...product}; //esto es una copia de product
    paintCart();
} 

const paintCart = () => {
    //console.log(cart)
    items.innerHTML = "";
    Object.values(cart).forEach(product => {
        templateCart.querySelector('th').textContent = product.id;
        templateCart.querySelectorAll('td')[0].textContent = product.title;
        templateCart.querySelectorAll('td')[1].textContent = product.amount;
        templateCart.querySelector('.btn-info').dataset.id = product.id;
        templateCart.querySelector('.btn-danger').dataset.id = product.id;
        templateCart.querySelector('span').textContent = formatNum.format(product.amount * product.price);

        const clone = templateCart.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment)

    paintFooter()

    // para no reescribir el setItem, guardo los items en la funcion donde se pinta en el carrito con los items
    localStorage.setItem('cart', JSON.stringify(cart));
}

const paintFooter = () => {
    footerCart.innerHTML = "";
    btnEndPurchase.removeAttribute("disabled", "disabled");

    if(Object.keys(cart).length === 0 ) {
        footerCart.innerHTML = `
        <th scope="row" colspan="5">There are no products in your cart. Start buying!</th>`

        btnEndPurchase.setAttribute("disabled", "disabled");
        return
    }

    const nAmount = Object.values(cart).reduce((acc, {amount}) => acc + amount ,0);
    const nPrice = Object.values(cart).reduce((acc, {amount, price}) =>  acc + amount * price,0);
    
    templateFooter.querySelectorAll('td')[0].textContent = nAmount;
    templateFooter.querySelector('span').textContent = formatNum.format(nPrice);

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footerCart.appendChild(fragment);

    const btnEmpty = document.getElementById('empty-cart');
    btnEmpty.addEventListener('click', () => {
        cart = {};
        paintCart();
    })
}

const btnAction = e => {
    console.log(e.target)
    //Accion de aumentar producto en carrito modal
    if(e.target.classList.contains('btn-info')) {
        //console.log(cart[e.target.dataset.id])
        
        const product = cart[e.target.dataset.id]; 
        product.amount++
        cart[e.target.dataset.id] = {...product}
        paintCart() //para actualizar cantidad
    }

    if(e.target.classList.contains('btn-danger')) {
        
        const product = cart[e.target.dataset.id]; 
        product.amount--
        if(product.amount === 0) {
            delete cart[e.target.dataset.id]
        }
        paintCart()
    }

    e.stopPropagation()
}

btnEndPurchase.addEventListener('click', () => {
    cart = {};
    localStorage.setItem('cart', JSON.stringify({}));
    items.innerHTML = "";
    footerCart.innerHTML = `<th scope="row" colspan="5">There are no products in your cart. Start buying!</th>`;
    btnEndPurchase.setAttribute("disabled", "disabled");
    swal("Thank you for your purchase!", "Products will be delivered promptly.", "success");
})


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