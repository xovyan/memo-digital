import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const querySnapshot = await getDocs(collection(db, "users"));

    let found = false;

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.username === username && data.password === password) {
            found = true;
        }
    });

    if (found) {
alert("Login berhasil");
localStorage.setItem("isLoggedIn", "true");
localStorage.setItem("username", username);
window.location.href = "/management/dashboard_management.html";
    } else {
        alert("Username atau Password salah");
    }

});
