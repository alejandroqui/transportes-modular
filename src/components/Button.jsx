import React from 'react';

export function Button({
    children,
    variant = 'primary', // primary, secondary, outline, ghost, danger
    size = 'md', // sm, md, lg
    fullWidth = false,
    className = '',
    ...props
}) {
    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        fontWeight: '500',
        transition: 'var(--transition-fast)',
        border: '1px solid transparent',
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            borderColor: 'transparent',
        },
        secondary: {
            backgroundColor: 'var(--color-secondary)',
            color: 'white',
        },
        outline: {
            backgroundColor: 'transparent',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-main)',
        },
        danger: {
            backgroundColor: 'var(--color-danger)',
            color: 'white',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--color-primary)',
        }
    };

    const sizes = {
        sm: { padding: '0.25rem 0.75rem', fontSize: '0.875rem' },
        md: { padding: '0.5rem 1rem', fontSize: '1rem' },
        lg: { padding: '0.75rem 1.5rem', fontSize: '1.125rem' },
    };

    const style = {
        ...baseStyles,
        ...variants[variant],
        ...sizes[size],
        width: fullWidth ? '100%' : 'auto',
    };

    return (
        <button style={style} className={className} {...props}>
            {children}
        </button>
    );
}
