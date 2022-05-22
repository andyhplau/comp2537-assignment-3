async function storeNewUser() {
    firstname = $('#firstname').val()
    lastname = $('#lastname').val()
    username = $('#username').val()
    email = $('#email').val()
    password = $('#password').val()
    console.log(firstname, lastname, username, email, password)
    await $.ajax({
        url: 'http://localhost:5000/signup/create',
        // url: 'https://warm-lowlands-28229.herokuapp.com/signup/create',
        type: 'PUT',
        data: {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: password
        },
        success: (x) => {
            console.log(x)
        }
    })
}

function setup() {
    $('body').on('click', '#signup', storeNewUser)
}

$(document).ready(setup)