const loginForm =  document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const message = document.getElementById("loginMessage");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click",  () => {
  const type=passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  togglePassword.classList.toggle("fa-eye-slash");
});


loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const username=usernameInput.value.trim();
  const password=  passwordInput.value.trim();

  
  if (!validateEmail(username)) {
    showMessage("Please enter a valid email address.", "red");
    return;
  }
  if (!validatePassword(password)) {
    showMessage("Password must be at least 8 characters and include letters, numbers, and symbols.", "red");
    return;
  }

  try{
    const response = await fetch("/api/login", {
        method: "POST",
      headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username,  password })
    });

    const result =   await response.json();

    if ( result.success) {
       showMessage("Login successful! Redirecting...", "green");
      loginForm.classList.add("success-shake");
           setTimeout(() => {
        window.location.href =  "dashboard.html";
      },  1500);
    }
     else {
      showMessage("Invalid credentials.",  "red");
      loginForm.classList.add("error-shake");
    }
  } catch (err) {
    console.error(err);
 showMessage("An error occurred. Please try again.", "red");
  }
});


function validateEmailSimple(email) {
  
  if (!email.includes("@"))return false;            
    const parts =   email.split("@");
  if (parts.length !== 2) return false;   

  if (parts[0].trim()=== "" || parts[1].trim() === "") return false; 

  if (!parts[1].includes("." )) return false;         
  return true;
}



function validatePasswordSimple(password) {
  if (password.length < 8) return false;

  let hasLetter =false;
  let hasDigit =false;
  let hasSpecial =false;

  const specialChars="@$!%*?&";

  for  (const char of password) {
    if (char.toLowerCase()!==char.toUpperCase()) {  
        hasLetter = true;
    } else if (char >= "0"&&char <= "9") {
    hasDigit = true;
    }else if (specialChars.includes(char)) {
      hasSpecial = true;
    }
  }

  return hasLetter && hasDigit && hasSpecial;
}


function showMessage(text, color) {
  message.textContent = text;
  message.style.color = color;
}


loginForm.addEventListener("animationend", () => {
  loginForm.classList.remove("error-shake", "success-shake");
});
