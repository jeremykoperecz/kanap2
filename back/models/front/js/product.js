
// recuperation de la clef product
const productUrl = new URLSearchParams(window.location.search)
const productId = productUrl.get('articleId')


//creation d'un tableau avec les valeurs du produit selectionné
let productFromAPI;

//appele de l'api avec fetch
const fetchProduct = async () => {
    await fetch(`http://localhost:3000/api/products/${productId}`)
        .then((res) => res.json())
        .then((data) => { 
            productFromAPI = data  
        });
};

const productDisplay = async () => {
    await fetchProduct();
    const containerImg = document.querySelector(".item__img");
//creation du containerImg

    containerImg.innerHTML = `
    <img class="item__img__img" src="${productFromAPI.imageUrl}" alt="image de canap ${productFromAPI.altTxt}"/>`

    document.getElementById("title").innerHTML = productFromAPI.name;
    document.getElementById("price").innerHTML = productFromAPI.price;
    document.getElementById("description").innerHTML = productFromAPI.description;
//creation de l'input pour la selection de la couleur
    
    const select = document.getElementById("colors");

    productFromAPI.colors.forEach((couleurs) => {

        
        const colorOption = document.createElement("option");
        

        colorOption.innerHTML = couleurs;
        colorOption.value = couleurs; 
        select.appendChild(colorOption);
    });
    
};

productDisplay();

//creation d'une fonction pour avoir un message pour l'utilisateur que son canapé a bien été ajouté au panier
function confirmationAjoutPanier() {
    alert('canapé ajouté au panier');
};
//association des données au bouton "ajouter au panier"


const button = document.querySelector("#addToCart")

button.addEventListener("click", () => {
   
    const color = document.querySelector("#colors").value
    let quantity = document.querySelector("#quantity").value
    const key = `${productFromAPI._id}_${color}`
    const canapToAdd = {
        id: productFromAPI._id,
        color: color,
        quantity: Number(quantity),
        image: productFromAPI.imageUrl,
        name: productFromAPI.name,
        altTxt: productFromAPI.altTxt,
    }
    // envoie de la selection dans le localstorage 
    if (color == null || color === "" || quantity < 1 || quantity > 100) {
        alert("veuillez choisir une couleur et une quantité")
        return;
    }

    // récupération panier localstorage
    const currentStorage = localStorage.getItem('cartCanap')
    // vérifier que le localstorage n'est pas null ?
    // vérification si la clé actuelle existe ou non
    const cartFromLocalStorage = JSON.parse(currentStorage)

    if (cartFromLocalStorage === null) {
        const storage = [canapToAdd]
        localStorage.setItem('cartCanap', JSON.stringify(storage));
    } else {
        // parcours du panier existant pour rechercher si la clé existe
        let canapIsAdded = false
        for (let i = 0; i < cartFromLocalStorage.length; i++) {
            // élément actuel ? 
            const canapInLocalStorage = cartFromLocalStorage[i]
            if (canapToAdd.id === canapInLocalStorage.id && canapToAdd.color === canapInLocalStorage.color) {
                cartFromLocalStorage[i].quantity += canapToAdd.quantity
                canapIsAdded = true
            }
        }

        // si le kanap n'a pas été ajouté, on le fait maintenant
        if (!canapIsAdded) cartFromLocalStorage.push(canapToAdd)
        
        // ajout au localstorage du panier à jour
        localStorage.setItem('cartCanap', JSON.stringify(cartFromLocalStorage));
    }
   
    confirmationAjoutPanier();
    window.location.href = "cart.html"
});
  

