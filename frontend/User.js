const front = document.querySelector('#frontUser')
const address = document.querySelector('#addressUser')
const dashboard = document.querySelector('#dashboardUser')

const emailSection = document.querySelector('#email')
const addressSection = document.querySelector('#address')
const states = document.querySelectorAll('li')
const stateButton = document.querySelector('#state')

function changeUserPage(option){
    if (option.id === 'frontUser'){
        emailSection.classList.add('show')
        addressSection.classList.remove('show')
    }else if (option.id === 'addressUser'){
        emailSection.classList.remove('show')
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