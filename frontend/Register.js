const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector('#email').value
    const username = document.querySelector('#usernameRegister').value
    const password = document.querySelector('#passwordRegister').value

    const response = await fetch("https://livia-lace.onrender.com/registerClient", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            username,
            password
        })
    })
    const data = await response.json();
    if (data === true){
        document.querySelector('#message').classList.add('show')

        setTimeout(() =>{
            window.location.href = "/Login.html"
        }, 2000);
    }
});