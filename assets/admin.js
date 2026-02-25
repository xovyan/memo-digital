import { getFirestore, collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { app } from "./firebase-config.js";

const db = getFirestore(app);
const colRef = collection(db, "pengajuan");

const tableBody = document.getElementById("data-table");

function renderRow(docData, docId){
    const tr = document.createElement("tr");

    // Data kolom
    tr.innerHTML = `
        <td>${docData.jenis_pengajuan}</td>
        <td>${docData.nama_karyawan}</td>
        <td>${docData.departement}</td>
        <td>${docData.nomor_plat}</td>
        <td>${docData.jenis_kendaraan}</td>
        <td>${docData.periode_awal} s/d ${docData.periode_akhir}</td>
        <td>${docData.keterangan}</td>
        <td>${statusPeriode(docData.periode_awal, docData.periode_akhir)}</td>
        <td><textarea data-id="${docId}">${docData.catatan_admin ?? ""}</textarea></td>
        <td>
            <button class="btn btn-hapus" onclick="hapusData('${docId}')">Hapus</button>
            <button class="btn btn-input" onclick="sudahDiInput('${docId}')">Sudah di Input</button>
        </td>
    `;
    tableBody.appendChild(tr);

    // Auto-save catatan
    const ta = tr.querySelector("textarea");
    ta.addEventListener("keyup", () => simpanCatatan(docId, ta.value));
}

function statusPeriode(start, end){
    const today = new Date();
    const awal = new Date(start);
    const akhir = new Date(end);

    if(today >= awal && today <= akhir) return "<span class='status-aktif'>Aktif</span>";
    if(today > akhir) return "<span class='status-selesai'>Selesai</span>";
    return "-";
}

// Tombol Sudah di Input
async function sudahDiInput(id){
    const docRef = doc(db, "pengajuan", id);
    await updateDoc(docRef, { managementStatus: "sudah di input" });
}