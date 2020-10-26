"use strict";
const ENTER_KEY_CODE = 13;
const ENTER_BUTTON = 'Enter';
const EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
class EmailForm {
    constructor(root) {
        this.DOMList = null;
        this.DOMInput = null;
        this.root = null;
        this.emailsList = [];
        this.getEmailsList = () => {
            return this.emailsList;
        };
        this.removeAll = () => {
            this.emailsList = [];
        };
        this.setNewList = (emails) => {
            this.removeAll();
            this.emailsList = emails;
            this.render();
        };
        this.getMailObject = (text) => {
            return {
                text,
                isValid: EMAIL_REGEXP.test(text.toLowerCase()),
            };
        };
        this.addEmail = (email) => {
            if (email) {
                const emailsList = this.getEmailsList();
                const newEmail = Array.isArray(email)
                    ? email.map(this.getMailObject)
                    : [this.getMailObject(email)];
                this.setNewList([...emailsList, ...newEmail]);
            }
        };
        this.getEmailsCount = () => {
            return this.getEmailsList().length;
        };
        this.addRandomEmail = () => {
            this.addEmail('asds@asd.ru');
        };
        this.isEnterKey = ({ keyCode, key }) => {
            if (keyCode === ENTER_KEY_CODE || key === ENTER_BUTTON) {
                return true;
            }
            return false;
        };
        this.addKeyUpEvent = () => {
            const input = this.DOMInput;
            if (input) {
                input.addEventListener('keyup', (event) => {
                    const clearedValue = input.value.trim();
                    if (this.isEnterKey(event)) {
                        input.value = '';
                        const value = clearedValue.split(',');
                        this.addEmail(value);
                    }
                });
            }
        };
        this.onRemove = (index) => {
            const emailList = this.getEmailsList();
            const newEmailsList = emailList.filter((_, i) => i !== index);
            this.setNewList(newEmailsList);
        };
        this.render = () => {
            const domList = this.DOMList;
            if (domList) {
                domList.innerHTML = '';
                const emails = this.getEmailsList();
                emails.forEach(({ text, isValid }, index) => {
                    console.log(isValid);
                    const li = document.createElement('li');
                    li.innerHTML = ''.concat(text, ' <a>&times;</a>');
                    const cross = li.querySelector('a');
                    if (cross) {
                        cross.addEventListener('click', () => {
                            this.onRemove(index);
                            return false;
                        });
                    }
                    domList.appendChild(li);
                });
            }
        };
        this.root = root;
        root.classList.add('simple-tags');
        this.DOMList = document.createElement('ul');
        this.DOMInput = document.createElement('input');
        this.root.appendChild(this.DOMList);
        this.root.appendChild(this.DOMInput);
        this.addKeyUpEvent();
    }
}
// @ts-ignore
window.EmailForm = EmailForm;
