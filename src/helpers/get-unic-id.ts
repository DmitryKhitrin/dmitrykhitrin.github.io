/**
 * @description Possible improvements for this function, adding a unique hash for each instance of the form.
 */
const generateUniqId = () => {
    let id = 0;
    return () => String(id++);
};

export const getUniqId = generateUniqId();
