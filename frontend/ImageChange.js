const images = document.querySelectorAll('.Overlay')

images.forEach((product) =>{
    product.addEventListener('mouseenter', () =>{
        product.style.opacity = "100%"
    });

    product.addEventListener('mouseleave', () =>{
        product.style.opacity = "0%"
    });
})

