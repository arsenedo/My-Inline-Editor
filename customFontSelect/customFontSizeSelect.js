import AbstractCustomSelect from './abstractCustomSelect.js';

export default class CustomFontSizeSelect extends AbstractCustomSelect {
    // eslint-disable-next-line no-useless-constructor
    constructor(data) {
        super(data);
    }

    generateCustomSelect() {
        super.generateCustomSelect();

        this.selectWrapper.classList.add('font-size-select');

        this.chosenOption.textContent = this.data[0].name;
        this.chosenOption.style.textTransform = 'uppercase'
    }

    generateOption(item) {
        const selectOption = document.createElement('div');
        selectOption.classList.add('select-option');
        selectOption.innerText = item.name;
        selectOption.style.textTransform = 'uppercase';

        setTimeout(() => {
            selectOption.style.height = `${this.selectWrapper.getBoundingClientRect().height}px`;
        }, 0);

        selectOption.addEventListener('mousedown', (e) => {
            e.preventDefault();

            this.chosenOption.textContent = item.name;
            this.chosenOption.setAttribute('data-font-size', item.value);

            this.optionsWrapper.classList.toggle('none');

            this.optionPickEvent = new CustomEvent('optionPick', { detail: item.value });
            this.dispatchEvent(this.optionPickEvent);
        });

        return selectOption;
    }
}
