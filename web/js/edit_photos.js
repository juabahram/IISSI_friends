"use strict";

import { picturesAPI_auto } from "/js/api/_pictures.js";
import { messageRenderer } from "/js/renderers/messages.js";
import { sessionManager } from "/js/utils/session.js";

let urlParams = new URLSearchParams(window.location.search);
let pictureId = urlParams.get("pictureId");
let currentPhoto = null;

async function main() {

    if (pictureId !== null) {
        loadCurrentPhoto();
        let registerForm = document.getElementById("form-photo");
        registerForm.onsubmit = handleSubmitPhoto;
    } else {
        let registerForm = document.getElementById("form-photo");
        registerForm.onsubmit = handleSubmitPhoto;
    }
}

async function loadCurrentPhoto() {
    let urlInput = document.getElementById("url-input");
    let titleInput = document.getElementById("title-input");
    let descriptionInput = document.getElementById("description-input");
    try {
        currentPhoto = await picturesAPI_auto.getById(pictureId);
        urlInput.value = currentPhoto.pictureURL;
        titleInput.value = currentPhoto.name;
        descriptionInput.value = currentPhoto.description;
    } catch (err) {
        messageRenderer.showErrorAsAlert("errorsitoo", err);
    }
}

async function handleSubmitPhoto(event) {
    event.preventDefault();

    let form = event.target;
    let formData = new FormData(form);

    if (currentPhoto === null) { // Creating a new photo
        try {
            let todos = await picturesAPI_auto.getAll();
            let cont = 0;

            for(let foto of todos){
                if(foto.userId===sessionManager.getLoggedId()){
                        cont++;
                }
            }
            if(cont===5){
                messageRenderer.showErrorAsAlert("No puedes tener publicadas más de 5 fotos, elimina una para subir una nueva");
            }else{
                formData.append("userId",sessionManager.getLoggedId());
                let resp = picturesAPI_auto.create(formData);
                window.location.href = `/main.html`;
            }

        } catch (err) {
            messageRenderer.showErrorAsAlert("Error subiendo la foto", err);
        }
    } else { // Updating an existing photo
        try {
            formData.append("userId", currentPhoto.userId);
            let resp2 = picturesAPI_auto.update(formData, pictureId);
            window.location.href = `/main.html`;
        } catch (err) {
            messageRenderer.showErrorAsAlert("Error actualizando la foto", err);
        }
    }
}

document.addEventListener("DOMContentLoaded", main);