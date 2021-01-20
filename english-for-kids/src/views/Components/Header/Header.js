/* eslint-disable implicit-arrow-linebreak,function-paren-newline,no-param-reassign */
/* eslint-disable implicit-arrow-linebreak,comma-dangle */
import createElement from "../../../js/Utils/createElement";
import Navigation from "./templates/Navigation";
import PlayToggle from "./templates/PlayToggle";
import NavLogo from "./templates/NavLogo";

export function setCurrentMenu(href) {
    const links = document.querySelectorAll("#nav-link");
    const nav = document.querySelector(".nav");
    if (href === "#/") {
        href = "#/categories";
    }
    links.forEach((link) => {
        if (href === link.getAttribute("href").slice(1)) {
            nav.querySelector(".active").classList.remove("active");
            link.classList.add("active");
        }
    });
}

export default function HeaderInit(changeMode) {
    const header = createElement("div", "header");

    header.innerHTML = `
        ${Navigation()} 
        ${NavLogo()}
        ${PlayToggle()}
    `;

    const overlay = createElement("div", "overlay");
    document.body.prepend(overlay);
    const menuBtn = header.querySelector(".menu-btn");
    const toggle = header.querySelector(".toggle");
    const nav = header.querySelector(".nav");

    menuBtn.addEventListener("click", () => {
        nav.classList.toggle("open");
        overlay.classList.toggle("engaged");
        menuBtn.classList.toggle("active");
    });

    overlay.addEventListener("click", () => {
        menuBtn.click();
    });

    toggle.addEventListener("click", () => {
        toggle.classList.toggle("toggle-on");
        changeMode();
    });

    document.body.prepend(header);
}
