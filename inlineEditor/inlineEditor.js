import css from '../utilities.js';
import fonts from '../public/fonts.js';
import CustomFontSelect from '../customFontSelect/customFontSelect.js';
import CustomFontSizeSelect from '../customFontSelect/customFontSizeSelect.js';
import CustomColorPicker from "../colorPicker/customColorPicker.js";

export default class InlineEditor {
    colorPickers = [];

    popup;

    constructor(input) {
        this.input = input;
        this.customColorPicker = new CustomColorPicker(".color-picker-label");
    }

    generateTextEditor = (pos = 'TOP') => {
        const generateActionBtn = (btnText, styles, callback) => {
            const actionWrapper = document.createElement('div');
            actionWrapper.classList.add('action-wrapper');

            const actionBtn = document.createElement('button');
            actionBtn.classList.add('action-btn');
            actionBtn.innerHTML = btnText;

            Object.keys(styles).forEach((key) => {
                actionBtn.style[key] = styles[key];
            });

            actionBtn.addEventListener('mousedown', (e) => {
                actionBtn.classList.toggle('active');
                callback();
            });

            actionWrapper.appendChild(actionBtn);

            return actionWrapper;
        };

        const generateColorUpdateBtn = (id, callback, styles = {},) => {
            const colorPicker = document.createElement('div');
            colorPicker.classList.add('editor-color-picker');
            if (styles?.gridArea) colorPicker.style.gridArea = styles.gridArea;
            const colorWrapper = document.createElement('div');
            colorWrapper.classList.add('color-fill-wrapper');
            const colorFillBtn = document.createElement('button');
            colorFillBtn.classList.add('color-fill-btn');
            if (styles?.backgroundImage) colorFillBtn.style.backgroundImage = styles.backgroundImage;
            colorFillBtn.addEventListener('mousedown', (e) => {
                callback(e, colorPickerInput);
            });

            colorWrapper.appendChild(colorFillBtn);

            const colorPickerWrapper = document.createElement('div');
            colorPickerWrapper.classList.add('editor-color-picker-wrapper');

            const colorPickerLabel = document.createElement('label');
            colorPickerLabel.htmlFor = id;
            colorPickerLabel.classList.add('color-picker-label');

            const colorPickerInput = document.createElement('input');
            colorPickerInput.id = id;
            colorPickerInput.classList.add('color-picker-input');
            colorPickerInput.type = 'text';

            colorPickerWrapper.appendChild(colorPickerLabel);
            colorPickerWrapper.appendChild(colorPickerInput);

            colorPicker.appendChild(colorWrapper);
            colorPicker.appendChild(colorPickerWrapper);

            this.colorPickers.push({
                input: colorPickerInput,
                label: colorPickerLabel,
                btn: colorFillBtn
            });

            return colorPicker;
        };

        const defaultStyles = {
            width: 300,
            height: 75,
            margin: 25,
            rem: 16,
        };

        const inputRect = this.input.getBoundingClientRect();

        //this.customColorPicker.init(true);

        // POPUP
        this.popup = document.createElement('div');
        this.popup.classList.add('text-editor-popup');

        this.popup.style.position = 'absolute';
        this.popup.style.top = `-${defaultStyles.height + defaultStyles.margin + inputRect.height}px`;
        this.popup.style.left = `${parseInt(this.input.style.left, 10) + inputRect.width / 2}px`;
        this.popup.style.transform = 'translateX(-50%)';
        this.popup.style.width = `${defaultStyles.width / defaultStyles.rem}rem`;
        this.popup.style.height = `${defaultStyles.height / defaultStyles.rem}rem`;
        this.popup.id = 'text-editor-popup';

        // Prevent the input to lose focus when the popup is clicked
        this.popup.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });

        // POPUP WRAPPER
        const popupWrapper = document.createElement('div');
        popupWrapper.classList.add('text-editor-popup-wrapper');

        this.popup.appendChild(popupWrapper);

        // FONT Picker
        const fontPicker = document.createElement('div');
        fontPicker.classList.add('font-picker');

        const fontSelect = new CustomFontSelect(fonts);
        fontSelect.generateCustomSelect();
        fontPicker.appendChild(fontSelect.getSelectWrapper());

        const currFont = css(this.input, 'font-family');

        fontSelect.addEventListener('optionPick', (e) => {
            this.input.style.fontFamily = `${e.detail}`;
        });

        const sizeArray = [];
        for (let i = 2; i <= 72; i += 2) {
            sizeArray.push({ size: i });
        }

        const fontSizeSelect = new CustomFontSizeSelect(sizeArray);
        fontSizeSelect.generateCustomSelect();
        fontPicker.appendChild(fontSizeSelect.getSelectWrapper());

        const currentFontSize = css(this.input, 'font-size');

        fontSizeSelect.addEventListener('optionPick', (e) => {
            this.input.style.fontSize = `${e.detail / 16}rem`;
        });

        popupWrapper.appendChild(fontPicker);

        // BACKGROUND PICKER
        const backgroundPicker = generateColorUpdateBtn(
            'bgColorPicker',
            (e, colorPicker) => {
                this.input.style.backgroundColor = colorPicker.value;
                },
            { backgroundImage: 'url("public/svg/fill.svg")', gridArea: 'background-picker' }
            );

        popupWrapper.appendChild(backgroundPicker);

        // BOLD TEXT
        const boldWrapper = generateActionBtn(
            'B',
            { fontWeight: 'bold' },
            () => (this.input.classList.contains('bold')
                ? this.input.classList.remove('bold') : this.input.classList.add('bold'))
        );
        popupWrapper.appendChild(boldWrapper);

        // ITALIC TEXT
        const italicWrapper = generateActionBtn(
            'I',
            { fontStyle: 'italic', fontFamily: 'serif' },
            () => this.input.classList.toggle('italic')
        );
        popupWrapper.appendChild(italicWrapper);

        // UNDERLINE TEXT
        const underlineWrapper = generateActionBtn(
            'U',
            { textDecoration: 'underline' },
            () => this.input.classList.toggle('underline')
        );

        popupWrapper.appendChild(underlineWrapper);

        // LINE-THROUGH TEXT
        const lineThroughWrapper = generateActionBtn(
            'ab',
            { textDecoration: 'line-through' },
            () => this.input.classList.toggle('line-through')
        );

        popupWrapper.appendChild(lineThroughWrapper);

        // SUB TEXT
        const subWrapper = generateActionBtn(
            'x<sub>2</sub>',
            {},
            () => console.log('TODO SUB BTN')
        );

        popupWrapper.appendChild(subWrapper);

        // SUP TEXT
        const supWrapper = generateActionBtn(
            'x<sup>2</sup>',
            {},
            () => console.log('TODO SUP BTN')
        );

        popupWrapper.appendChild(supWrapper);

        // TEXT COLOR PICKER
        const textColorPicker = generateColorUpdateBtn(
            'textColorPicker',
            (e, colorPicker) => {
                this.input.style.color = colorPicker.value;
                },
            { backgroundImage: 'url("public/svg/text_color.svg")', gridArea: 'color-picker' }
        );

        popupWrapper.appendChild(textColorPicker);

        this.input.parentElement.appendChild(this.popup);

        return this.popup;
    };

    destroy() {
        this.popup.remove();
        this.customColorPicker.colorPickerWrapper.remove();
    }
}
