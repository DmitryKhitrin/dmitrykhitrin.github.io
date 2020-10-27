const ENTER_KEY_CODE = 13;
const ENTER_BUTTON = 'Enter';

export const isEnterKey = ({keyCode, key}: KeyboardEvent) => {
    if (keyCode === ENTER_KEY_CODE || key === ENTER_BUTTON) {
        return true;
    }
    return false;
};
