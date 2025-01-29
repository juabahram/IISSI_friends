"use strict";
import { photoRenderer } from "/js/renderers/photos.js";
import { parseHTML } from "/js/utils/parseHTML.js";
import { sessionManager } from "/js/utils/session.js";

const galleryRenderer = {
    asCardGallery: function (photos) {
        let galleryContainer = parseHTML('<div class="photo-gallery"></div>');
        let i= 0;
        for (let photo of photos) {
            if(photo.userId===sessionManager.getLoggedId()){
                let card = photoRenderer.asCard(photo);
                galleryContainer.appendChild(card);
            }
        }
        return galleryContainer;
    }
};
export { galleryRenderer };