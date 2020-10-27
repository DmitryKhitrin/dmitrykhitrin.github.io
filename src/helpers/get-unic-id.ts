const generateUniqId = () => {
    let id = 0;
    return () => String(id++);
};

export const getUniqId = generateUniqId();
