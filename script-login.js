const API_URL = "https://script.google.com/macros/s/AKfycbwWjf1hvKvZB0CArcuS1vkhHa7ai6_-X0iY66tgx1SexxF_-nExs7dVYn44ySeFwI5CoQ/exec";

// 🔁 Auto-login jika ID ditemukan di perangkat Android
window.onload = function () {
  if (typeof AndroidFunction !== "undefined" && AndroidFunction.getLoginData) {
    const savedId = AndroidFunction.getLoginData("userId");
    if (savedId) {
      window.location.href = `dashboard.html?id=${savedId}`;
    }
  }
};

// 👁 Toggle tampil/samarkan password
function togglePassword() {
  const passwordField = document.getElementById("login-password");
  const eyeIcon = document.getElementById("eyeIcon");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    passwordField.type = "password";
    eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

// ▶️ Submit form login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  login();
});

// 🔐 Fungsi login
function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const btn = document.getElementById("loginBtn");

  if (!email || !password) {
    alert("Email dan password wajib diisi.");
    return;
  }

  btn.classList.add("loading");

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "login",
      email,
      password
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        // ✅ Simpan ID login ke perangkat Android
        if (typeof AndroidFunction !== "undefined" && AndroidFunction.saveLoginData) {
          AndroidFunction.saveLoginData("userId", data.id);
        }

        // 🔁 Arahkan ke dashboard dengan ID
        window.location.href = `dashboard.html?id=${data.id}`;
      } else {
        alert("Email atau password salah, atau akun belum terdaftar.");
        btn.classList.remove("loading");
      }
    })
    .catch(err => {
      btn.classList.remove("loading");
    });
}