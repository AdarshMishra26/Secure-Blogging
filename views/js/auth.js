document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const otpSection = document.getElementById('otp-section');
    const messageElement = document.getElementById('message');

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(registerForm);

            fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': getCsrfToken()
                },
                body: JSON.stringify({
                    username: formData.get('username'),
                    email: formData.get('email'),
                    password: formData.get('password')
                })
            })
            .then(response => response.json())
            .then(data => {
                messageElement.textContent = data.message;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(loginForm);

            fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': getCsrfToken()
                },
                body: JSON.stringify({
                    username: formData.get('username'),
                    password: formData.get('password')
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.otpSent) {
                    otpSection.style.display = 'block';
                    messageElement.textContent = 'OTP sent to your email. Please enter it below.';
                } else {
                    messageElement.textContent = data.message;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });

        document.getElementById('verify-otp-btn').addEventListener('click', function() {
            const otp = document.getElementById('otp').value;

            fetch('/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': getCsrfToken()
                },
                body: JSON.stringify({
                    otp: otp
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'dashboard.html';
                } else {
                    messageElement.textContent = data.message;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
});

function getCsrfToken() {
    const csrfToken = document.querySelector('input[name="_csrf"]').value;
    if (csrfToken) {
        return csrfToken;
    } else {
        console.error('CSRF token not found in the form');
        return '';
    }
}
