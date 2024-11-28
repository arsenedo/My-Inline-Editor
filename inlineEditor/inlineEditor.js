import css from '../utilities.js';
import fonts from '../public/fonts.js';
import CustomFontSelect from '../customFontSelect/customFontSelect.js';
import CustomFontSizeSelect from '../customFontSelect/customFontSizeSelect.js';
import CustomColorPicker from "../colorPicker/customColorPicker.js";

export default class InlineEditor {
    colorPickers = [];

    popup;

    isOpen;

    actionButtons = {
        b : undefined,
        i : undefined,
        u : undefined,
        strike : undefined,
        sub : undefined,
        sup : undefined,
    }

    fontButtons = {
        fontFamily : undefined,
        fontSize : undefined
    }

    colorButtons = {
        bgColor : undefined,
        foreColor : undefined,
    }

    constructor(input) {
        this.input = input;
        this.customColorPicker = new CustomColorPicker(".color-picker-label");
    }

    generateTextEditor = () => {
        const generateActionBtn = (btnText, styles, callback) => {
            //const actionWrapper = document.createElement('div');
            //actionWrapper.classList.add('action-wrapper');

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

            actionBtn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                e.stopPropagation();
            })

            //actionWrapper.appendChild(actionBtn);

            return actionBtn;
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
                colorFillBtn.setAttribute('data-color', colorPickerInput.value)
                callback(e, colorFillBtn);
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
        this.popup.style.top = `-${defaultStyles.height + defaultStyles.margin}px`;
        this.popup.style.left = `-${defaultStyles.width / 2 - this.input.getBoundingClientRect().width/2}px`;
        this.popup.style.width = `${defaultStyles.width / defaultStyles.rem}rem`;
        this.popup.style.height = `${defaultStyles.height / defaultStyles.rem}rem`;
        this.popup.id = 'text-editor-popup';

        // Prevent the input to lose focus when the popup is clicked
        this.popup.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        this.popup.addEventListener('mouseup', (e) => {
            e.preventDefault();
            e.stopPropagation();
        })

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
            this.execCommand('fontName', e.detail)
        });

        const sizeArray = [
            {
                name: "xxs",
                value: 1
            },
            {
                name: "xs",
                value: 2
            },
            {
                name: "s",
                value: 3
            },
            {
                name: "md",
                value: 4,
            },
            {
                name: "lg",
                value: 5
            },
            {
                name: "xl",
                value: 6
            },
            {
                name: "xxl",
                value: 7
            }
        ];

        const fontSizeSelect = new CustomFontSizeSelect(sizeArray);
        fontSizeSelect.generateCustomSelect();
        fontPicker.appendChild(fontSizeSelect.getSelectWrapper());

        const currentFontSize = css(this.input, 'font-size');

        fontSizeSelect.addEventListener('optionPick', (e) => {
            this.execCommand('fontSize', e.detail);
        });

        popupWrapper.appendChild(fontPicker);

        // BACKGROUND PICKER
        const backgroundPicker = generateColorUpdateBtn(
            'bgColorPicker',
            (e, colorPicker) => {
                    this.execCommand('hiliteColor', colorPicker.getAttribute('data-color'));
                },
            { backgroundImage: 'url("public/svg/fill.svg")', gridArea: 'background-picker' }
            );

        popupWrapper.appendChild(backgroundPicker);

        // BOLD TEXT
        const boldWrapper = generateActionBtn(
            'B',
            { fontWeight: 'bold' },
            () => {
                this.execCommand('bold');
            }
        );
        this.actionButtons.b = boldWrapper;
        popupWrapper.appendChild(boldWrapper);

        // ITALIC TEXT
        const italicWrapper = generateActionBtn(
            'I',
            { fontStyle: 'italic', fontFamily: 'serif' },
            () => {
                this.execCommand('italic')
            }
        );
        this.actionButtons.i = italicWrapper;
        popupWrapper.appendChild(italicWrapper);

        // UNDERLINE TEXT
        const underlineWrapper = generateActionBtn(
            'U',
            { textDecoration: 'underline' },
            () => {
                this.execCommand('underline')
            }
        );
        this.actionButtons.u = underlineWrapper;
        popupWrapper.appendChild(underlineWrapper);

        // LINE-THROUGH TEXT
        const lineThroughWrapper = generateActionBtn(
            'ab',
            { textDecoration: 'line-through' },
            () => {
                this.execCommand('strikeThrough');
            }
        );
        this.actionButtons.strike = lineThroughWrapper;
        popupWrapper.appendChild(lineThroughWrapper);

        // SUB TEXT
        const subWrapper = generateActionBtn(
            'x<sub>2</sub>',
            {fontSize: '0.75rem'},
            () => {
                this.execCommand('subscript');
            }
        );
        this.actionButtons.sub = subWrapper;
        popupWrapper.appendChild(subWrapper);

        // SUP TEXT
        const supWrapper = generateActionBtn(
            'x<sup>2</sup>',
            {},
            () => {
                this.execCommand('superscript');
            }
        );
        this.actionButtons.sup = supWrapper;
        popupWrapper.appendChild(supWrapper);

        // TEXT COLOR PICKER
        const textColorPicker = generateColorUpdateBtn(
            'textColorPicker',
            (e, colorPickerInput) => {
                    this.execCommand('foreColor', colorPickerInput.getAttribute('data-color'));
                },
            { backgroundImage: 'url("public/svg/text_color.svg")', gridArea: 'color-picker' }
        );

        popupWrapper.appendChild(textColorPicker);

        this.input.parentElement.appendChild(this.popup);

        this.isOpen = true;

        return this.popup;
    };

    execCommand(command, value = null) {
        document.execCommand(command, false, value);
    }

    destroy() {
        this.popup.remove();
        this.customColorPicker.colorPickerWrapper.remove();
        this.isOpen = false;
    }

    handleActiveOptions() {
        console.log("Handle active options")
        this.clearActive();

        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        // Helper to collect ancestors of a node up to the input-div
        function collectAncestors(node) {
            const ancestors = [];
            while (node && node.id !== "input-div") {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    ancestors.push(node);
                }
                node = node.parentNode; // Move to the parent
            }
            return ancestors;
        }

        // Get ancestors for both start and end containers
        const startAncestors = collectAncestors(range.startContainer);
        const endAncestors = collectAncestors(range.endContainer);

        // Combine both lists, ensuring no duplicates
        const fullTree = Array.from(new Set([...startAncestors, ...endAncestors]));

        fullTree.forEach((tag) => {
            const tagName = tag.tagName.toLowerCase();

            if(tagName === "font" || tagName === "span") return;

            // Everything else
            this.actionButtons[tagName].classList.add('active');
        });
    }

    clearActive = () => {
        Object.keys(this.actionButtons).forEach((key) => {
            if (!this.actionButtons[key]) return;
            this.actionButtons[key].classList.remove('active');
        });
    }
}
