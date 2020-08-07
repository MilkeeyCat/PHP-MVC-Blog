import {Slider, transitionDuration} from "./slider.js";
import {animateAlert} from "./functions.js";

const slider3 = new Slider({
    slider: ".sidebar__slider",
    transitionDuration,
    defaultTranslateX: "-100%",
    maxTranslateX: "-200%"
});

const burgerMenuBtn = document.querySelector(".header__burger-menu-inner");
const burgerMenu = document.querySelector(".header__menu");
const blurBg = document.querySelector(".bg-blur");

burgerMenuBtn.onclick = function () {
    this.classList.toggle("active");
    burgerMenu.style.transitionDuration = ".5s";
    burgerMenu.classList.toggle("show");
    blurBg.classList.toggle("hidden");
    const a = () => {
        this.classList.toggle("active");
        burgerMenu.classList.toggle("show");
        blurBg.classList.toggle("hidden");

        blurBg.removeEventListener("click", a);
    }
    blurBg.addEventListener("click", a);
}

document.querySelector(".header__search > a").onclick = function () {
    const a = document.querySelector(".search input");

    const handler = setTimeout(() => {
        a.focus();
        clearTimeout(handler);
    }, 0);
};

let hiddenFooter = JSON.parse(localStorage.getItem("hiddenFooter")) || false;
const footerHideData = document.querySelector(".footer__cols");
const footerHideDataHeight = footerHideData.style.height = footerHideData.offsetHeight + "px";

hiddenFooter ? hideFooter("fast") : null;

function hideFooter(speed = "slow") {
    const btn = document.querySelector(".footer__hide-btn");
    const arrow = btn.children[0];
    if (speed == "slow") {
        footerHideData.style.height = "0";
        localStorage.setItem("hiddenFooter", true);
    } else if (speed == "fast") {
        const durationVal = footerHideData.style.transitionDuration;
        const durationVal2 = arrow.style.transitionDuration;
        footerHideData.style.transitionDuration = "0ms";
        arrow.style.transitionDuration = "0ms";
        hideFooter();
        footerHideData.style.transitionDuration = durationVal;
        arrow.style.transitionDuration = durationVal2;
    }
}

function showFooter() {
    footerHideData.style.height = footerHideDataHeight;
    localStorage.setItem("hiddenFooter", false);
}

document.querySelector(".footer__hide-btn").onclick = function () {
    this.classList.toggle("footer__hide-btn_active");
    if (!hiddenFooter) {
        hideFooter();
    } else {
        showFooter();
    }
    hiddenFooter = !hiddenFooter;
}

window.addEventListener("load", () => {
    slider3.run();
});

const subscribeForm = document.querySelector('.footer__form');

subscribeForm.onsubmit = async function (e) {
    e.preventDefault();

    const errors = [];

    const data = {
        "username": this.querySelector("input:first-child").value,
        "email": this.querySelector("input:nth-child(2)").value
    };

    if (data.username.trim() == "") {
        errors.push("Please enter your name");
    }
    if (data.email.trim() == "") {
        errors.push("Please enter your email address");
    }
    if (!/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(data.email)) {
        errors.push("Please enter correct email address!");
    }

    if (errors.length !== 0) {
        animateAlert("error", errors[0]);
        throw new Error("Не пройдешь");
    }

    const result = await fetch("/subscribe", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data)
    }).then(res => res.json());

    if (result.status == 200) {
        const msg = result.message;
        animateAlert("success", msg);
        this.reset();
    } else {
        const error = result.message;
        animateAlert("error", error);
    }
}