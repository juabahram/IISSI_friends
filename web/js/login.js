"use strict";

import { sessionManager } from "/js/utils/session.js";
import { messageRenderer } from "/js/renderers/messages.js";
import { authAPI } from "/js/api/auth.js";


function main() {
    let LoginForm = document.getElementById("Login-form");
    LoginForm.onsubmit = handleSubmitLogin;

}

function handleSubmitLogin(event) {
    event.preventDefault();
    let form = event.target;
    let formData = new FormData(form);
    sendLogin(formData);

}
async function sendLogin(formData) {  
    try {
        let loginData = await authAPI.login(formData);
        let sessionToken = loginData.sessionToken;
        let loggedUser = loginData.user;
        sessionManager.login(sessionToken, loggedUser);
        window.location.href = "Main.html";
    } catch (err) {
        messageRenderer.showErrorAsAlert("Error Logining a new user", err);
    }
}

document.addEventListener("DOMContentLoaded", main);

