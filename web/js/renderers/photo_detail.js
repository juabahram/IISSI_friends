"use strict";
import { photoRenderer } from "/js/renderers/photos.js";
import { messageRenderer } from '/js/renderers/messages.js';
import { picturesAPI_auto } from '/js/api/_pictures.js';

let urlParams = new URLSearchParams(window.location.search);
let pictureId = urlParams.get("pictureId");

async function main() {
    loadPhotoDetails();
    try {
        let deleteBtn = document.getElementById("button-delete");
        deleteBtn.onclick = handleDelete;
        let editBtn = document.getElementById("button-edit");
        editBtn.onclick = handleEdit;
    } catch (error) {
        messageRenderer.showErrorAsAlert("button error");
    }
}

async function loadPhotoDetails() {
    let photoContainer = document.getElementById("photo-details-column");
    try {
        let photo = await picturesAPI_auto.getById(pictureId);
        let photoDetails = photoRenderer.asDetails(photo);
        photoContainer.appendChild(photoDetails);
    } catch (err) {
        messageRenderer.showErrorAsAlert("Error loading photo", err);
    }
}

async function handleDelete(event) {
    let answer = confirm("Do you really want to delete this photo?");
    if (answer) {
        try {
            await picturesAPI_auto.delete(pictureId);
            window.location = "/Main.html";
        } catch (err) {
            messageRenderer.showErrorAsAlert("lmao", err);
        }
    }
}

function handleEdit(event) {
    window.location.href = "addPhotos.html?pictureId=" + pictureId;
}

document.addEventListener("DOMContentLoaded", main);
