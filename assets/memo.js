import { db } from "./firebase-config.js";
import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const kirimBtn = document.getElementById("kirimMemo");
const listMemo = document.getElementById("listMemo");

// =======================
// KIRIM MEMO
// =======================
kirimBtn.addEventListener("click", async () => {

    const judul = document.getElementById("judul").value;
    const isi = document.getElementById("isi").value;
    const username = localStorage.getItem("username");

    if (!judul || !isi) {
        alert("Judul dan Isi wajib diisi");
        return;
    }

    await addDoc(collection(db, "memo"), {
        judul: judul,
        isi: isi,
        user: username,
        tanggal: serverTimestamp(),
        status: "belum"
    });

    alert("Memo berhasil dikirim");

    document.getElementById("judul").value = "";
    document.getElementById("isi").value = "";

    loadMemo();
});

// =======================
// LOAD MEMO MILIK SENDIRI
// =======================
async function loadMemo() {

    listMemo.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "memo"));

    querySnapshot.forEach((docSnap) => {

        const data = docSnap.data();

        if (data.user === localStorage.getItem("username")) {

            let statusTampilan = "";

            if (data.status === "belum") {
                statusTampilan = "Belum di Input";
            } else {
                statusTampilan = "Sudah di Input";
            }

            listMemo.innerHTML += `
                <div style="border:1px solid black; padding:10px; margin:10px;">
                    <h4>${data.judul}</h4>
                    <p>${data.isi}</p>
                    <b>Status: ${statusTampilan}</b>
                </div>
            `;
        }
    });
}

loadMemo();
