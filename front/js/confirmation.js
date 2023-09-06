//recuperation de l'orderId 
const urlParams = new URLSearchParams(window.location.search)
const urlOrderId = urlParams.get('orderId')
// creation du numero de commande grace a l'orderId
const span = document.querySelector('#orderId')
span.innerHTML = urlOrderId ;
// supression du localStorage
localStorage.clear();






    
