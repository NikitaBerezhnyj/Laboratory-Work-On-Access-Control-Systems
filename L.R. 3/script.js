const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

const SECRET_KEY = "SecretKeyForWork";

function encrypt(text, key) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    let charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result);
}

function decrypt(encodedText, key) {
  let text = atob(encodedText);
  let result = "";
  for (let i = 0; i < text.length; i++) {
    let charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return result;
}

document
  .getElementById("register-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;

    const userData = {
      username: encrypt(username, SECRET_KEY),
      password: encrypt(password, SECRET_KEY),
      name: encrypt(name, SECRET_KEY),
      email: encrypt(email, SECRET_KEY),
    };

    localStorage.setItem("user_" + username, JSON.stringify(userData));
    alert("Реєстрація успішна!");
    showPage("login-page");
  });

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    showAdminPanel();
    return;
  }

  const storedUser = localStorage.getItem("user_" + username);
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    const decryptedPassword = decrypt(userData.password, SECRET_KEY);

    if (decryptedPassword === password) {
      showUserPanel(userData);
    } else {
      alert("Невірний пароль");
    }
  } else {
    alert("Користувача не знайдено");
  }
});

function showAdminPanel() {
  showPage("admin-page");
  const usersList = document.getElementById("users-list");
  usersList.innerHTML = "";

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("user_")) {
      const userData = JSON.parse(localStorage.getItem(key));
      const row = usersList.insertRow();

      row.insertCell(0).textContent = decrypt(userData.username, SECRET_KEY);
      row.insertCell(1).textContent = decrypt(userData.password, SECRET_KEY);
      row.insertCell(2).textContent = decrypt(userData.name, SECRET_KEY);
      row.insertCell(3).textContent = decrypt(userData.email, SECRET_KEY);
    }
  }
}

function showUserPanel(userData) {
  showPage("user-page");
  const userInfo = document.getElementById("user-info");
  userInfo.innerHTML = `
        <p>Логін: ${decrypt(userData.username, SECRET_KEY)}</p>
        <p>Ім'я: ${decrypt(userData.name, SECRET_KEY)}</p>
        <p>Email: ${decrypt(userData.email, SECRET_KEY)}</p>
    `;
}

function showPage(pageId) {
  const pages = document.getElementsByClassName("page");
  for (let page of pages) {
    page.style.display = "none";
  }
  document.getElementById(pageId).style.display = "block";
}

document
  .getElementById("register-link")
  .addEventListener("click", function (e) {
    e.preventDefault();
    showPage("register-page");
  });

document.getElementById("login-link").addEventListener("click", function (e) {
  e.preventDefault();
  showPage("login-page");
});

document
  .getElementById("logout-btn")
  .addEventListener("click", () => showPage("login-page"));
document
  .getElementById("admin-logout-btn")
  .addEventListener("click", () => showPage("login-page"));
