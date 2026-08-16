const content = document.querySelector('#content')
const total = document.querySelector('#totalValue')
const token = localStorage.getItem('Token')

const API_URL = "https://livia-lace.onrender.com";

if (!token) {
    window.location.href = "/login";
}

const payload = JSON.parse(atob(token.split('.')[1]));
const IDCliente = payload.id

async function productsInfo(){
    
    const response = await fetch(`${API_URL}/api/getCart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            IDCliente: IDCliente,
        })
    });

    const data = await response.json();

    const arrayData = data.produtos

    const productInfo = await Promise.all(

        arrayData.map(async (product) => {
            const response = await fetch(`${API_URL}/api/productInfo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    product_id: product.produto
                })
            });

            return await response.json();
        })
    );

    return {
        arrayData, 
        productInfo
    }
}

async function getCartItems(){
    
    const { arrayData, productInfo } = await productsInfo();

    putProducts(arrayData, productInfo)
}

getCartItems();

function putProducts(array, info){

    array.forEach((produto, index) =>{
        const article = document.createElement('article')
        article.classList.add('product')
        article.setAttribute('id', produto.produto)

        const div1 = document.createElement('div')
        div1.classList.add('principal')

        const img = document.createElement('img')
        img.src = info[index].imagem;
        img.classList.add('productImage')

        const p = document.createElement('p')
        p.textContent = info[index].nome;
        p.classList.add('productName')

        const link1 = document.createElement('a')
        link1.href = `/Product.html?id=${produto.produto}`
        link1.appendChild(img)

        const link2 = document.createElement('a')
        link2.href = `/Product.html?id=${produto.produto}`
        link2.appendChild(p)

        const p2 = document.createElement('p')
        p2.textContent = `R$${String((Number(info[index].valor) * produto.quantidade).toFixed(2)).replace('.', ',')}`
        p2.classList.add('productPrice')

        const input = document.createElement('input')
        input.type = 'button'
        input.value = 'Remover'
        input.classList.add('remove')

        const div2 = document.createElement('div')
        div2.classList.add('amount')

        const button1 = document.createElement('button')
        button1.classList.add('diminuir')
        button1.textContent = '-'

        const span = document.createElement('span')
        span.classList.add('qtd')
        span.textContent = produto.quantidade

        const button2 = document.createElement('button')
        button2.classList.add('aumentar')
        button2.textContent = '+'

        const hr = document.createElement('hr')

        article.appendChild(div1)
        div1.appendChild(link1)
        div1.appendChild(link2)
        article.appendChild(p2)
        article.appendChild(input)
        article.appendChild(div2)
        div2.appendChild(button1)
        div2.appendChild(span)
        div2.appendChild(button2)

        content.appendChild(article)
        content.appendChild(hr)
    })

    const products = document.querySelectorAll('.product');
    let valorTotal = 0

    products.forEach(product => {
        const decrease = product.querySelector('.diminuir');
        const increase = product.querySelector('.aumentar');
        const amount = product.querySelector('.qtd');
        const remove = product.querySelector('.remove');
        const price = product.querySelector('.productPrice')
        const name = product.querySelector('.productName').textContent
        const originalPrice = (info.find(prod => prod.nome === name)).valor;
        const priceValue = Number(originalPrice)

        valorTotal += priceValue * Number(amount.textContent);

        decrease.addEventListener('click', () => {
            let value = Number(amount.textContent);

            if (value > 1) {
                amount.textContent = value - 1;
                price.textContent = `R$${(priceValue * (value - 1)).toFixed(2).replace('.', ',')}`
                valorTotal -= priceValue
                total.textContent = `R$${((valorTotal).toFixed(2)).replace('.', ',')}`
            }
        });

        increase.addEventListener('click', () => {
            let value = Number(amount.textContent);

            amount.textContent = Number(amount.textContent) + 1;
            price.textContent = `R$${(priceValue * (value + 1)).toFixed(2).replace('.', ',')}`
            valorTotal += priceValue
            total.textContent = `R$${((valorTotal).toFixed(2)).replace('.', ',')}`
        });

        remove.addEventListener('click', () => {
        const hr = product.nextElementSibling;
        const hr2 = product.previousElementSibling
        
        valorTotal -= (priceValue * Number(amount.textContent))
        total.textContent = `R$${((valorTotal).toFixed(2)).replace('.', ',')}`
        product.remove();

        if (hr && hr.tagName === 'HR') {
            hr.remove();
        }

        if (hr2 && hr2.tagName === 'HR') {
            hr2.remove();
        }

        if (document.querySelectorAll('.product').length === 0){
            const p = document.createElement('p');
            const payment = document.querySelector('#payment')

            payment.remove();
            p.setAttribute('id', 'noProducts')
            p.textContent = 'Nenhum produto adicionado ao carrinho'
            content.append(p)
        }

        
        });
    });

    total.textContent = `R$${((valorTotal).toFixed(2)).replace('.', ',')}`
}

const checkout = document.querySelector('#checkout')

checkout.addEventListener("click", async () =>{

    const response = await fetch(`${API_URL}/api/getClientInfo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                IDCliente: IDCliente,
            })
        });

    const data = await response.json();
    delete data.referencia;
    delete data.id_client;

    const pass = Object.values(data).some(item => item === null);

    if (!pass){

        const pagamento = window.open('', '_blank');

        const { arrayData, productInfo } = await productsInfo();

        let valorTotal = null;

        const carrinhoCompleto = [];
        const products = document.querySelectorAll('.product');
        
        productInfo.forEach((product, index) =>{
            valorTotal += (Number(product.valor) * arrayData[index].quantidade)
        })

        valorTotal = valorTotal.toFixed(2)


        products.forEach(produto =>{
            const quantidade = Number(produto.querySelector('.qtd').textContent)
            
            carrinhoCompleto.push({
                produto: Number(produto.id),
                quantidade: quantidade
            })
        });

const response = await fetch(`${API_URL}/api/inserttoCart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                IDCliente: IDCliente,
                carrinhoCompleto,
                valorTotal
            })
        });

        const data = await response.json();

        console.log(data)

        const test = await hfetc(`${API_URL}/api/checkout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                IDCliente: IDCliente,
            })
        });

        const dataTest = await test.json();

        pagamento.location.href = dataTest.init_point;

    }else{
        const er = document.querySelector('#errorMessage')

        er.classList.add('show')

        setTimeout(() =>{
            er.classList.remove('show')
        }, 5000);
    }
})