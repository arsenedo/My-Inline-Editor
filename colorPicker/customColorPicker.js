import CanvasGradient from "./canvasGradient.js";
import CustomRange from "./customRange.js";

export default class CustomColorPicker {
    constructor(selector) {
        this.setupGui();

        this.connectToElements(selector)
    }

    defaultConfig = {
        width: 300,
        height: 300,
        targetMargin : 10,
    }

    colorPickerWrapper;

    colorPreviewCircle;

    canvas;
    canvasGradient;

    hueSlider;
    alphaSlider;

    colorData = [255, 0, 0]
    opacity = 1;

    currentTarget

    setupGui() {
        this.colorPickerWrapper = document.createElement('div');
        this.colorPickerWrapper.classList.add('color-picker');
        this.colorPickerWrapper.style.width = `${this.defaultConfig.width}px`;
        this.colorPickerWrapper.style.height = `${this.defaultConfig.height}px`;
        this.colorPickerWrapper.style.visibility = 'hidden'

        this.colorPickerWrapper.addEventListener('mousedown', (e) => {
            e.preventDefault();
        })

        // COLOR PICKER HEADER
        const colorPickerHeader = document.createElement('div');
        colorPickerHeader.classList.add('color-picker-header');

        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('color-picker-canvas');
        this.canvas.id = 'color-picker-canvas';
        this.canvas.width = this.defaultConfig.width
        this.canvas.height = this.defaultConfig.height/2
        this.canvas.style.width = this.defaultConfig.width + 'px';
        this.canvas.style.height = this.defaultConfig.height/2 + 'px';

        colorPickerHeader.appendChild(this.canvas);
        this.colorPickerWrapper.appendChild(colorPickerHeader);
        // END COLOR PICKER HEADER

        // COLOR PICKER BODY
        const colorPickerBody = document.createElement('div');
        colorPickerBody.classList.add('color-picker-body');

        // // ALPHA HUE SLIDER WRAPPER
        const alphaHueSliderWrapper = document.createElement('div');
        alphaHueSliderWrapper.classList.add('alpha-hue-slider-wrapper');

        // // // COLOR PREVIEW
        const colorPreview = document.createElement('div');
        colorPreview.classList.add('color-preview');

        this.colorPreviewCircle = document.createElement('div');
        this.colorPreviewCircle.classList.add('color-preview-circle');

        colorPreview.appendChild(this.colorPreviewCircle);
        alphaHueSliderWrapper.appendChild(colorPreview);
        // // // END COLOR PREVIEW

        // // // ALPHA HUE SLIDER
        const alphaHueSlider = document.createElement('div');
        alphaHueSlider.classList.add('alpha-hue-slider');

        // hue slider
        this.hueSlider = new CustomRange(0, 360, 1, 0);

        this.hueSlider.addEventListener('updateSlider', (e) => {
           this.canvasGradient.updateCanvasGradient(e.detail)
        });

        alphaHueSlider.appendChild(this.hueSlider.rangeWrapper);
        // end hue slider

        // alpha slider
        this.alphaSlider = new CustomRange(0, 100, 1, 100);
        this.alphaSlider.range.classList.add('gradient');
        this.alphaSlider.updateRangeStyles(
            {
                backgroundImage: 'url("public/images/transparent.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }
        )

        this.alphaSlider.addEventListener('updateSlider', (e) => {
            this.opacity = e.detail/100;
            this.updateColor();
        })

        alphaHueSlider.appendChild(this.alphaSlider.rangeWrapper);
        alphaHueSliderWrapper.appendChild(alphaHueSlider);
        // end alpha slider

        // // // END ALPHA HUE SLIDER
        // // END ALPHA HUE SLIDER WRAPPER
        colorPickerBody.appendChild(alphaHueSliderWrapper)
        this.colorPickerWrapper.appendChild(colorPickerBody);
        // END COLOR PICKER BODY

        document.body.appendChild(this.colorPickerWrapper);

        this.canvasGradient = new CanvasGradient(this.canvas);
        this.canvasGradient.addEventListener('updateColor', (e) => {
            this.colorData = e.detail.colorData;
            document.querySelector(':root').style.setProperty('--range-gradient-rgb', `${this.colorData[0]},${this.colorData[1]},${this.colorData[2]}, 1`)
            this.updateColor();
        })
    }

    openColorPicker(trigger) {
        this.currentTarget = document.getElementById(trigger.htmlFor);

        const triggerPos = trigger.getBoundingClientRect();
        this.colorPickerWrapper.style.top = `${triggerPos.y + triggerPos.height + this.defaultConfig.targetMargin}px`;
        this.colorPickerWrapper.style.left = `${triggerPos.x - triggerPos.width - this.defaultConfig.targetMargin}px`;
        this.colorPickerWrapper.style.visibility = 'visible';
    }

    closeColorPicker() {
        this.colorPickerWrapper.style.top = "0";
        this.colorPickerWrapper.style.left = "-100%";
        this.colorPickerWrapper.style.visibility = "hidden";
    }

    connectToElements(selector) {
        setTimeout(() => {
            document.querySelectorAll(selector).forEach((el) => {
                el.addEventListener('mousedown', (e) => {
                    e.preventDefault();

                    if(this.colorPickerWrapper.style.visibility === 'hidden' || !this.isSameTarget(el)) {
                        this.openColorPicker(el);
                        return
                    }
                    this.closeColorPicker()
                }) ;
            });
        }, 0)
    }

    updateColor() {
        const rgba = `rgba(${this.colorData[0]},${this.colorData[1]},${this.colorData[2]}, ${this.opacity})`;

        this.colorPreviewCircle.style.backgroundColor = rgba;
        this.currentTarget.value = rgba;
    }

    isSameTarget(trigger) {
        return trigger.htmlFor === this.currentTarget.id;
    }
}
