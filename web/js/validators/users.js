"use strict";

import { messageRenderer } from "/js/renderers/messages.js";

const userValidator = {
    validateRegister: function (formData) {
        let errors = [];
        let Name = formData.get("username");
        let password = formData.get("password");
        let password2 = formData.get("password2");
        let fecha = formData.get("dateOfBirth");
        if (Name.length < 3) {
            errors.push("tu nombre debe tener más de 3 letras!");
        }
        if (password !== password2) {
            errors.push("las contraseñas deben coincidir");
        }
            
        if (errors.length > 0) {
            event.preventDefault();
            let errorsDiv = document.getElementById("errors");
            errorsDiv.innerHTML = "";
            for (let error of errors) {
                messageRenderer.showErrorAsAlert(error);
            }
    
        }
        return errors
    }
}

export { userValidator };
