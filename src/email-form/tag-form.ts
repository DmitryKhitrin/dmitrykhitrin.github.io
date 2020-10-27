import {bemCn} from '../helpers/bem-cn';
import {EventBus} from '../helpers/event-bus';
import {isEnterKey} from '../helpers/is-enter-key';
import {isDOM} from '../helpers/is-dom';
import {getUniqId} from '../helpers/get-unic-id';
import {escapeOutput} from '../helpers/prevent-xss';

const MAX_LENGTH = 50;

/**
 * @description Added email regexp as default. But the correct decision on default is to leave blank.
 */
const MAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

type Record = {
    value: string;
    isValid: boolean;
    displayedValue: string;
    id: string;
};

type Settings = {
    maxLenght: number;
    validationRegExp: RegExp;
};

const cn = bemCn('tag-form');
export class TagForm {
    static EVENTS = {
        MAIL_WASA: 'mail:was-add',
        MAIL_WASR: 'mail:was-removed',
    };

    private _DOMList: HTMLElement | null = null;
    private _DOMInput: HTMLInputElement | null = null;
    private _root: HTMLElement | null = null;
    private _recordsList: Record[] = [];
    private _settings: Settings = {maxLenght: MAX_LENGTH, validationRegExp: MAIL_REGEXP};
    eventBus: EventBus;

    constructor(root?: HTMLElement, _settings?: Settings) {
        if (root && isDOM(root)) {
            root.classList.add(cn());
            this._root = root;
            this._DOMList = document.createElement('div');
            this._DOMList.classList.add(cn('records-list'));
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

    private _replaceRecordsList = (recods: Record[]) => {
        this._recordsList = recods;
    };

    private _processRecords = (reocrds) => {
        return Array.isArray(reocrds) ? reocrds.map(this._createFormRecord) : [this._createFormRecord(reocrds)];
    };

    private _createFormRecord = (record: string | Record): Record => {
        if (typeof record !== 'object') {
            const text = escapeOutput(String(record));
            const displayedValue = text.length <= this._settings.maxLenght ? text : `${text.slice(0, 47)}...`;
            return {
                value: text,
                displayedValue,
                isValid: this._settings.validationRegExp.test(text.toLowerCase()),
                id: getUniqId(),
            };
        }
        return record;
    };

    private _addRecord = (records?: string | string[]) => {
        if (records) {
            const newRecord = this._processRecords(records);
            this._setNewList([...newRecord], false);
            this.eventBus.emit(TagForm.EVENTS.MAIL_WASA, newRecord);
        }
    };

    private _setNewList = (records: Record[], isRerender: boolean) => {
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
                this._addRecord(values);
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

    private _onRemove = (idForRemove: string, el: HTMLElement) => {
        const records = this._getRecordsList();
        try {
            const newList = records.filter(({id}) => id !== idForRemove);
            this._DOMList?.removeChild(el);
            this._replaceRecordsList(newList);
            this.eventBus.emit(TagForm.EVENTS.MAIL_WASR, newList);
        } catch (e) {
            throw new Error(e);
        }
    };

    private _createListItem = (text: string, isValid: boolean, id: string) => {
        const listItem = document.createElement('p');
        listItem.className = cn('list-item', {isValid});
        listItem.innerHTML = ''.concat(text, ' <span class="_cross" >&times;</span>');
        const cross = listItem.querySelector('span');
        if (cross) {
            cross.addEventListener('click', (e) => {
                // @ts-ignore
                this._onRemove(id, e.target.parentNode);
                return false;
            });
        }
        return listItem;
    };

    private _render = (Records: Record[], isRerender?: boolean) => {
        const domList = this._DOMList;
        const domInput = this._DOMInput;
        if (domList && domInput) {
            if (isRerender) {
                domList.innerHTML = '';
            }
            const addFuncton = isRerender
                ? (el) => domList.appendChild(el)
                : (el) => domList.insertBefore(el, domInput);

            Records.forEach(({displayedValue, isValid, id}) => {
                const p = this._createListItem(displayedValue, isValid, id);
                addFuncton(p);
            });
            if (isRerender) {
                domList.appendChild(domInput);
            }
        }
    };

    public recordWasAdded = (func?: Function) => {
        if (func) {
            this.eventBus.on(TagForm.EVENTS.MAIL_WASA, func);
        }
    };

    public recordWasRemoved = (func?: Function) => {
        if (func) {
            this.eventBus.on(TagForm.EVENTS.MAIL_WASR, func);
        }
    };

    /**
     *
     * @description Fills the form with new elements.
     */
    public setNewList = (records: Record[]) => {
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
    public addRecord = (value: string) => {
        this._addRecord(value);
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
        this.eventBus.emit(TagForm.EVENTS.MAIL_WASR, []);
    };

    /**
     * @description returns only valid records.
     */
    public getValidRecords = () => {
        this._getRecordsList().filter((record) => record.isValid);
    };

    /**
     * @description Returns all records.
     */
    public getAllRecords = () => {
        this._getRecordsList();
    };
}
