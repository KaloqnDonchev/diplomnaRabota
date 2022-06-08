const form = document.getElementById("change-login-form");

form.addEventListener('submit', changePassword)

async function changePassword(event) {
    event.preventDefault();
    const password = document.getElementById('change-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        document.getElementById('wrong-pass-alert').style.visibility = 'visible';
    } else {
        const result = await fetch('/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                newPassword: password,
                token: localStorage.getItem('token')
            })
        }).then((res) => res.json())

        if (result.status === 'ok') {
            alert('Success');
        } else {
            alert(result.error);
        }
    }
}
