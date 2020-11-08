import {TagForm} from './tag-form';

let form: TagForm;

describe('EmailForm', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div>' + '  <div id="form" />' + '</div>';
        form = new TagForm(document.querySelector('#form') as HTMLElement);
    });

    test('Should add records', () => {
        ['aaa', 'aaa', 'aaa', 'aaa', 'aaa', 'aaa'].forEach((val) => form.addRecord(val));
        expect(form.getRecordsCount()).toEqual(6);
    });

    test('Should return only valid emails count', () => {
        form.addRecord('asdasd');
        form.addRecord('asdasd@asdsd.ru');
        expect(form.getValidRecordsCount()).toEqual(1);
    });

    test('Should clear all emails', () => {
        ['aaa', 'aaa', 'aaa', 'aaa', 'aaa', 'aaa'].forEach((val) => form.addRecord(val));
        form.clearAll();
        expect(form.getRecordsCount()).toEqual(0);
    });

    test('Should emit on record add', () => {
        const callback = jest.fn();
        form.recordWasAdded(callback);
        form.addRecord('asdasd');
        expect(callback).toHaveBeenCalled();
    });

    test('Should emit on record remove', () => {
        const callback = jest.fn();
        form.recordWasRemoved(callback);
        form.addRecord('asdasd');
        form.clearAll();
        expect(callback).toHaveBeenCalled();
    });

    test('Should return only valid records ', () => {
        ['aaa', 'aaa', 'aaa', 'aaa', 'aaa', 'aaa@asdas.ru', 'asd@asdad.com'].forEach((val) => form.addRecord(val));
        expect(form.getValidRecords().length).toEqual(2);
    });

    test('Should return only valid records ', () => {
        ['aaa', 'aaa', 'aaa', 'aaa', 'aaa', 'aaa@asdas.ru', 'asd@asdad.com', 'test', 'test2'].forEach((val) =>
            form.addRecord(val),
        );
        expect(form.getAllRecords().length).toEqual(9);
    });
});
