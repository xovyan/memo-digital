// admin.js
import { getFirestore, collection, onSnapshot, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { app } from "./firebase-config.js";

const db = getFirestore(app);
const colRef = collection(db, "pengajuan");
const tableBody = document.getElementById("data-table");

// Render satu row ke tabel
function renderRow(docData, docId) {
    const tr = document.createElement("tr");

    const today = new Date();
    const awal = new Date(docData.periode_awal);
    const akhir = new Date(docData.periode_akhir);
    let statusText = "-";
    let statusClass = "";
    if(today >= awal && today <= akhir) {
        statusText = "Aktif";
        statusClass = "status-aktif";
    } else if(today > akhir) {
        statusText = "Selesai";
        statusClass = "status-selesai";
    }

    tr.innerHTML = `
        <td>${docData.jenis_pengajuan}</td>
        <td>${docData.nama_karyawan}</td>
        <td>${docData.departement}</td>
        <td>${docData.nomor_plat}</td>
        <td>${docData.jenis_kendaraan}</td>
        <td>${docData.periode_awal} s/d ${docData.periode_akhir}</td>
        <td>${docData.keterangan}</td>
        <td class="${statusClass}">${statusText}</td>
        <td><textarea class="catatan-admin" data-id="${docId}">${docData.catatan_admin || ""}</textarea></td>
        <td>
            <button class="btn btn-input" onclick="markDone('${docId}')">Sudah di Input</button>
        </td>
    `;
    tableBody.appendChild(tr);
}

// Auto-save catatan admin
function autoSave() {
    document.querySelectorAll('.catatan-admin').forEach(textarea => {
        let timeout = null;
        textarea.addEventListener('keyup', () => {
            clearTimeout(timeout);
            timeout = setTimeout(async () => {
                const id = textarea.getAttribute('data-id');
                const catatan = textarea.value;
                const docRef = doc(db, "pengajuan", id);
                await updateDoc(docRef, { catatan_admin: catatan });
            }, 800);
        });
    });
}

// Tombol "Sudah di Input"
window.markDone = async function(id){
    const docRef = doc(db, "pengajuan", id);
    await updateDoc(docRef, { status_admin: "sudah di input" });
    alert("Status sudah di input admin");
}

// Filter data
function filterData(allDocs) {
    const cari = document.getElementById('cari')?.value.toLowerCase() || "";
    const bulan = document.getElementById('bulan')?.value || "";

    return allDocs.filter(docData => {
        let matchCari = true;
        let matchBulan = true;

        if(cari){
            matchCari = Object.values(docData).some(val =>
                String(val).toLowerCase().includes(cari)
            );
        }

        if(bulan){
            const docMonth = docData.periode_awal.split('-').slice(0,2).join('-'); // YYYY-MM
            matchBulan = docMonth === bulan;
        }

        return matchCari && matchBulan;
    });
}

// Load data realtime dari Firebase
function loadData() {
    onSnapshot(query(colRef, orderBy("periode_awal", "desc")), snapshot => {
        tableBody.innerHTML = "";
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const filtered = filterData(docs);
        filtered.forEach(d => renderRow(d, d.id));
        autoSave();
    });
}

// Event filter
document.getElementById("cari")?.addEventListener('input', loadData);
document.getElementById("bulan")?.addEventListener('input', loadData);

// Inisialisasi load data
loadData();