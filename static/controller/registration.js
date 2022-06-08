const form = document.getElementById("reg-form");
form.addEventListener('submit', registerUser);

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
    window.location.href = "/";
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