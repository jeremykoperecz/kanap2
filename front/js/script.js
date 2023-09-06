let canapData = [];
//preparation de l'api
const fetchCanap = async () => {
    await fetch("http://localhost:3000/api/products")
        .then((res) => res.json())
        .then((data) => {
            canapData = data;
        });
};
//creation de la page index
const canapDisplay = async () => {
   await fetchCanap();

    document.getElementById("items").innerHTML = canapData.map((canap) =>`
    <div class="items items_a ">
    <div id="${canap._id}" class="items_article items_article:hover">
    <h3 class="items_article_h3">${canap.name}</h3>
    <img class="items_article_img" src="${canap.imageUrl}" alt="image de canap ${canap.altTxt}"/>
    <p class="items_article_p ">${canap.description}</p>
    </div>
    </div>
    `)
    //supression des virgules
        .join("");
    //envoie de l'url a la page product
    let idCart = document.querySelectorAll(".items_article");
    
    
    
    idCart.forEach((items_article) => 
        items_article.addEventListener("click", () => {
         window.location = `product.html?articleId=${items_article.id}`;
       }), 
     );
    
};
canapDisplay();




