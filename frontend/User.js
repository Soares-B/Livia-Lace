const front = document.querySelector('#frontUser')
const address = document.querySelector('#addressUser')
const dashboard = document.querySelector('#dashboardUser')

const emailSection = document.querySelector('#email')
const cpfSection = document.querySelector('#cpf')
const addressSection = document.querySelector('#address')

const cpf = document.querySelector('#cpfText')
const cpfSend = document.querySelector('#cpfForm')
const states = document.querySelectorAll('li')
const stateButton = document.querySelector('#state')
const campus = document.querySelectorAll('.campus')
const phone = document.querySelector('#telefone')
const cepElement = document.querySelector('#ceptext')
const cidade = document.querySelector('#cidade')
const rua = document.querySelector('#rua')
const referencia = document.querySelector('#referencia')

const username = document.querySelector('#username')
const emailText = document.querySelector('#emailHere')

const deleteButton = document.querySelector('#deleteButton')
const formulario = document.querySelector('#endereco')

const token = localStorage.getItem('Token')

const API_URL = "https://livia-lace.onrender.com";

if (!token) {
    window.location.href = "/login";
}

const payload = JSON.parse(atob(token.split('.')[1]));

if (!payload.admin){
    dashboard.remove()
}

username.textContent = payload.name;
emailText.textContent = payload.email;

phone.addEventListener("input", () => {
    let value = phone.value.replace(/\D/g, "");

    if (value.length > 11){
        value = value.slice(0, 11);
    }

    if (value.length <= 2){
        phone.value = value.replace(/(\d{0,2})/, "($1");
    }else if (value.length <= 7){
        phone.value = value.replace(/(\d{2})(\d+)/, "($1) $2");
    }else{
        phone.value = value.replace(
            /(\d{2})(\d{5})(\d+)/,
            "($1) $2-$3"
        );
    }
});

cepElement.addEventListener("input", () => {
    let value = cepElement.value.replace(/\D/g, "");

    if (value.length > 8) {
        value = value.slice(0, 8);
    }

    if (value.length <= 5) {
        cepElement.value = value;
    } else {
        cepElement.value = value.replace(
            /(\d{5})(\d+)/,
            "$1-$2"
        );
    }
});

cpf.addEventListener("input", () => {
    let value = cpf.value.replace(/\D/g, "");

    if (value.length > 11){
        value = value.slice(0, 11);
    }

    if (value.length <= 3) {
        cpf.value = value;
    } else if (value.length <= 6) {
        cpf.value = value.replace(/(\d{3})(\d+)/, "$1.$2");
    } else if (value.length <= 9) {
        cpf.value = value.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    } else {
        cpf.value = value.replace(
            /(\d{3})(\d{3})(\d{3})(\d{2})/,
            "$1.$2.$3-$4"
        );
    }
});

cpfSend.addEventListener("submit", async (e) =>{
    e.preventDefault();

    const IDCliente = payload.id
    const info = cpf.value.replace(/\D/g, "");

    const response = await fetch(`${API_URL}/api/clientInfoModify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                IDCliente: IDCliente,
                cpf: info
            })
        });

    const data = await response.json();

    console.log(response.status);
    console.log(data);    
})

function changeUserPage(option){
    if (option.id === 'frontUser'){
        emailSection.classList.add('show')
        cpfSection.classList.add('show')
        addressSection.classList.remove('show')
    }else if (option.id === 'addressUser'){
        emailSection.classList.remove('show')
        cpfSection.classList.remove('show')
        addressSection.classList.add('show')
    }

}

function openList(){
    document.querySelector('.options').classList.toggle('show')
}

states.forEach((state) => {
    state.addEventListener('click', () =>{
        stateButton.value = state.textContent
        document.querySelector('.options').classList.remove('show')
    });
});


deleteButton.addEventListener('click', () =>{
    campus.forEach((campo) =>{
        if (campo.id !== 'deleteButton' && campo.id !== 'saveButton'){
            campo.value = ''
        };
    });
});

formulario.addEventListener('submit', async (e) =>{
    e.preventDefault();
    const state = document.querySelector('#state').value
    const city = document.querySelector('#cidade').value
    const road = document.querySelector('#rua').value
    const reference = document.querySelector('#referencia').value
    const number = document.querySelector('#telefone').value
    const cep = document.querySelector('#ceptext').value
    const IDCliente = payload.id

    let response = null;

    if (state){
        response = await fetch(`${API_URL}/api/clientInfoModify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                IDCliente,
                state,
                city,
                road,
                reference,
                number,
                cep,
            })
        });
    }else{
        const errorMessage = document.querySelector('#error')
        errorMessage.classList.add('show')
        setTimeout(() =>{
            errorMessage.classList.remove('show');
        }, 2000);
    }

    const data = await response.json();

    console.log(response.status);
    console.log(data);
})

async function putInfo(){
    const IDCliente = payload.id

    const response = await fetch(`${API_URL}/api/getClientInfo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                IDCliente
            })
        });

    const data = await response.json();

    username.textContent = payload.name;
    emailText.textContent = payload.email;
    cpf.value = data.cpf;
    stateButton.value = data.estado;
    phone.value = data.telefone;
    cepElement.value = data.cep;
    cidade.value = data.cidade;
    rua.value = data.rua;
    referencia.value = data.referencia;
}

putInfo();