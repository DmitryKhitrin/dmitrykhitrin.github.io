export const isDOM = (el: HTMLElement | any): boolean => {
    if (el instanceof HTMLElement) {
        return true;
    }
    return false;
};
