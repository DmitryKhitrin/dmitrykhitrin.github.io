import {bemCn} from './bem-cn';

const cn = bemCn('test');

describe('bemCn', () => {
    test('Should glue classname', () => {
        const className = cn('second');
        expect(className).toEqual('test__second');
    });

    test('Should add modifier', () => {
        const className = cn({isEqual: true});
        expect(className).toEqual('test _is-equal');
    });
});
