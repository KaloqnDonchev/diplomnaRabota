const form = document.getElementById("login-form");
form.addEventListener('submit', loginUser)

async function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const result = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then((res) => res.json())
    if (result.status === 'ok') {
        localStorage.setItem('token', result.data);
        window.location.href = "/search.html";
    } else {
        alert(result.error);
    }
}
