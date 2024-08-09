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
                    'X-CSRF-Token': getcookie("_csrf")
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
                    'X-CSRF-Token': getcookie("_csrf")
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

const converter = {
    read: function (value) {
      if (value[0] === '"') {
        value = value.slice(1, -1)
      }
      return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
    },
    write: function (value) {
      return encodeURIComponent(value).replace(
        /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
        decodeURIComponent
      )
    }
  }

function getcookie(name) {
    if (typeof document === 'undefined' || (arguments.length && !name)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : []
    var jar = {}
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=')
      var value = parts.slice(1).join('=')

      try {
        var found = decodeURIComponent(parts[0])
        if (!(found in jar)) jar[found] = converter.read(value, found)
        if (name === found) {
          break
        }
      } catch {
        // Do nothing...
      }
    }
    console.log(jar)
    return name ? jar[name] : jar
  }

  