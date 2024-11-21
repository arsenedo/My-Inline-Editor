import AbstractCustomSelect from './abstractCustomSelect.js';

export default class CustomFontSelect extends AbstractCustomSelect {
    // eslint-disable-next-line no-useless-constructor
    constructor(data) {
        super(data);
    }

    generateCustomSelect() {
        super.generateCustomSelect();

        this.selectWrapper.classList.add('font-select');
    }

    generateOption(font) {
        const selectOption = document.createElement('div');
        selectOption.classList.add('select-option');
        selectOption.innerText = font.name;
        const fontString = `${font.name} ${font.fallback}`;
        selectOption.style.fontFamily = fontString;

        setTimeout(() => {
            selectOption.style.height = `${this.selectWrapper.getBoundingClientRect().height}px`;
        }, 0);

        selectOption.addEventListener('mousedown', (e) => {
            e.preventDefault();

            this.chosenOption.textContent = font.name;
            this.chosenOption.style.fontFamily = fontString;
            this.chosenOption.setAttribute('data-font', fontString);

            this.optionsWrapper.classList.toggle('none');

            this.optionPickEvent = new CustomEvent('optionPick', { detail: fontString });
            this.dispatchEvent(this.optionPickEvent);
        });

        return selectOption;
    }
}
