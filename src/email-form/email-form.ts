import {bemCn} from '../helpers/bem-cn';

const ENTER_KEY_CODE = 13;
const ENTER_BUTTON = 'Enter';
const MAX_LENGTH = 50;
const EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

type Email = {
    value: string;
    isValid: boolean;
    displayedValue: string;
};

const cn = bemCn('email-form');
export class EmailForm {
    private DOMList: HTMLElement | null = null;
    private DOMInput: HTMLInputElement | null = null;
    private root: HTMLElement | null = null;
    private emailsList: Email[] = [];

    constructor(root: HTMLElement) {
        this.root = root;
        root.classList.add(cn());
        this.DOMList = document.createElement('div');
        this.DOMList.classList.add(cn('emails-list'));
        this.DOMInput = document.createElement('input');
        this.DOMInput.placeholder = 'add more people…';
        this.root.appendChild(this.DOMList);
        this.DOMList.appendChild(this.DOMInput);
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
        const displayedValue = text.length <= MAX_LENGTH ? text : text.slice(0, 50);
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

        if (input) {
            const setValuseFromEvent = () => {
                const clearedValue = input.value.trim();
                const values = clearedValue.split(',').filter((val) => val);
                input.value = '';
                this.addEmail(values);
                input.focus();
            };

            input.addEventListener('keyup', (event) => {
                event.preventDefault();
                if (this.isEnterKey(event)) {
                    setValuseFromEvent();
                }
            });

            // input.addEventListener('blur', (event) => {
            //     event.preventDefault();
            //     if (!isKeyEvent) {
            //         setValuseFromEvent();
            //     }
            //     isKeyEvent = false;
            // });
        }
    };

    private onRemove = (index: number) => {
        const emailList = this.getEmailsList();
        const newEmailsList = emailList.filter((_, i) => i !== index);
        this.setNewList(newEmailsList);
    };

    private render = () => {
        const domList = this.DOMList;
        const domInput = this.DOMInput;
        if (domList && domInput) {
            domList.innerHTML = '';
            const emails = this.getEmailsList();
            emails.forEach(({displayedValue, isValid}, index) => {
                console.log(isValid);
                const p = document.createElement('p');
                console.log(isValid);
                p.className = cn('list-item', {isValid});
                p.innerHTML = ''.concat(displayedValue, ' <span class="_cross" >&times;</span>');
                const cross = p.querySelector('span');
                if (cross) {
                    cross.addEventListener('click', () => {
                        this.onRemove(index);
                        return false;
                    });
                }
                domList.appendChild(p);
            });
            domList.appendChild(domInput);
            console.log(12);
        }
    };
}
