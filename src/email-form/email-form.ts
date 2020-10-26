const ENTER_KEY_CODE = 13;
const ENTER_BUTTON = 'Enter';
const EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

type Email = {
    text: string;
    isValid: boolean;
};

class EmailForm {
    private DOMList: HTMLUListElement | null = null;
    private DOMInput: HTMLInputElement | null = null;
    private root: HTMLElement | null = null;
    private emailsList: Email[] = [];

    constructor(root: HTMLElement) {
        this.root = root;
        root.classList.add('simple-tags');
        this.DOMList = document.createElement('ul');
        this.DOMInput = document.createElement('input');
        this.root.appendChild(this.DOMList);
        this.root.appendChild(this.DOMInput);
        this.addKeyUpEvent();
    }
    private getEmailsList = () => {
        return this.emailsList;
    };

    private removeAll = () => {
        this.emailsList = [];
    };

    private setNewList = (emails: Email[]) => {
        this.removeAll();
        this.emailsList = emails;
        this.render();
    };

    private getMailObject = (text: string): Email => {
        return {
            text,
            isValid: EMAIL_REGEXP.test(text.toLowerCase()),
        };
    };

    private addEmail = (email?: string | string[]) => {
        if (email) {
            const emailsList = this.getEmailsList();
            const newEmail = Array.isArray(email)
                ? email.map(this.getMailObject)
                : [this.getMailObject(email)];
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

    private addKeyUpEvent = () => {
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

    private onRemove = (index: number) => {
        const emailList = this.getEmailsList();
        const newEmailsList = emailList.filter((_, i) => i !== index);
        this.setNewList(newEmailsList);
    };

    private render = () => {
        const domList = this.DOMList;
        if (domList) {
            domList.innerHTML = '';
            const emails = this.getEmailsList();
            emails.forEach(({text, isValid}, index) => {
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
}

// @ts-ignore
window.EmailForm = EmailForm;
