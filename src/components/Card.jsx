import React from 'react';

export function Card({ children, className = '', ...props }) {
    return (
        <div className={`card ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ children }) {
    return <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{children}</h3>;
}
