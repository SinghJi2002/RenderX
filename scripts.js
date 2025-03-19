document.addEventListener("DOMContentLoaded", function () {

    // 🔹 Registration Form Handling
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const name = document.getElementById("regName").value;
            const email = document.getElementById("regEmail").value;
            const password = document.getElementById("regPassword").value;
            const confirmPassword = document.getElementById("regConPassword").value;
            const messageElement = document.getElementById("regMessage");

            // ✅ Validate Confirm Password
            if (password !== confirmPassword) {
                messageElement.innerText = "Passwords do not match!";
                messageElement.style.color = "red";
                return;
            }

            // ✅ Send Data to Backend
            const response = await fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            messageElement.innerText = data.message;
            messageElement.style.color = response.status === 201 ? "green" : "red";
        });
    }

    // 🔹 Login Form Handling
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const messageElement = document.getElementById("message");

            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            messageElement.innerText = data.message;
            messageElement.style.color = response.status === 200 ? "green" : "red";

            if (response.status === 200) {
                // ✅ Redirect to mainframe/index.html after successful login
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000);
            }
            
        });
    }
});
