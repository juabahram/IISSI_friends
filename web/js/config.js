"use strict";

import { sessionManager } from "/js/utils/session.js";
import { usersAPI_auto } from "/js/api/_users.js";
import { messageRenderer } from "/js/renderers/messages.js";
import { userValidator } from "/js/validators/users.js";
import { provincesAPI_auto } from "/js/api/_provinces.js";
import { municipalitiesAPI_auto } from "/js/api/_municipalities.js";
import { postcodesAPI_auto } from "/js/api/_postcodes.js";
import { authAPI } from "/js/api/auth.js";

function main() {
    let button = document.getElementById("baja");
    button.onclick = handleBaja;
    let registerForm = document.getElementById("register-form");
    registerForm.onsubmit = handleSubmitUpdate;
    loadNewDatos();
}

function handleSubmitUpdate(event,) {
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
        sendUpdate(formData);
    }
}

async function updateOtherTables(formData) {
    try {
        let id = sessionManager.getLoggedId();
        formData.append("provinceId", id);
        let prov = await provincesAPI_auto.update(formData, id);
        formData.append("municipalityId", id);
        let mun = await municipalitiesAPI_auto.update(formData, id);
        formData.append("postcodeId", id);
        let code = await postcodesAPI_auto.update(formData, id);

    } catch (err) {
        messageRenderer.showErrorAsAlert("Error llenando las otras tablas", err);
    }
}

async function sendUpdate(formData) {
    await updateOtherTables(formData);
    let id = sessionManager.getLoggedId();
    formData.append("provinceId", id);
    formData.append("municipalityId", id);
    formData.append("postcodeId", id);
    try {
        await usersAPI_auto.update(formData, id);
        let loginData = await authAPI.login(formData);
        let sessionToken = loginData.sessionToken;
        let loggedUser = loginData.user;
        sessionManager.login(sessionToken, loggedUser);
        window.location.href = "main.html";
    } catch (err) {
        messageRenderer.showErrorAsAlert("Error actualizando datos del usuario", err);
    }
}

async function handleBaja(event) {

    let btn = document.getElementById("baja");
    btn.onclick = async function () {
        let answer = confirm("Estás seguro de querer darte de baja?");
        if (answer) {
            try {
                let id = sessionManager.getLoggedId();
                let formData = await usersAPI_auto.getById(id);
                let today = await getTodaysDate();
                formData.withdrawalDate=today;
                await usersAPI_auto.update(formData, id);
                await sessionManager.logout();
                window.location.href = "/index.html";
            } catch (err) {
                messageRenderer.showErrorAsAlert("error dando la baja del usuario", err);
            }
        }
    }
}

async function loadNewDatos() {
    let id = sessionManager.getLoggedId();
    let username = document.getElementById("username-input");
    let email = document.getElementById("email-input");
    let bio = document.getElementById("biografia");

    try {
        let currentUser = await usersAPI_auto.getById(id);
        username.value = currentUser.username;
        email.value = currentUser.email;
        bio.value = currentUser.bio;
    } catch (err) {
        messageRenderer.showErrorAsAlert("Error al rellenar", err);
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

async function getTodaysDate() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    let today = year + "-" + month + "-" + day;

    return today;
}

document.addEventListener("DOMContentLoaded", main);
document.getElementById('birthdate-input').setAttribute('max', getMin());
