// admin.js
import { getFirestore, collection, onSnapshot, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { app } from "./firebase-config.js";

const db = getFirestore(app);
const colRef = collection(db, "pengajuan");
const tableBody = document.getElementById("data-table");

// Render data ke tabel
function renderRow(docData, docId) {
    const tr = document.createElement("tr");

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
    let timeout = null;
    ta.addEventListener("keyup", () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => simpanCatatan(docId, ta.value), 800);
    });
}

// Status per periode
function statusPeriode(start, end) {
    const today = new Date();
    const awal = new Date(start);
    const akhir = new Date(end);

    if(today >= awal && today <= akhir) return "<span class='status-aktif'>Aktif</span>";
    if(today > akhir) return "<span class='status-selesai'>Selesai</span>";
    return "-";
}

// Auto-save catatan admin
async function simpanCatatan(id, value) {
    const docRef = doc(db, "pengajuan", id);
    await updateDoc(docRef, { catatan_admin: value });
}

// Tombol Sudah di Input
async function sudahDiInput(id){
    const docRef = doc(db, "pengajuan", id);
    await updateDoc(docRef, { managementStatus: "sudah di input" });
}

// Hapus data
window.hapusData = async function(id){
    if(confirm("Yakin ingin menghapus data ini?")){
        const docRef = doc(db, "pengajuan", id);
        await updateDoc(docRef, { deleted: true }); // bisa pakai flag deleted
    }
}

// Filter data
function loadData() {
    const cari = document.getElementById("cari").value.toLowerCase();
    const bulan = document.getElementById("bulan").value;

    // Realtime listener
    const q = query(colRef, orderBy("periode_awal", "desc"));
    onSnapshot(q, snapshot => {
        tableBody.innerHTML = "";
        snapshot.forEach(docSnap => {
            const data = docSnap.data();

            // Skip yang dihapus jika pakai deleted flag
            if(data.deleted) return;

            // Filter cari nama / plat
            if(cari && !(
                (data.nama_karyawan ?? "").toLowerCase().includes(cari) ||
                (data.nomor_plat ?? "").toLowerCase().includes(cari)
            )) return;

            // Filter bulan
            if(bulan){
                const tgl = new Date(data.periode_awal);
                const tglBulan = `${tgl.getFullYear()}-${("0"+(tgl.getMonth()+1)).slice(-2)}`;
                if(tglBulan !== bulan) return;
            }

            renderRow(data, docSnap.id);
        });
    });
}

window.loadData = loadData;
loadData();