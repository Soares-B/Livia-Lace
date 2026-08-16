const bicoDePato = [...document.querySelectorAll('#bico-de-pato .products article')]
get_5Best(bicoDePato);

const xuxinha = [...document.querySelectorAll('#xuxinha .products article')]
get_5Best(xuxinha)

const tiara = [...document.querySelectorAll('#Tiara .products article')]
get_5Best(tiara)

const faixaDeBebe = [...document.querySelectorAll('#Faixa-de-bebe .products article')]
get_5Best(faixaDeBebe)

const presilhaDeCabelo = [...document.querySelectorAll('#Presilha-de-cabelo .products article')]
get_5Best(presilhaDeCabelo)

const pulseira = [...document.querySelectorAll('#Pulseiras .products article')]
get_5Best(pulseira)

const buyButtons = document.querySelectorAll('#productPurchase')

buyButtons.forEach((button) =>{
  button.addEventListener("click", async () =>{

    const token = localStorage.getItem('Token')

    if (!token) {
        window.location.href = "/login";
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const IDCliente = payload.id

    const article = button.closest('article');
    const id = article.querySelector('img').id;

    const response = await fetch(`${API_URL}/api/AddtoCart`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          IDCliente: IDCliente,
          purchase: {
              "produto": Number(id),
              "quantidade": 1
          },
      })
  });

    const data = await response.json();
  })
})

async function get_5Best(tipo){

  let prodArray = [];

  tipo.forEach((article) =>{
    const underImage = article.querySelector('.Sublay')

    const productID = underImage.getAttribute('id')

    prodArray.push(productID)
})

  const response = await fetch(`${API_URL}/api/get_5Best`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prod1: prodArray[0],
            prod2: prodArray[1],
            prod3: prodArray[2],
            prod4: prodArray[3],
            prod5: prodArray[4]
        })
    });

    const data = await response.json();

    const produtosMap = Object.fromEntries(
        data.map(prod => [String(prod.product_id), prod])
    );

    const dataOrdenada = prodArray.map(id => produtosMap[String(id)]);

    tipo.forEach((article, index) =>{
      const underImage = article.querySelector('.Sublay')
      const overImage = article.querySelector('.Overlay')
      const productName = article.querySelector('.productName')
      const productvalue = article.querySelector('.productValue')
      const link = article.querySelectorAll('a')

      underImage.src = dataOrdenada[index].imagem
      overImage.src = dataOrdenada[index].image_overlay
      productName.textContent = dataOrdenada[index].nome
      productvalue.textContent = `R$${String((dataOrdenada[index].valor).toFixed(2)).replace('.', ',')}`

      link.forEach((link) =>{
        link.href = `/Product.html?id=${dataOrdenada[index].product_id}`
      })
    })
};