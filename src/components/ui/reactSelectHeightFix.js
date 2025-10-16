// sharedStyles.ts
export const reactSelectHeightFix = {
    control: (provided) => ({
        ...provided,
        minHeight: '41px', // match Flowbite TextInput default height
        borderRadius: '8px', // optional: match TextInput corners
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: '0 8px', // adjust text vertical alignment
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        padding: 0,
    }),
    singleValue: (provided) => ({
        ...provided,
        lineHeight: '41px', // vertically center text
    }),
};
