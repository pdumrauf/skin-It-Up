//carga de productos en el modal
function loadProductModal(productStorage) {
    modalBody.innerHTML = ""
    btnEndPurchase.removeAttribute("disabled");
    if( !productStorage || !productStorage.length) {
       modalBody.innerHTML = 
       `<div>
            <p>There are no products in your cart.</p>
        </div>`

        btnEndPurchase.setAttribute("disabled", "disabled");
        return;
    }

    productStorage.forEach(productCart => {
        
        modalBody.innerHTML += `
            <div class="card border-primary mb-3" id ="productCart${productCart.id}" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-4">
                            <img src="./img/${productCart.img}" class="img-fluid rounded-start" alt="...">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                    
                        <h5 class="card-title">${productCart.name}</h5>
                        <div class="row">
                            <p class="card-text">Cantidad: ${productCart.cant}</p>
                            <button class= "btn btn-outline-secondary" id="sum${productCart.id}"><i class="fas fa-plus"></i></button>
                            <button class= "btn btn-outline-secondary" id="rest${productCart.id}"><i class="fas fa-minus"></i></button> 
                        </div>
                        <p class="card-text">$${new Intl.NumberFormat("de-DE").format(productCart.price * productCart.cant)}</p> 
                        <button class= "btn btn-danger" id="btnDelete${productCart.id}"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            `
    })

    loadEventsModal(productStorage);
    totalPurchase(productStorage);
}

function deleteProduct(productCart, index) {
    console.log(`Product ${productCart.name} deleted.`);
    document.getElementById(`productCart${productCart.id}`).remove();
    productList.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(productList));
    const cartLocalStorage = JSON.parse(localStorage.getItem('cart'));
    loadProductModal(cartLocalStorage);

    if(!cartLocalStorage.length) {
        totalPriceParag.innerHTML = "";
    }
}

//eventos en modal: remover y aumentar/disminuir cantidad de productos
function loadEventsModal(productStorage) {
    productStorage.forEach((productCart, index) => {
        document.getElementById(`btnDelete${productCart.id}`).addEventListener('click', function() {
            deleteProduct(productCart, index);
        })
    })

    productStorage.forEach((productCart, index) => {
        document.getElementById(`sum${productCart.id}`).addEventListener('click', () => {
            if(productList[index].cant < productList[index].stock) {
                productList[index].cant++;
                localStorage.setItem('cart', JSON.stringify(productList));
                loadProductModal(JSON.parse(localStorage.getItem('cart')));
            }
        })
    })

    productStorage.forEach((productCart, index) => {
        document.getElementById(`rest${productCart.id}`).addEventListener('click', () => {
            if(productList[index].cant > 1) {
                productList[index].cant--;
                localStorage.setItem('cart', JSON.stringify(productList));
                loadProductModal(JSON.parse(localStorage.getItem('cart')));
            }
        })
    })
}


//funcion para mostrar el total de una compra en el carrito
function totalPurchase(productStorage) {
    accumulator = 0;
    productStorage.forEach(productCart => {
        accumulator += productCart.price * productCart.cant;
    })

    if (accumulator == 0) {
        totalPriceParag.innerHTML = ""
        modalBody.innerHTML = "<p>There aren't any products in you cart.</p>";
    } else {
        totalPriceParag.innerHTML = `Total $${new Intl.NumberFormat("de-DE").format(accumulator)}`;
    }
}


btnCart.addEventListener('click', () => {
    let productStorage = JSON.parse(localStorage.getItem('cart'));
    loadProductModal(productStorage);
})

btnEndPurchase.addEventListener('click', () => {
    localStorage.setItem('cart', JSON.stringify([]));
    modalBody.innerHTML = "";
    totalPriceParag.innerHTML = "";
    btnEndPurchase.setAttribute("disabled", "disabled");
    swal("Thank you for your purchase!", "Products will be delivered promptly.", "success");
})

