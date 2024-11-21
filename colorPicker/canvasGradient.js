export default class CanvasGradient extends EventTarget {
    colorData = [0, 0, 255];

    #isDragging = false;

    constructor(canvas) {
        super();
        this.canvas = canvas;

        this.ctx = this.canvas.getContext('2d', {willReadFrequently: true});

        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();

            this.#isDragging = true;
        });

        this.canvas.addEventListener('mousemove', (event) => {
            if(!this.#isDragging) return;
            const colorCanvasRect = this.canvas.getBoundingClientRect();
            let x = event.clientX - colorCanvasRect.x;  // Get X coordinate
            let y = event.clientY - colorCanvasRect.y;  // Get Y coordinate
            this.colorData = this.ctx.getImageData(x, y, 1, 1)['data'];   // Read pixel Color

            this.dispatchEvent(new CustomEvent('updateColor', {
                detail: { colorData : this.colorData }
            }));
        });

        document.addEventListener('mouseup', () => {
            this.#isDragging = false;
        });

        this.updateCanvasGradient(0);
    }

    updateCanvasGradient(hue) {
        // Convert the hue into an HSL color
        let color = `hsl(${hue}, 100%, 50%)`;

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Create a new gradient
        let gradientH = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        gradientH.addColorStop(0, '#fff');
        gradientH.addColorStop(1, color);

        // Apply the gradient and fill the canvas
        this.ctx.fillStyle = gradientH;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Create a Vertical Gradient(white to black)
        let gradientV = this.ctx.createLinearGradient(0, 0, 0, this.ctx.canvas.height);
        gradientV.addColorStop(0, 'rgba(0,0,0,0)');
        gradientV.addColorStop(1, '#000');
        this.ctx.fillStyle = gradientV;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width,
            this.ctx.canvas.height);
    }
}
