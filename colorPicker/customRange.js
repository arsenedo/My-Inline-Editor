export default class CustomRange extends EventTarget {
    rangeWrapper;
    range;
    thumb;

    isDragging = false;

    constructor(min = 0, max = 100, step = 1, defaultValue = 50) {
        super();
        this.min = min;
        this.max = max;
        this.step = step;
        this.value = defaultValue;

        this.setupGui();

        this.updateSlider(this.value)
    }

    setupGui() {
        // RANGE WRAPPER
        this.rangeWrapper = document.createElement('div');
        this.rangeWrapper.classList.add('custom-range-wrapper');
        // END RANGE WRAPPER

        // CUSTOM RANGE
        this.range = document.createElement('div');
        this.range.classList.add('custom-range');

        this.rangeWrapper.appendChild(this.range);
        // END CUSTOM RANGE

        // CUSTOM THUMB
        this.thumb = document.createElement('div');
        this.thumb.classList.add('custom-range-thumb');

        this.range.appendChild(this.thumb);
        // END CUSTOM THUMB

        this.range.addEventListener("mousedown", e => {
            e.preventDefault();
            e.stopPropagation();
            this.isDragging = true;

            this.handleMove(e)
        })

        document.addEventListener("mouseup", e => {
            this.isDragging = false;
        });

        document.addEventListener("mousemove", e => {
            if (!this.isDragging) return;
            //if (e.clientX + 10 < rangeRect.x || e.clientX - 10 > rangeRect.x + rangeRect.width) return;

            this.handleMove(e);
        });
    }

    updateSlider(value) {
        const percentage = ((value - this.min) / (this.max - this.min)) * 100;

        this.thumb.style.left = `${percentage}%`;

        this.value = value;

        this.dispatchEvent(new CustomEvent('updateSlider', {
            detail : this.value,
        }));
    }

// Snap to nearest step
    snapToStep(value) {
        const steps = Math.round((value - this.min) / this.step);
        return this.min + steps * this.step;
    }

    /**
     * Updates the range track styles
     * @param styles
     */
    updateRangeStyles(styles) {
        Object.keys(styles).forEach((key) => {
           this.range.style[key] = styles[key];
        });
    }

    handleMove(e) {
        const rangeRect = this.range.getBoundingClientRect();

        const offsetX = e.clientX - rangeRect.left;
        const percentage = Math.max(0, Math.min(100, (offsetX / rangeRect.width) * 100));
        let rawValue = (percentage / 100) * (this.max - this.min) + this.min;
        const value = this.snapToStep(rawValue); // Snap to the nearest step
        this.updateSlider(value);
    }
}
