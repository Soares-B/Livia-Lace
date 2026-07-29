const products = document.querySelectorAll('.product');
const content = document.querySelector('#content')

products.forEach(product => {
    const decrease = product.querySelector('.diminuir');
    const increase = product.querySelector('.aumentar');
    const amount = product.querySelector('.qtd');
    const remove = product.querySelector('.remove');
    const price = product.querySelector('.productPrice')
    const priceValue = Number(price.textContent.slice(2).replace(',', '.'))

    decrease.addEventListener('click', () => {
        let value = Number(amount.textContent);

        if (value > 1) {
            amount.textContent = value - 1;
            price.textContent = `R$${(priceValue * (value - 1)).toFixed(2).replace('.', ',')}`
        }
    });

    increase.addEventListener('click', () => {
        let value = Number(amount.textContent);

        amount.textContent = Number(amount.textContent) + 1;
        price.textContent = `R$${(priceValue * (value + 1)).toFixed(2).replace('.', ',')}`
    });

    remove.addEventListener('click', () => {
    const hr = product.nextElementSibling;
    const hr2 = product.previousElementSibling 

    product.remove();

    if (hr && hr.tagName === 'HR') {
        hr.remove();
    }

    if (hr2 && hr2.tagName === 'HR') {
        hr2.remove();
    }

    if (document.querySelectorAll('.product').length === 0){
        const p = document.createElement('p');
        p.setAttribute('id', 'noProducts')
        p.textContent = 'Nenhum produto adicionado ao carrinho'
        content.append(p)
    }
});
});