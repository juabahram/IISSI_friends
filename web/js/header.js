"use strict";

import {sessionManager} from "/js/utils/session.js";

function main(){
    showUser();
    addLogoutHandler();
    hideHeaderOptions();
}

function showUser(){
    let title = document.getElementById("navbar-title");
    let text;

    if(sessionManager.isLogged()){
        let username = sessionManager.getLoggedUser().username;
        text = "Hola, @" + username;
    }else{
        text = "Invitado";
    }
    title.textContent = text;
}

async function addLogoutHandler(){
    let logoutButton = document.getElementById("navbar-logout");

    logoutButton.onclick = function(){
        sessionManager.logout();
        window.location.href = "index.html";
    };
}

function hideHeaderOptions(){
    let headerRegister = document.getElementById("navbar-register");
    let headerLogout = document.getElementById("navbar-logout");
    let headerPersonal = document.getElementById("navbar-personal");

    if(sessionManager.isLogged()){
        headerRegister.style.display = "none";

    }else{
        headerLogout.style.display = "none";
        headerPersonal.style.display="none";
    }
}

document.addEventListener("DOMContentLoaded", main);
