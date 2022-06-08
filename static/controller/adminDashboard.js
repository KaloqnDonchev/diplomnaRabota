const createUserForm = document.getElementById("reg-form");
createUserForm.addEventListener('submit', registerUser);

async function registerUser(event) {
    event.preventDefault();
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
        document.getElementById('wrong-pass-alert').style.visibility = 'visible';
    } else {
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                username,
                password
            })
        }).then((res) => {
            res.json();
        })
    }
}

function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
};

function permission() {
    const jwtToken = localStorage.getItem('token');
    if(!jwtToken) document.body.innerHTML = 'YOU ARE NOT LOGGED IN';
    if(parseJwt(jwtToken).username !== "admin@admin") document.body.innerHTML = 'YOU DO NOT HAVE ACCESS';
};

const deleteUserForm = document.getElementById("delete-form");
deleteUserForm.addEventListener('submit', deleteUser);

function deleteUser(event) {
    event.preventDefault();
    const email = document.getElementById('email-delete').value;

    fetch('/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email
        })
    }).then((res) => {
        res.json();
    })
}
