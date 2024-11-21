import AbstractCustomSelect from './abstractCustomSelect.js';

export default class CustomFontSizeSelect extends AbstractCustomSelect {
    // eslint-disable-next-line no-useless-constructor
    constructor(data) {
        super(data);
    }

    generateCustomSelect() {
        super.generateCustomSelect();

        this.selectWrapper.classList.add('font-size-select');

        this.chosenOption.textContent = this.data[0].size;
    }

    generateOption(item) {
        const selectOption = document.createElement('div');
        selectOption.classList.add('select-option');
        selectOption.innerText = item.size;

        setTimeout(() => {
            selectOption.style.height = `${this.selectWrapper.getBoundingClientRect().height}px`;
        }, 0);

        selectOption.addEventListener('mousedown', (e) => {
            e.preventDefault();

            this.chosenOption.textContent = item.size;
            this.chosenOption.setAttribute('data-font-size', item.size);

            this.optionsWrapper.classList.toggle('none');

            this.optionPickEvent = new CustomEvent('optionPick', { detail: item.size });
            this.dispatchEvent(this.optionPickEvent);
        });

        return selectOption;
    }
}
