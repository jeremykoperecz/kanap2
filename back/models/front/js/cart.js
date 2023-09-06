/**
 * Déclaration des variables globales
 */

const item = localStorage.getItem("cartCanap");
const cartLocalStorage = JSON.parse(item);

let canapsWithPricesFromApi = {};

/**
 * Déclaration des fonctions
 */
async function getPrices() {
  canapsWithPricesFromApi = await fetch(`http://localhost:3000/api/products/`)
    .then((res) => res.json())
    .then((canaps) =>
      canaps.map((canap) => {
        return {
          id: canap._id,
          price: canap.price,
        };
      })
    );
}

async function addQuantityListener() {
  // récupération de l'input
  const inputs = document.querySelectorAll(".itemQuantity");
  // ajout du listener sur l'événement "change"
  inputs.forEach((tagQuantity) =>
    tagQuantity.addEventListener("change", (event) => {
      // récupérer la quantité souhaitée
      const quantityWanted = event.target.value;
      const canapId = event.target.dataset.id;
      const canapColor = event.target.dataset.color;

      // récupérer le canap actuel dans le local storage
      cartLocalStorage.forEach((canap) => {
        // selectionner le canap
        if (canapId === canap.id && canapColor === canap.color) {
          // on est sur le bon canapé
          canap.quantity = quantityWanted;
        }
      });
      // mettre à jour le localstorage
      localStorage.setItem("cartCanap", JSON.stringify(cartLocalStorage));
      // mettre à jour la quantité totale dans le DOM
      displayTotalQuantity();
      displayTotalPrice();
    })
  );
}

// supprimer un canap du panier
async function addListenerToRemoveCanap() {
  // récupération de l'input
  const deleteItems = document.querySelectorAll(".deleteItem");
  // ajout du listener sur l'événement "change"
  deleteItems.forEach((deleteCanap) =>
    deleteCanap.addEventListener("click", (event) => {
      const canapId = event.target.dataset.id;
      const canapColor = event.target.dataset.color;
      cartLocalStorage.forEach((canap, index) => {
        // selectionner le canap
        if (canap.quantity != 0 && canapColor === canap.color) {
          // supprimer le canapé
          cartLocalStorage.splice(index,1);    
        }
      });
      //mettre a jour le localstorage
      localStorage.setItem("cartCanap", JSON.stringify(cartLocalStorage));
      // mettre a jour le DOM
      displayTotalQuantity();
      displayTotalPrice();
    })
  );
}

// retourne le prix d'un canapé
function priceCanap(canapPriceWanted) {
  return canapsWithPricesFromApi
    .filter((canapFromPrice) => canapPriceWanted.id === canapFromPrice.id)
    .pop();
}

// calcul de la quantité total
function displayTotalQuantity() {
  let total = 0;
  cartLocalStorage.forEach((canap) => (total += Number(canap.quantity)));
  document.getElementById("totalQuantity").textContent = total;
}
// calcul du prix total
function displayTotalPrice() {
  let totalPrice = 0;
  cartLocalStorage.forEach((canap) => {
    price = canapsWithPricesFromApi;
    totalPrice += canap.quantity * priceCanap(canap).price;
  });
  document.getElementById("totalPrice").textContent = totalPrice;
}
// affichage des produits dans le DOM
async function displayAllCanaps() {
  document.getElementById("cart__items").innerHTML = cartLocalStorage.map(
    (canap) => `
<article class="cart__item" data-id=${canap.id} data-color=${canap.color}>
                <div class="cart__item__img">
                <img src="${canap.image}" alt=${canap.altTxt}>
                </div>
                <div class="cart__item__content">

                  <div class="cart__item__content__description">
                    <h2>${canap.name}</h2>
                    <p>${canap.color}</p>
                    <p> ${priceCanap(canap).price} €</p>
                  </div>

                  <div class="cart__item__content__settings">

                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" data-id=${canap.id} data-color=${
      canap.color
    } class="itemQuantity" name="itemQuantity" min="1" max="100" value=${
      canap.quantity
    }>
                    </div>

                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem" data-id=${canap.id} data-color=${
      canap.color
    } >Supprimer</p> 
                    </div>

                  </div>
                  
                </div>
              </article> `
  );
}

//fonction de verification du formulaire
function isFormNotValid() {
  const inputs = document.querySelectorAll(".cart__order__form input");
  let formIsNotValid = false;
  inputs.forEach((input, index) => {
    if (index === inputs.length - 1) return;

    const nextElement = document.querySelector(`#${input.id} + p`);

    if (input.value === "") {
      nextElement.innerHTML = "veuillez remplir le formulaire";
      formIsNotValid = true;
    } else {
      nextElement.innerHTML = "";
    }
  });
  return formIsNotValid;
}

//verification email
function isEmailNotValid() {
  const email = document.getElementById("email").value;
  const regex = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
  if (regex.test(email) === false) {
    return true;
  }
  return false;
}
//verification quantité produit
function tooMuchProduct() {
  const tooMuchCanap = document.querySelector(".itemQuantity").value;
  if (tooMuchCanap > 100 || tooMuchCanap < 1) {
    alert("quantité non valide");
    return true;
  }
  return false;
}
//verification de la presence de produits
function localStorageEmpty() {
  if (cartLocalStorage === null) {
    alert("selectionner un canap svp");
    return true;
  }
  return false;
}

//verification du formulaire
function addListenerSubmitForm() {
  document.getElementById("order").addEventListener("click", (event) => {
    event.preventDefault();
    handleSubmitForm();
  });
}

const handleSubmitForm = () => {
  if (isFormNotValid() || isEmailNotValid()) {
    alert("formulaire non valide");
    return;
  } else if (tooMuchProduct() || localStorageEmpty()) {
    return;
  } else {
    const body = {
      contact: {
        firstName: document.getElementById('firstName').value, 
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value,
      },
      products: cartLocalStorage.map((canap) => canap.id),
    };
    console.log(body);
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(
        (order) =>
          (window.location.href = `./confirmation.html?orderId=${order.orderId}`)
      );
  }
};

//orchestrator

async function process() {
  await getPrices();
  await displayAllCanaps();

  displayTotalQuantity();
  displayTotalPrice();

  addQuantityListener();
  addListenerToRemoveCanap();

  addListenerSubmitForm();
}
process();
