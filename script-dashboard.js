const API_URL = 'https://script.google.com/macros/s/AKfycbwWjf1hvKvZB0CArcuS1vkhHa7ai6_-X0iY66tgx1SexxF_-nExs7dVYn44ySeFwI5CoQ/exec';

window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    window.location.href = "log.html";
    return;
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "getUser",
      id: id
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "found") {
        document.getElementById("nama-user").innerText = data.nama;
        document.getElementById("pondok-user").innerText = data.pondok;

        // ✅ Avatar pakai foto jika ada fileId
        if (data.fileId) {
          const imageUrl = `https://drive.google.com/thumbnail?id=${data.fileId}`;
          document.getElementById("avatar").innerHTML = `<img src="${imageUrl}" alt="Avatar" style="width:60px;height:60px;border-radius:50%;">`;
        } else {
          // fallback: huruf awal nama
          document.getElementById("avatar").innerText = data.nama.charAt(0).toUpperCase();
        }

      } else {
        alert("ID tidak ditemukan. Silakan login ulang.");
        window.location.href = "log.html";
      }
    })
    .catch(err => {
      console.error("Gagal ambil data:", err);
      window.location.href = "log.html";
    });
};

// Navigasi ke halaman lain dengan tetap membawa id
function goTo(page) {
  const userId = new URLSearchParams(window.location.search).get("id");
  if (!userId) {
    alert("ID user tidak ditemukan!");
    window.location.href = "log.html";
    return;
  }

  window.location.href = `${page}.html?id=${userId}`;
}

// Logout
function logout() {
  if (typeof AndroidFunction !== "undefined") {
    AndroidFunction.logout();
  }
  window.location.href = "log.html";
}

  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id");