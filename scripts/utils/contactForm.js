const regexEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
const modal = document.getElementById("contact_modal");
const closeIcon = document.querySelector('.close-icon')
const first = document.querySelector('.firstname')
const last = document.querySelector('.lastname')
const email = document.querySelector('.email')
const message = document.querySelector('.message')
const form = document.querySelector('#form')
let activeEl


function displayModal() {
    activeEl = document.activeElement
	modal.style.display = "block";
    const firstnameInput = modal.querySelector('.firstname')
    firstnameInput.focus()
}

closeIcon.addEventListener('keypress', function (event){
    modal.style.display = "none";
    activeEl.focus()
})

closeIcon.addEventListener('click', function (event){
    modal.style.display = "none";
})

first.addEventListener('input', function () {
    if(first.value.length > 2) {
        first.style.border = ""
    }
})

last.addEventListener('input', function () {
    if(last.value.length > 2) {
        last.style.border = ""
    }
})
email.addEventListener('input', function () {
    if(regexEmail.test(email.value)) {
        email.style.border = ""
    }
})
message.addEventListener('input', function () {
    if (message.value.length > 2) {
        message.style.border = ""
    }
})

form.addEventListener('submit', function (event) {
    event.preventDefault()
    handleSubmit()
})


function handleSubmit() {
    checkFormValidation()
}

function checkFormValidation() {
    if(first.value.length < 2) {
        first.style.border = "2px solid red"
        first.placeholder = 'Le prénom doit contenir au moins 2 caracteres'
    }

    if(last.value.length < 2) {
        last.style.border = "2px solid red"
        last.placeholder = 'Le nom de famille doit contenir au moins 2 caracteres'
    }

    if( !regexEmail.test(email.value)) {
        email.style.border = "2px solid red"
        email.placeholder = 'L\'email doit avoir un format valide, email'
    }

    if(message.value.length < 2) {
        message.style.border = "2px solid red"
        message.placeholder = 'Le message doit contenir au moins 2 caracteres'
    }

    if(first.value.length > 2 && last.value.length > 2 && regexEmail.test(email.value) && message.value.length > 2) {
        console.log('SUBMIT')
        modal.style.display = "none";
        resetForm()
        activeEl.focus()
    }
}

function resetForm() {
    first.value = ''
    first.placeholder = ''
    last.value = ''
    last.placeholder = ''
    email.value = ''
    email.placeholder = ''
    message.value = ''
    message.placeholder = ''
}