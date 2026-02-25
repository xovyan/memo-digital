import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const loginBtn = document.getElementById("loginAdmin");

loginBtn.addEventListener("click", async () => {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const querySnapshot = await getDocs(collection(db, "users"));

    let loginBerhasil = false;

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (
            data.username === username &&
            data.password === password &&
            data.role === "admin"
        ) {
            loginBerhasil = true;
        }
    });

    if (loginBerhasil) {
        alert("Login Admin Berhasil");
        localStorage.setItem("isAdmin", "true");
        window.location.href = "dashboard_admin.html";
    } else {
        alert("Username / Password salah atau bukan admin");
    }

});
