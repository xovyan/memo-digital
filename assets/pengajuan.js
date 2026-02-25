import { db } from "./firebase-config.js";
import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.getElementById("formPengajuan");
const list = document.getElementById("listPengajuan");
const platContainer = document.getElementById("platContainer");

// ======================
// TAMBAH INPUT PLAT
// ======================
function resetPlat() {
    platContainer.innerHTML = `
        <input type="text" class="plat" placeholder="Nomor Plat" required>
    `;
}

// ======================
// SIMPAN PENGAJUAN
// ======================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const platInputs = document.querySelectorAll(".plat");
    const nomorPlatArray = [];

    platInputs.forEach(input => {
        if (input.value.trim() !== "") {
            nomorPlatArray.push(input.value.trim());
        }
    });

    if (nomorPlatArray.length === 0) {
        alert("Minimal 1 nomor plat harus diisi");
        return;
    }

    try {

        await addDoc(collection(db, "pengajuan"), {
            jenis_pengajuan: document.getElementById("jenis_pengajuan").value || "",
            nama: document.getElementById("nama").value || "",
            departement: document.getElementById("departement").value || "",
            nomor_plat: nomorPlatArray,
            jenis_kendaraan: document.getElementById("jenis_kendaraan").value || "",
            periode_awal: document.getElementById("periode_awal").value || "",
            periode_akhir: document.getElementById("periode_akhir").value || "",
            keterangan: document.getElementById("keterangan").value || "",
            status_admin: "belum",
            dibuat_oleh: localStorage.getItem("username") || "unknown",
            dibuat_pada: serverTimestamp()
        });

        alert("Pengajuan berhasil dikirim ✅");

        // RESET TOTAL
        form.reset();
        resetPlat();

        loadData();

    } catch (error) {
        alert("Terjadi kesalahan: " + error.message);
    }

});

// ======================
// LOAD DATA SENDIRI
// ======================
async function loadData(){

    list.innerHTML = "";

    const snapshot = await getDocs(collection(db,"pengajuan"));

    snapshot.forEach(docSnap => {

        const data = docSnap.data();

        if(data.dibuat_oleh === localStorage.getItem("username")){

            let statusText = data.status_admin === "belum"
                ? "Belum di Input Admin"
                : "Sudah di Input Admin";

            list.innerHTML += `
                <div style="border:1px solid #ddd;padding:12px;margin:10px 0;border-radius:8px;">
                    <b>${data.jenis_pengajuan}</b><br>
                    Nama: ${data.nama}<br>
                    Dept: ${data.departement}<br>
                    Plat: ${Array.isArray(data.nomor_plat) ? data.nomor_plat.join(", ") : ""}<br>
                    Periode: ${data.periode_awal} s/d ${data.periode_akhir}<br>
                    Status: <b>${statusText}</b>
                </div>
            `;
        }

    });

}

loadData();