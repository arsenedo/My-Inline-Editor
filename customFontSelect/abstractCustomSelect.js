export default class AbstractCustomSelect extends EventTarget {
    selectWrapper;

    optionsWrapper;

    chosenOption;

    optionPickEvent;

    constructor(data) {
        super();
        if (new.target === AbstractCustomSelect) {
            throw new Error('Cannot instantiate an abstract class directly.');
        }
        this.data = data;
    }

    generateCustomSelect() {
        this.selectWrapper = document.createElement('div');
        this.selectWrapper.classList.add('select-wrapper');

        this.optionsWrapper = document.createElement('div');
        this.optionsWrapper.classList.add('options-wrapper');
        this.optionsWrapper.classList.add('none');

        this.chosenOption = document.createElement('div');
        this.chosenOption.classList.add('chosen-option');
        this.chosenOption.textContent = this.data[0].name;

        this.selectWrapper.appendChild(this.chosenOption);
        this.selectWrapper.appendChild(this.optionsWrapper);

        for (const item of this.data) {
            const selectOption = this.generateOption(item);

            this.optionsWrapper.appendChild(selectOption);
        }

        this.chosenOption.addEventListener('mousedown', (e) => {
            e.preventDefault();

            this.optionsWrapper.classList.toggle('none');
        });
    }

    getSelectWrapper() {
        return this.selectWrapper;
    }

    // eslint-disable-next-line class-methods-use-this,no-unused-vars
    generateOption(item, callback) {
        throw new Error('Method not implemented');
    }
}
