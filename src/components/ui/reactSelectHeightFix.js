// sharedStyles.ts
export const reactSelectHeightFix = {
    control: (provided, state) => ({
        ...provided,
        minHeight: '41px',
        borderRadius: '0.5rem',
        borderWidth: '1px',
        borderColor: state.isFocused ? '#3B82F6' : '#D1D5DB',
        backgroundColor: state.selectProps.isDark ? '#374151' : '#F9FAFB',
        boxShadow: state.isFocused ? '0 0 0 2px rgba(59,130,246,0.3)' : 'none',
        color: state.selectProps.isDark ? '#FFFFFF' : '#111827',
        fontSize: '0.875rem',
        '&:hover': {
            borderColor: '#3B82F6',
        },
    }),

    valueContainer: (provided) => ({
        ...provided,
        padding: '2px 10px',
    }),

    input: (provided, state) => ({
        ...provided,
        color: state.selectProps.isDark ? '#FFFFFF' : '#111827',
    }),

    indicatorsContainer: (provided) => ({
        ...provided,
        padding: '0 4px',
        color: '#6B7280',
    }),

    singleValue: (provided, state) => ({
        ...provided,
        color: state.selectProps.isDark ? '#FFFFFF' : '#111827',
    }),

    placeholder: (provided, state) => ({
        ...provided,
        color: state.selectProps.isDark ? '#9CA3AF' : '#6B7280',
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
            ? '#3B82F6'
            : state.isFocused
                ? state.selectProps.isDark ? '#4B5563' : '#E5E7EB'
                : 'transparent',
        color: state.isSelected
            ? '#FFFFFF'
            : state.selectProps.isDark
                ? '#FFFFFF'
                : '#111827',
        cursor: 'pointer',
        padding: '8px 12px',
        fontSize: '0.875rem',
    }),
};
