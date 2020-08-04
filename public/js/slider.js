export const transitionDuration = ".5s";

export class Slider {
    moving = false;
    transitionDuration;
    slider;
    elements = {};

    constructor(conf) {
        this.slider = conf["slider"];
        this.transitionDuration = conf.transitionDuration;
        this.translate = {"default": conf.defaultTranslateX, "max": conf.maxTranslateX};
        this.updateVariablesValue(conf);
    }

    updateVariablesValue() {
        const slider = document.querySelector(this.slider);

        this.elements.sliderContainer = slider.querySelector(".slider__slides");
        this.elements.nextBtn = slider.querySelector(".slider__next-btn");
        this.elements.prevBtn = slider.querySelector(".slider__prev-btn");
        this.elements.slides = slider.querySelectorAll(".slider__slide");
    }

    nexSlide() {
        if (!this.moving) {
            this.moving = true;
            this.elements.sliderContainer.style.transitionDuration = this.transitionDuration;
            this.elements.sliderContainer.style.transform = `translateX(${this.translate.max})`;

            const handler = () => {
                this.elements.sliderContainer.style.transitionDuration = "0ms";
                this.elements.sliderContainer.style.transform = `translateX(${this.translate.default})`;

                const slide = this.elements.slides[0];
                slide.parentNode.appendChild(slide);

                this.elements.sliderContainer.removeEventListener("transitionend", handler);
                this.moving = false;
                this.updateVariablesValue();
            }

            this.elements.sliderContainer.addEventListener("transitionend", handler);
        }
    }

    prevSlide() {
        if (!this.moving) {

            this.moving = true;
            this.elements.sliderContainer.style.transitionDuration = this.transitionDuration;
            this.elements.sliderContainer.style.transform = `translateX(0)`;
            const handler = () => {
                this.elements.sliderContainer.style.transitionDuration = "0ms";
                this.elements.sliderContainer.style.transform = `translateX(${this.translate.default})`;

                const slide = this.elements.slides[this.elements.slides.length - 1];
                slide.parentNode.insertBefore(slide, this.elements.slides[0]);

                this.elements.sliderContainer.removeEventListener("transitionend", handler);
                this.moving = false;
                this.updateVariablesValue();
            }

            this.elements.sliderContainer.addEventListener("transitionend", handler);
        }
    }

    run() {
        this.elements.nextBtn.onclick = () => {
            this.nexSlide();
        }

        this.elements.prevBtn.onclick = () => {
            this.prevSlide();
        }
    }
}

export class ManySlidesSlider extends Slider {
    updateVariablesValue() {
        const slider = document.querySelector(this.slider);

        this.elements.sliderContainer = slider.querySelector(".many-slides-slider__slides");
        this.elements.nextBtn = slider.querySelector(".many-slides-slider__next-btn");
        this.elements.prevBtn = slider.querySelector(".many-slides-slider__prev-btn");
        this.elements.slides = slider.querySelectorAll(".many-slides-slider__slide");
    }
}