import { db } from "./firebase-config.js";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const tableBody = document.getElementById("data-table");


// =============================
// REALTIME LOAD DATA
// =============================
onSnapshot(collection(db, "pengajuan"), (snapshot) => {

  loadData(snapshot);

});


function loadData(snapshot){

  let cari = document.querySelector('input[name="cari"]')?.value.toLowerCase() || "";
  let bulan = document.querySelector('input[name="bulan"]')?.value || "";

  tableBody.innerHTML = "";

  snapshot.forEach((docSnap) => {

    const data = docSnap.data();
    const id = docSnap.id;

    // =========================
    // FILTER CARI
    // =========================
    if(cari){
      let gabung = (
        (data.nama_karyawan || "") +
        (data.nomor_plat || "") +
        (data.departement || "") +
        (data.jenis_pengajuan || "") +
        (data.jenis_kendaraan || "") +
        (data.keterangan || "") +
        (data.catatan_admin || "")
      ).toLowerCase();

      if(!gabung.includes(cari)) return;
    }

    // =========================
    // FILTER BULAN
    // =========================
    if(bulan){
      if(!data.periode_awal.startsWith(bulan)) return;
    }

    // =========================
    // STATUS PERIODE (SAMA LOGIKA PHP)
    // =========================
    let today = new Date();
    let awal = new Date(data.periode_awal);
    let akhir = new Date(data.periode_akhir);

    let statusPeriode = "-";

    if(today >= awal && today <= akhir){
      statusPeriode = "<span class='status-aktif'>Aktif</span>";
    }
    else if(today > akhir){
      statusPeriode = "<span class='status-selesai'>Selesai</span>";
    }

    // =========================
    // STATUS ADMIN
    // =========================
    let tombolAdmin = "";

    if(data.status_admin === "sudah"){
      tombolAdmin = "<span style='color:green;font-weight:bold;'>✔ Sudah Di Input</span>";
    } else {
      tombolAdmin = `
        <button class="btn" style="background:green"
        onclick="tandaiSelesai('${id}')">
        Sudah Di Input
        </button>
      `;
    }

    // =========================
    // FORMAT TANGGAL
    // =========================
    let formatAwal = formatTanggal(data.periode_awal);
    let formatAkhir = formatTanggal(data.periode_akhir);

    // =========================
    // RENDER TABLE
    // =========================
    tableBody.innerHTML += `
      <tr>
        <td>${data.jenis_pengajuan || "-"}</td>
        <td>${data.nama_karyawan || "-"}</td>
        <td>${data.departement || "-"}</td>
        <td>${data.nomor_plat || "-"}</td>
        <td>${data.jenis_kendaraan || "-"}</td>
        <td>${formatAwal} s/d ${formatAkhir}</td>
        <td>${data.keterangan || "-"}</td>
        <td>${statusPeriode}</td>
        <td>
          <textarea class="catatan-admin"
          onkeyup="autoSave('${id}', this.value)">
          ${data.catatan_admin || ""}
          </textarea>
        </td>
        <td>
          ${tombolAdmin}
          <br><br>
          <button class="btn btn-hapus"
          onclick="hapusData('${id}')">
          Hapus
          </button>
        </td>
      </tr>
    `;
  });
}


// =============================
// FORMAT TANGGAL DD-MM-YYYY
// =============================
function formatTanggal(tanggal){

  let d = new Date(tanggal);
  let day = String(d.getDate()).padStart(2,'0');
  let month = String(d.getMonth()+1).padStart(2,'0');
  let year = d.getFullYear();

  return day + "-" + month + "-" + year;
}


// =============================
// UPDATE STATUS ADMIN
// =============================
window.tandaiSelesai = async function(id){

  await updateDoc(doc(db,"pengajuan",id),{
    status_admin:"sudah"
  });

};


// =============================
// HAPUS DATA
// =============================
window.hapusData = async function(id){

  if(confirm("Yakin ingin menghapus data ini?")){
    await deleteDoc(doc(db,"pengajuan",id));
  }

};


// =============================
// AUTO SAVE CATATAN
// =============================
let timeoutSave = null;

window.autoSave = function(id,value){

  clearTimeout(timeoutSave);

  timeoutSave = setTimeout(async function(){

    await updateDoc(doc(db,"pengajuan",id),{
      catatan_admin:value
    });

  },800);

};