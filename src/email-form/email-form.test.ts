import {EmailForm} from './email-form';

let form: EmailForm;

describe('EmailForm', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div>' + '  <div id="form" />' + '</div>';
        form = new EmailForm(document.querySelector('#form') as HTMLElement);
    });

    test('Should add records', () => {
        ['aaa', 'aaa', 'aaa', 'aaa', 'aaa', 'aaa'].forEach((val) => form.addEmail(val));
        expect(form.getRecordsCount()).toEqual(6);
    });

    test('Should return only valid emails count', () => {
        form.addEmail('asdasd');
        form.addEmail('asdasd@asdsd.ru');
        expect(form.getValidRecordsCount()).toEqual(1);
    });

    test('Should clear all emails', () => {
        ['aaa', 'aaa', 'aaa', 'aaa', 'aaa', 'aaa'].forEach((val) => form.addEmail(val));
        form.clearAll();
        expect(form.getRecordsCount()).toEqual(0);
    });

    test('Should emit on record add', () => {
        const callback = jest.fn();
        form.emailWasAdded(callback);
        form.addEmail('asdasd');
        expect(callback).toHaveBeenCalled();
    });

    test('Should emit on record remove', () => {
        const callback = jest.fn();
        form.emailWasRemoved(callback);
        form.addEmail('asdasd');
        form.clearAll();
        expect(callback).toHaveBeenCalled();
    });
});
