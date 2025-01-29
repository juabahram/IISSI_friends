"use strict";

import { galleryRenderer } from '/js/renderers/gallery.js';
import { messageRenderer } from '/js/renderers/messages.js';
import { picturesAPI_auto } from '/js/api/_pictures.js';

async function main() {
     loadAllPhotos();
     let btn= document.getElementById("configur");
     btn.onclick= function(event){
        window.location.href = `/config.html`
     };
}

async function loadAllPhotos() {
    let galleryContainer = document.getElementById("carta");
    try {
        let photos = await picturesAPI_auto.getAll();
        let cardGallery = galleryRenderer.asCardGallery(photos);
        galleryContainer.appendChild(cardGallery);
    } catch (err) {
        messageRenderer.showErrorAsAlert("Error while loading photos", err);
    }
}



document.addEventListener("DOMContentLoaded", main);