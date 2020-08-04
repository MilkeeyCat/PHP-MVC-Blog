import {Slider, ManySlidesSlider, transitionDuration} from "./slider.js";

const slider1 = new Slider({
    slider: ".main__slider",
    transitionDuration,
    defaultTranslateX: "-100%",
    maxTranslateX: "-200%"
});

const slider2 = new ManySlidesSlider({
    slider: ".main__many-slides-slider",
    transitionDuration,
    // defaultTranslateX: "-25%",
    defaultTranslateX: "-292.5px",
    maxTranslateX: "-50%"
});

window.addEventListener("load", () => {
    slider1.run();
    slider2.run();
});