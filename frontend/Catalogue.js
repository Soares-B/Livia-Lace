const divProducts = document.querySelector('.products')
const initialValue = document.querySelector('#preco-inicial')
const finalValue = document.querySelector('#preco-final')

initialValue.addEventListener("input", async () =>{
    showProducts();
})

finalValue.addEventListener("input", async () =>{
    showProducts();
})

let bico = false,
    xuxinha = false,
    tiara = false,
    faixa = false,
    presilha = false,
    pulseira = false;

function option(choose) {
    if (choose.id === 'checkbico') {
        bico = !bico
        showProducts();

    } else if (choose.id === 'checkxuxinha') {
        xuxinha = !xuxinha
        showProducts();

    } else if (choose.id === 'checktiara') {
        tiara = !tiara
        showProducts();

    } else if (choose.id === 'checkfaixa') {
        faixa = !faixa
        showProducts();

    } else if (choose.id === 'checkpresilha') {
        presilha = !presilha
        showProducts();

    } else if (choose.id === 'checkpulseira') {
        pulseira = !pulseira
        showProducts();
    }
}

async function showProducts(){
    
    const inicial = initialValue.value === "" ? 0 : Number(initialValue.value);
    const final = finalValue.value === "" ? 100000 : Number(finalValue.value);

    const vazio = !inicial && !final;

    const nenhumSelecionado =
        !bico &&
        !xuxinha &&
        !tiara &&
        !faixa &&
        !presilha &&
        !pulseira;

    const response = await fetch(`${API_URL}/api/getProducts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            bicoDePato: nenhumSelecionado ? true : bico,
            xuxinha: nenhumSelecionado ? true : xuxinha,
            tiara: nenhumSelecionado ? true : tiara,
            faixaDeBebe: nenhumSelecionado ? true : faixa,
            presilha: nenhumSelecionado ? true : presilha,
            pulseira: nenhumSelecionado ? true : pulseira,
            inicial: inicial ?? 0,
            final: final ?? 100000
        })
    });

    const data = await response.json();

    divProducts.innerHTML = ''

    data.forEach(prod => {

        const article = document.createElement('article')
        article.setAttribute('id', prod.product_id)

        const link1 = document.createElement('a')

        const img = document.createElement('img')
        img.src = prod.imagem

        link1.appendChild(img)
        link1.href = `/Product.html?id=${prod.product_id}`

        const link2 = document.createElement('a')

        const over = document.createElement('img')
        over.src = prod.image_overlay
        over.classList.add('Overlay')

        link2.appendChild(over)
        link2.href = `/Product.html?id=${prod.product_id}`

        const p = document.createElement('p')
        p.classList.add('productName')
        p.textContent = prod.nome

        const p2 = document.createElement('p')
        p2.classList.add('productValue')
        p2.textContent = `R$${(prod.valor).replace('.', ',')}`

        const input = document.createElement('input')
        input.type = 'button'
        input.value = 'Adicionar ao Carrinho'
        input.setAttribute('id', 'productPurchase')
        input.classList.add('productButton')

        input.addEventListener('click', async () => {
            const id = article.id

            const token = localStorage.getItem('Token')

            if (!token) {
                window.location.href = "/login";
            }

            const payload = JSON.parse(atob(token.split('.')[1]));
            const IDCliente = payload.id

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

            console.log(data)
        })

        article.appendChild(link1)
        article.appendChild(link2)
        article.appendChild(p)
        article.appendChild(p2)
        article.appendChild(input)
        divProducts.appendChild(article)
    });
}

showProducts();