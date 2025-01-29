"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";
const photoRenderer = {
    asCard: function (photo) {
        let html =
            `<div class="card text-light" id="photo-card">
        <div class="card-body">
            <h1 class="card-title text-center">${photo.name}</h1>
        </div>
        <a href="photo_detail.html?pictureId=${photo.pictureId}">
            <img class="card-img" src="${photo.pictureURL}">
        </a>
        <div class="card-body">
            <p class="card-text">${photo.description}</p>
        </div>
        </div>`;

        let card = parseHTML(html);
        return card;
    },
    asDetails: function (photo) {
        let html =
            `<div class="photo-details">
        <h1>${photo.name}</h1>
        <a>
            <img src="${photo.pictureURL}" class="img-fluid">
        </a>
        <h2>${photo.description}</h2>
        </div>`;

        let photoDetails = parseHTML(html);
        return photoDetails;
    }
};

export { photoRenderer };