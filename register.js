document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");

    const confirmInput = document.createElement("input");
    confirmInput.type = "password";
    confirmInput.id = "confirmPassword";
    confirmInput.placeholder = "Confirm Password";
    confirmInput.required = true;
    registerForm.insertBefore(confirmInput, registerForm.querySelector("button"));

    const passwordField = document.getElementById("password");
    const passWrapper = document.createElement("div");
    const confirmWrapper = document.createElement("div");
    passWrapper.style.position = confirmWrapper.style.position = "relative";
    passwordField.parentNode.insertBefore(passWrapper, passwordField);
    passWrapper.appendChild(passwordField);
    confirmInput.parentNode.insertBefore(confirmWrapper, confirmInput);
    confirmWrapper.appendChild(confirmInput);

    function createToggle(targetInput) {
      const toggleBtn = document.createElement("span");
      toggleBtn.textContent = "Show";
      toggleBtn.style.cursor = "pointer";
      toggleBtn.style.position = "absolute";
      toggleBtn.style.right = "10px";
      toggleBtn.style.top = "50%";
      toggleBtn.style.transform = "translateY(-50%)";
      toggleBtn.style.color = "#007bff";
      toggleBtn.style.userSelect = "none";
      toggleBtn.style.fontWeight = "600";
      toggleBtn.style.fontSize = "0.9rem";

      toggleBtn.addEventListener("click", () => {
        const isHidden = targetInput.type === "password";
        targetInput.type = isHidden ? "text" : "password";
        toggleBtn.textContent = isHidden ? "Hide" : "Show";
      });

      return toggleBtn;
    }

    passWrapper.appendChild(createToggle(passwordField));
    confirmWrapper.appendChild(createToggle(confirmInput));

    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const fullName = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (fullName.length < 3) {
        alert("Full name must be at least 3 characters.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }
      if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("Registration successful! Redirecting to login...");
          window.location.href = "login.html";
        } else {
          alert(data.message);
        }
      })
      .catch(error => console.error('Error:', error));
    });
  });