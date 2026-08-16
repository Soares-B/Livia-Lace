const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));
const image = document.querySelector('#productImage')
const name = document.querySelector('#productName')
const value = document.querySelector('#productPrice')
const caminho = document.querySelector('#path')
const quantidade = document.querySelector('#quantidade')

const decrease = document.querySelector('.diminuir');
const increase = document.querySelector('.aumentar');
const amount = document.querySelector('.qtd');

const buyButton = document.querySelector('#productPurchase')

let productAmount = Number(document.querySelector('.qtd').textContent)

const API_URL = "https://livia-lace.onrender.com";

decrease.addEventListener('click', () => {
    let value = Number(amount.textContent);

    if (value > 1) {
        amount.textContent = value - 1;
        productAmount = value - 1
    }
});

increase.addEventListener('click', () => {
    let value = Number(amount.textContent);

    amount.textContent = Number(amount.textContent) + 1;

    productAmount = value + 1
});

async function getData(id){

    const response = await fetch(`${API_URL}/api/ProductPage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            produto: id
        })
    });

    const data = await response.json();

    console.log(data)

    const link1 = document.createElement('a')
    link1.href = '/'
    link1.textContent = 'Início'

    const link2 = document.createElement('a')
    link2.href = '/Catalogue.html'
    link2.textContent = 'Catálogo'

    caminho.appendChild(link1)
    caminho.appendChild(document.createTextNode(' > '))
    caminho.appendChild(link2)
    caminho.appendChild(document.createTextNode(' > '))
    caminho.appendChild(document.createTextNode(String(data[0].product_id)))
    
    image.src = data[0].image_overlay;
    name.textContent = data[0].nome;
    value.textContent = `R$${(data[0].valor).replace('.', ',')}`
    quantidade.textContent = `Quantidade: ${data[0].quantidade}`
}

buyButton.addEventListener("click", async () =>{
    const token = localStorage.getItem('Token')

    if (!token) {
        window.location.href = "/login";
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const IDCliente = payload.id
    const quantidade = Number(document.querySelector('.qtd').textContent)

    const response = await fetch(`${API_URL}/api/AddtoCart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            IDCliente: IDCliente,
            purchase: {
                "produto": id,
                "quantidade": quantidade
            },
        })
    });
})

getData(id)