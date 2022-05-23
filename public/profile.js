function populateUser(user){
    $('.firstname').html(user.firstname)
    $('#username').html(user.username)
    $('#lastname').html(user.lastname)
    $('#email').html(user.email)
}

async function getUserId() {
    await $.ajax({
        url: 'http://localhost:5002/userObj',
        type: 'GET',
        success: populateUser
    })

}

function setup() {
    getUserId()
}

$(document).ready(setup)