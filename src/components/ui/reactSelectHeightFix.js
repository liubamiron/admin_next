// sharedStyles.ts
export const reactSelectHeightFix = {
    control: (provided, state) => ({
        ...provided,
        minHeight: '41px',
        borderRadius: '0.5rem', // rounded-lg
        borderWidth: '1px',
        borderColor: state.isFocused ? '#3B82F6' : '#D1D5DB', // blue-500 / gray-300
        backgroundColor: state.selectProps.isDark ? '#374151' : '#F9FAFB', // dark:bg-gray-700 / light:bg-gray-50
        boxShadow: state.isFocused ? '0 0 0 2px rgba(59,130,246,0.3)' : 'none', // focus:ring
        color: state.selectProps.isDark ? '#FFFFFF' : '#111827',
        fontSize: '0.875rem', // text-sm
        '&:hover': {
            borderColor: '#3B82F6', // focus:border-blue-500 on hover
        },
    }),

    valueContainer: (provided) => ({
        ...provided,
        padding: '2px 10px', // p-2.5 horizontal padding
    }),

    input: (provided, state) => ({
        ...provided,
        color: state.selectProps.isDark ? '#FFFFFF' : '#111827',
    }),

    indicatorsContainer: (provided) => ({
        ...provided,
        padding: '0 4px',
        color: '#6B7280', // gray-500
    }),

    singleValue: (provided, state) => ({
        ...provided,
        color: state.selectProps.isDark ? '#FFFFFF' : '#111827',
    }),

    placeholder: (provided, state) => ({
        ...provided,
        color: state.selectProps.isDark ? '#9CA3AF' : '#6B7280', // gray-400 / gray-500
    }),

    menu: (provided, state) => ({
        ...provided,
        backgroundColor: state.selectProps.isDark ? '#374151' : '#FFFFFF',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 50,
    }),

    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? '#3B82F6' // blue-500
            : state.isFocused
                ? (state.selectProps.isDark ? '#4B5563' : '#E5E7EB') // gray-600 / gray-200
                : 'transparent',
        color: state.isSelected
            ? '#FFFFFF'
            : state.selectProps.isDark
                ? '#FFFFFF'
                : '#111827',
        cursor: 'pointer',
        fontSize: '0.875rem',
        padding: '8px 12px',
    }),
};
