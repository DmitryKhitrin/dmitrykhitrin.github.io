export const isDOM = (el) => {
    if (el instanceof HTMLElement) {
        return true;
    }
    return false;
};
