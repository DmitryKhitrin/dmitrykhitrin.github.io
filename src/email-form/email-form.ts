import {bemCn} from '../helpers/bem-cn';
import {EventBus} from '../helpers/event-bus';
import {isEnterKey} from '../helpers/is-enter-key';
import {isDOM} from '../helpers/is-dom';

const MAX_LENGTH = 50;
const EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

type Email = {
    value: string;
    isValid: boolean;
    displayedValue: string;
};

type Settings = {
    maxLenght: number;
};

const cn = bemCn('email-form');
export class EmailForm {
    static EVENTS = {
        MAIL_WASA: 'mail:was-add',
        MAIL_WASR: 'mail:was-removed',
    };

    private _DOMList: HTMLElement | null = null;
    private _DOMInput: HTMLInputElement | null = null;
    private _root: HTMLElement | null = null;
    private _recordsList: Email[] = [];
    private _settings: Settings = {maxLenght: MAX_LENGTH};
    eventBus: EventBus;

    constructor(root?: HTMLElement, _settings?: Settings) {
        if (root && isDOM(root)) {
            root.classList.add(cn());
            this._root = root;
            this._DOMList = document.createElement('div');
            this._DOMList.classList.add(cn('emails-list'));
            this._DOMInput = document.createElement('input');
            this._DOMInput.placeholder = 'add more people…';
            this._root.appendChild(this._DOMList);
            this._DOMList.appendChild(this._DOMInput);
            this._settings = {
                ...this._settings,
                ..._settings,
            };
            this.eventBus = new EventBus();
            this._initEvents();
        } else {
            throw new Error('Root is not valid DOM element.');
        }
    }
    private _getRecordsList = () => {
        return this._recordsList;
    };

    private _processRecords = (reocrds) => {
        return Array.isArray(reocrds) ? reocrds.map(this._createFormRecord) : [this._createFormRecord(reocrds)];
    };

    private _createFormRecord = (record: string | Email): Email => {
        if (typeof record !== 'object') {
            const text = String(record);
            const displayedValue = text.length <= this._settings.maxLenght ? text : `${text.slice(0, 47)}...`;
            return {
                value: text,
                displayedValue,
                isValid: EMAIL_REGEXP.test(text.toLowerCase()),
            };
        }
        return record;
    };

    private _addEmail = (records?: string | string[]) => {
        if (records) {
            const newEmail = this._processRecords(records);
            this._setNewList([...newEmail], false);
            this.eventBus.emit(EmailForm.EVENTS.MAIL_WASA, newEmail);
        }
    };

    private _setNewList = (records: Email[], isRerender: boolean) => {
        const domList = this._DOMList;
        if (domList) {
            this._recordsList = isRerender ? records : [...this._getRecordsList(), ...records];
            this._render(records, isRerender);
        }
    };

    /**
     * @description Initialization form events.
     */
    private _initEvents = () => {
        const input = this._DOMInput;
        let isKeyEvent = false;

        if (input) {
            const setValuseFromEvent = () => {
                const clearedValue = input.value.trim();
                const values = clearedValue.split(',').filter((val) => val);
                input.value = '';
                this._addEmail(values);
            };

            input.addEventListener('keyup', (event) => {
                if (isEnterKey(event)) {
                    isKeyEvent = true;
                    setValuseFromEvent();
                    isKeyEvent = false;
                    event.preventDefault();
                }
            });

            input.addEventListener('focusout', (event) => {
                if (!isKeyEvent) {
                    setValuseFromEvent();
                    event.preventDefault();
                }
            });
        }
    };

    private _onRemove = (index: number) => {
        const records = this._getRecordsList();
        const newList = records.filter((_, i) => i !== index);
        this._setNewList(newList, true);
        this.eventBus.emit(EmailForm.EVENTS.MAIL_WASR, newList);
    };

    private _createListItem = (text: string, isValid: boolean, index: number) => {
        const listItem = document.createElement('p');
        listItem.className = cn('list-item', {isValid});
        listItem.innerHTML = ''.concat(text, ' <span class="_cross" >&times;</span>');
        const cross = listItem.querySelector('span');
        if (cross) {
            cross.addEventListener('click', () => {
                this._onRemove(index);
                return false;
            });
        }
        return listItem;
    };

    private _render = (emails: Email[], isRerender?: boolean) => {
        const domList = this._DOMList;
        const domInput = this._DOMInput;
        if (domList && domInput) {
            if (isRerender) {
                domList.innerHTML = '';
            }
            const addFuncton = isRerender
                ? (el) => domList.appendChild(el)
                : (el) => domList.insertBefore(el, domInput);

            emails.forEach(({displayedValue, isValid}, index) => {
                const p = this._createListItem(displayedValue, isValid, index);
                addFuncton(p);
            });
            if (isRerender) {
                domList.appendChild(domInput);
            }
        }
    };

    public emailWasAdded = (func?: Function) => {
        if (func) {
            this.eventBus.on(EmailForm.EVENTS.MAIL_WASA, func);
        }
    };

    public emailWasRemoved = (func?: Function) => {
        if (func) {
            this.eventBus.on(EmailForm.EVENTS.MAIL_WASR, func);
        }
    };

    /**
     *
     * @description Fills the form with new elements.
     */
    public setNewList = (records: Email[]) => {
        const recordsList = this._processRecords(records);
        this._setNewList(recordsList, true);
    };

    /**
     * @description Return only valud records count.
     */
    public getValidRecordsCount = () => {
        return this._getRecordsList().reduce((acc, record) => (acc += Number(record.isValid)), 0);
    };

    /**
     *
     * @description Lets you add a record to the form.
     */
    public addEmail = (value: string) => {
        this._addEmail(value);
    };

    /**
     * @description Returns the number of records in the form.
     */
    public getRecordsCount = () => {
        return this._getRecordsList().length;
    };

    /**
     * @description Cleans the form completely.
     */
    public clearAll = () => {
        this._setNewList([], true);
        this.eventBus.emit(EmailForm.EVENTS.MAIL_WASR, []);
    };

    /**
     * @description returns only valid records.
     */
    public getValidEmails = () => {
        this._getRecordsList().filter((record) => record.isValid);
    };

    /**
     * @description Returns all records.
     */
    public getAllRecords = () => {
        this._getRecordsList();
    };
}
