function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}


let newErrorMessage
const regexEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
const first = document.querySelector('.firstname')
first.addEventListener('input', function () {
    if(first.value.length > 2 && first.nextElementSibling.classList.contains('error-message')) {
        first.nextElementSibling.remove()
    }
})
const last = document.querySelector('.lastname')
last.addEventListener('input', function () {
    if(last.value.length > 2 && last.nextElementSibling.classList.contains('error-message')) {
        last.nextElementSibling.remove()
    }
})
const email = document.querySelector('.email')
email.addEventListener('input', function () {
    if(regexEmail.test(email.value) && email.nextElementSibling.classList.contains('error-message')) {
        email.nextElementSibling.remove()
    }
})
const message = document.querySelector('.message')
message.addEventListener('input', function () {
    if(message.value.length > 2 && message.nextElementSibling.classList.contains('error-message')) {
        message.nextElementSibling.remove()
    }
})

const form = document.querySelector('#form')
form.addEventListener('submit', function () {
    event.preventDefault()
    handleSubmit()
})

// FORM SUBMIT
function handleSubmit() {
    checkFormValidation()
}

function checkFormValidation() {
    if(first.value.length < 2) {
        createErrorMessage('Le prénom doit contenir au moins 2 caracteres', first)
    }
    if(last.value.length < 2) {
        createErrorMessage('Le nom de famille doit contenir au moins 2 caracteres', last)
    }

    if( !regexEmail.test(email.value)) {
        createErrorMessage('Lemail doit avoir un format valide', email)
    }

    if(message.value.length < 2) {
        createErrorMessage('Lemessage doit contenir au moins 2 caracteres', message)
    }

    if(first.value.length > 2 && last.value.length > 2 && regexEmail.test(email.value) && message.value.length > 2) {
        console.log('SUBMIT')
    }
}

function createErrorMessage(content, el) {
    newErrorMessage = document.createElement('p')
    newErrorMessage.classList.add("error-message");
    newErrorMessage.innerText = content
    el.after(newErrorMessage)
}