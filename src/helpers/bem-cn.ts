const camelToKebabMap: Record<string, string> = {};

for (let i = 65; i < 91; i++) {
    const upperCaseChar = String.fromCharCode(i);

    camelToKebabMap[upperCaseChar] = `-${upperCaseChar.toLowerCase()}`;
}

const convertCamelCaseToKebabCase = (string: string): string => {
    const {length} = string;

    let result = '';

    for (let i = 0; i < length; i++) {
        const char = string[i];

        result += camelToKebabMap[char] || char;
    }

    return result;
};

type State = {
    [key: string]: boolean | string | number | null | undefined;
};

export const bemCn = (blockName: string) => (elemNameOrState?: string | State, onlyState?: State): string => {
    const [elemName, state] =
        typeof elemNameOrState === 'string' ? [elemNameOrState, onlyState] : [null, elemNameOrState];

    let className = blockName;

    if (elemName) {
        className += `__${elemName}`;
    }
    if (state) {
        Object.keys(state).forEach((key) => {
            const value = state[key];
            console.log(value);
            const convertedKey = convertCamelCaseToKebabCase(key);

            if (value === true) {
                className += ` _${convertedKey}`;
            } else if (value === 0 || value) {
                className += ` _${convertedKey}_${value}`;
            }
        });
    }
    return className;
};

export const mix = (...classNames: Array<string | null | undefined>): string => classNames.filter(Boolean).join(' ');

bemCn.mix = mix;
