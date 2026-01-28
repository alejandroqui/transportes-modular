import React from 'react';

export function Input({
    label,
    error,
    fullWidth = true,
    className = '',
    containerStyle = {},
    ...props
}) {
    const inputStyle = {
        width: fullWidth ? '100%' : 'auto',
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
        fontSize: '1rem',
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text-main)',
        boxSizing: 'border-box',
        outline: 'none',
    };

    return (
        <div style={{ marginBottom: '1rem', ...containerStyle }}>
            {label && (
                <label
                    style={{
                        display: 'block',
                        marginBottom: '0.25rem',
                        fontWeight: '500',
                        color: 'var(--color-text-main)'
                    }}
                >
                    {label}
                </label>
            )}
            <input
                style={inputStyle}
                className={className}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border)'}
                {...props}
            />
            {error && (
                <span style={{ color: 'var(--color-danger)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                    {error}
                </span>
            )}
        </div>
    );
}

export function Select({ label, options = [], fullWidth = true, ...props }) {
    const inputStyle = {
        width: fullWidth ? '100%' : 'auto',
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        fontSize: '1rem',
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text-main)',
        boxSizing: 'border-box',
        outline: 'none'
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && (
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                    {label}
                </label>
            )}
            <select style={inputStyle} {...props}>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    )
}
