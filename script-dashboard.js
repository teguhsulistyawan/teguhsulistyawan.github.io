const API_URL = 'https://script.google.com/macros/s/AKfycbwWjf1hvKvZB0CArcuS1vkhHa7ai6_-X0iY66tgx1SexxF_-nExs7dVYn44ySeFwI5CoQ/exec';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTbmok0i6AtgLr4ebPcm2Gujl7n75yXH2IpM3B-D2tzhZeGLHfcyCyydHD7m9QsZFH/exec';

const params = new URLSearchParams(window.location.search);
const userId = params.get("id")?.toUpperCase();

const menuGrid = document.getElementById("menuGrid");
const spinner = document.getElementById("spinner");
const formPopup = document.getElementById("formPopup");
const editIdMenu = document.getElementById("editIdMenu");
const formTitle = document.getElementById("formTitle");

// === LOGIN & LOAD MENU ===
window.onload = () => {
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    window.location.href = "log.html";
    return;
  }

  // cek user
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

        if (data.fileId) {
          const imageUrl = `https://drive.google.com/thumbnail?id=${data.fileId}`;
          document.getElementById("avatar").innerHTML =
            `<img src="${imageUrl}" alt="Avatar" style="width:60px;height:60px;border-radius:50%;">`;
        } else {
          document.getElementById("avatar").innerText = data.nama.charAt(0).toUpperCase();
        }

        // load menu setelah user valid
        loadMenu();
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

function openForm(editData = null) {
  formPopup.style.display = "flex";
  if (editData) {
    formTitle.innerText = "Edit Menu";
    editIdMenu.value = editData.idMenu;
    document.getElementById("judulInput").value = editData.judul;
    document.getElementById("ikonInput").value = editData.ikon;
    document.getElementById("linkInput").value = editData.link;
  } else {
    formTitle.innerText = "Tambah Menu";
    editIdMenu.value = "";
    document.getElementById("judulInput").value = "";
    document.getElementById("ikonInput").value = "";
    document.getElementById("linkInput").value = "";
  }
}

function closeForm() {
  formPopup.style.display = "none";
}

function loadMenu() {
  if (!userId) {
    menuGrid.innerHTML = '<p style="color:red;">ID User tidak ditemukan di URL</p>';
    return;
  }
  spinner.style.display = 'block';
  fetch(`${SCRIPT_URL}?idUser=${userId}&ts=${Date.now()}`)
    .then(res => res.json())
    .then(data => {
      spinner.style.display = 'none';
      tampilkanMenu(data.reverse());
    })
    .catch(() => {
      spinner.style.display = 'none';
      menuGrid.innerHTML = '<p style="color:red;">Gagal mengambil data</p>';
    });
}

function tampilkanMenu(data) {
  menuGrid.innerHTML = '';
  if (data.length === 0) {
    menuGrid.innerHTML = '<p>Belum ada menu</p>';
    return;
  }
  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-card";

    const img = document.createElement("img");
    img.src = `https://drive.google.com/thumbnail?id=${item.ikon}`;
    card.appendChild(img);

    const h4 = document.createElement("h4");
    h4.innerText = item.judul;
    card.appendChild(h4);

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.onclick = (e) => {
      e.stopPropagation(); // hentikan bubbling
      openForm(item);
    };
    actions.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.onclick = (e) => {
      e.stopPropagation(); // hentikan bubbling
      hapusMenu(item.idMenu);
    };
    actions.appendChild(deleteBtn);


    card.appendChild(actions);
    card.onclick = () => {
      if (item.link) window.open(item.link, "_blank");
    };

    menuGrid.appendChild(card);
  });
}

function submitMenu() {
  const idMenu = editIdMenu.value;
  const judul = document.getElementById("judulInput").value.trim();
  const ikon = document.getElementById("ikonInput").value.trim();
  const link = document.getElementById("linkInput").value.trim();

  if (!judul || !ikon || !link) {
    alert("Lengkapi semua isian!");
    return;
  }

  const formData = new URLSearchParams();
  formData.append("idUser", userId);
  formData.append("judul", judul);
  formData.append("ikon", ikon);
  formData.append("link", link);

  if (idMenu) {
    formData.append("aksi", "edit");
    formData.append("idMenu", idMenu);
  } else {
    formData.append("aksi", "tambah");
  }

  spinner.style.display = 'block';
  fetch(SCRIPT_URL, { method: 'POST', body: formData })
    .then(res => res.json())
    .then(res => {
      spinner.style.display = 'none';
      if (res.success) {
        closeForm();
        loadMenu();
      } else {
        alert("Gagal menyimpan: " + res.error);
      }
    })
    .catch(err => {
      spinner.style.display = 'none';
      alert("Error: " + err);
    });
}

function hapusMenu(idMenu) {
  if (!confirm("Yakin ingin menghapus menu ini?")) return;
  const formData = new URLSearchParams();
  formData.append("aksi", "hapus");
  formData.append("idMenu", idMenu);

  spinner.style.display = 'block';
  fetch(SCRIPT_URL, { method: 'POST', body: formData })
    .then(res => res.json())
    .then(res => {
      spinner.style.display = 'none';
      if (res.success) loadMenu();
      else alert("Gagal hapus: " + res.error);
    })
    .catch(err => {
      spinner.style.display = 'none';
      alert("Error: " + err);
    });
}
