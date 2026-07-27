const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector('#emailEnter').value
    const password = document.querySelector('#passwordEnter').value

    const response = await fetch("/loginClient", {
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
    if (data === true){
        document.querySelector('#message').classList.add('show')
        
        setTimeout(() =>{
            window.location.href = "http://localhost:5000"
        }, 2000);
    }
});