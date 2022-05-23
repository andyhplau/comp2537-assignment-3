async function authenticateUser() {
    username = $('#username').val()
    password = $('#password').val()
    console.log(username, password)
    await $.ajax({
        url: 'http://localhost:5002/login/authentication',
        // url: 'https://fast-reef-36186.herokuapp.com/login/authentication',
        type: 'POST',
        data: {
            username: username,
            password: password
        },
        success: (result) => {
            console.log(result)
            if (result == 'success') {
                $('#result').html('Successful login!')
                setTimeout(window.location.href = './profile.html', 1500)
            } else {
                $('#result').html('Login failed! Please try again')
                $('input:text').val('')
                $('input:password').val('')
            }
        }
    })
}

function setup() {
    $('body').on('click', '#login', authenticateUser)
}

$(document).ready(setup)