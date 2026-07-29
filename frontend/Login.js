const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector('#emailEnter').value
    const password = document.querySelector('#passwordEnter').value

    const response = await fetch("http://localhost:5000/loginClient", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    })
    const data = await response.json();
    const message = document.querySelector('#message')

    if (response.ok){
        message.textContent = 'Login realizado com sucesso!'
        message.classList.add('show')
        localStorage.setItem('Token', data.token)
        
        setTimeout(() =>{
            window.location.href = "/"
        }, 2000);
    }

    if (response.status !== 200){
        message.textContent = data.message
        message.classList.add('show')
        setTimeout(() =>{
            message.classList.remove('show')
        }, 2000);
    }
});