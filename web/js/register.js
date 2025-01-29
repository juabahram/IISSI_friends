"use strict";

import { sessionManager } from "/js/utils/session.js";
import { messageRenderer } from "/js/renderers/messages.js";
import { userValidator } from "/js/validators/users.js";
import { authAPI } from "/js/api/auth.js";
import { provincesAPI_auto } from "/js/api/_provinces.js";
import { municipalitiesAPI_auto } from "/js/api/_municipalities.js";
import { postcodesAPI_auto } from "/js/api/_postcodes.js";

let i = 0;

function main() {
    let registerForm = document.getElementById("register-form");
    registerForm.onsubmit = handleSubmitRegister;

}

function handleSubmitRegister(event,) {
    event.preventDefault();
    let form = event.target;
    let formData = new FormData(form);
    let errors = userValidator.validateRegister(formData);
    if (errors.length > 0) {
        let errorsDiv = document.getElementById("errors");
        errorsDiv.innerHTML = "";
        for (let error of errors) {
            messageRenderer.showErrorAsAlert(error);
        }
    } else {
        sendRegister(formData);
    }
}

async function createOtherTables(formData) {
    try {
        let prov = await provincesAPI_auto.create(formData);
        formData.append("provinceId", i + 1);
        let munic = await municipalitiesAPI_auto.create(formData);
        formData.append("municipalityId", i + 1);
        let post = await postcodesAPI_auto.create(formData);

    } catch (err) {
        messageRenderer.showErrorAsAlert("Error llenando las otras tablas", err);
    }
}

async function sendRegister(formData) {
    await createOtherTables(formData);
    formData.append("provinceId", i + 1);
    formData.append("municipalityId", i + 1);
    formData.append("postcodeId", i + 1);
    try {
        let loginData = await authAPI.register(formData);
        console.log(loginData);
        let sessionToken = loginData.sessionToken;
        let loggedUser = loginData.user;
        sessionManager.login(sessionToken, loggedUser);
        window.location.href = "main.html";
    } catch (err) {
        messageRenderer.showErrorAsAlert("Error registrando un nuevo usuario", err);
    }
}

function getMin() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear() - 18;

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    let today = year + "-" + month + "-" + day;

    return today;
}

document.addEventListener("DOMContentLoaded", main);
document.getElementById('birthdate-input').setAttribute('max', getMin());
