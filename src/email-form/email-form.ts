import {bemCn} from '../helpers/bem-cn';
import {EventBus} from '../helpers/event-bus';

const ENTER_KEY_CODE = 13;
const ENTER_BUTTON = 'Enter';
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

    private DOMList: HTMLElement | null = null;
    private DOMInput: HTMLInputElement | null = null;
    private root: HTMLElement | null = null;
    private emailsList: Email[] = [];
    private settings: Settings = {maxLenght: MAX_LENGTH};
    eventBus: EventBus;

    constructor(root: HTMLElement, settings?: Settings) {
        this.root = root;
        root.classList.add(cn());
        this.DOMList = document.createElement('div');
        this.DOMList.classList.add(cn('emails-list'));
        this.DOMInput = document.createElement('input');
        this.DOMInput.placeholder = 'add more people…';
        this.root.appendChild(this.DOMList);
        this.DOMList.appendChild(this.DOMInput);
        this.settings = {
            ...this.settings,
            ...settings,
        };
        this.eventBus = new EventBus();
        this.addEvents();
    }
    private getEmailsList = () => {
        return this.emailsList;
    };

    public setNewList = (emails: Email[]) => {
        this.emailsList = emails;
        this.render();
    };

    private getMailObject = (text: string): Email => {
        const displayedValue = text.length <= this.settings.maxLenght ? text : `${text.slice(0, 47)}...`;
        return {
            value: text,
            displayedValue,
            isValid: EMAIL_REGEXP.test(text.toLowerCase()),
        };
    };

    private addEmail = (email?: string | string[]) => {
        if (email) {
            const emailsList = this.getEmailsList();
            const newEmail = Array.isArray(email) ? email.map(this.getMailObject) : [this.getMailObject(email)];
            this.setNewList([...emailsList, ...newEmail]);
            this.eventBus.emit(EmailForm.EVENTS.MAIL_WASA);
        }
    };

    public getEmailsCount = () => {
        return this.getEmailsList().length;
    };

    public addRandomEmail = () => {
        this.addEmail('asds@asd.ru');
    };

    private isEnterKey = ({keyCode, key}: KeyboardEvent) => {
        if (keyCode === ENTER_KEY_CODE || key === ENTER_BUTTON) {
            return true;
        }
        return false;
    };

    private addEvents = () => {
        const input = this.DOMInput;
        let isKeyEvent = false;

        if (input) {
            const setValuseFromEvent = () => {
                const clearedValue = input.value.trim();
                const values = clearedValue.split(',').filter((val) => val);
                input.value = '';
                this.addEmail(values);
            };

            input.addEventListener('keyup', (event) => {
                if (this.isEnterKey(event)) {
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

    private onRemove = (index: number) => {
        const emailList = this.getEmailsList();
        const newEmailsList = emailList.filter((_, i) => i !== index);
        this.setNewList(newEmailsList);
        this.eventBus.emit(EmailForm.EVENTS.MAIL_WASR);
    };

    private createListItem = (text: string, isValid: boolean, index: number) => {
        const p = document.createElement('p');
        p.className = cn('list-item', {isValid});
        p.innerHTML = ''.concat(text, ' <span class="_cross" >&times;</span>');
        const cross = p.querySelector('span');
        if (cross) {
            cross.addEventListener('click', () => {
                this.onRemove(index);
                return false;
            });
        }
        return p;
    };

    private render = () => {
        const domList = this.DOMList;
        const domInput = this.DOMInput;
        if (domList && domInput) {
            domList.innerHTML = '';
            const emails = this.getEmailsList();
            emails.forEach(({displayedValue, isValid}, index) => {
                const p = this.createListItem(displayedValue, isValid, index);
                domList.appendChild(p);
            });
            domList.appendChild(domInput);
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
}
