import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, Truck, Wallet, Settings } from 'lucide-react';

export function Layout() {
    const location = useLocation();

    const getPageTitle = (pathname) => {
        switch (pathname) {
            case '/': return 'Resumen';
            case '/transports': return 'Transportes';
            case '/expenses': return 'Gastos';
            case '/settings': return 'Configuración';
            default: return 'Cargo Tracker';
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '90px' }}> {/* Extra padding for bottom nav */}
            <header className="header-hero">
                <h1>{getPageTitle(location.pathname)}</h1>
                <p style={{ margin: 0, opacity: 0.8 }}>Control de carga y finanzas</p>
            </header>

            <main className="main-content">
                <Outlet />
            </main>

            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'var(--color-surface)',
                borderTop: '1px solid var(--color-border)',
                padding: '0.5rem 0', // Reduced padding so it's not too tall, but safe area needed
                paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
                zIndex: 100,
                boxShadow: '0 -4px 6px -1px rgb(0 0 0 / 0.05)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    <NavItem to="/" icon={<Home size={24} />} label="Inicio" />
                    <NavItem to="/transports" icon={<Truck size={24} />} label="Viajes" />
                    <NavItem to="/expenses" icon={<Wallet size={24} />} label="Gastos" />
                    <NavItem to="/settings" icon={<Settings size={24} />} label="Ajustes" />
                </div>
            </nav>
        </div>
    );
}

function NavItem({ to, icon, label }) {
    return (
        <NavLink
            to={to}
            style={({ isActive }) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontSize: '0.75rem',
                fontWeight: isActive ? 600 : 400,
                padding: '0.5rem',
                transition: 'color 0.2s'
            })}
        >
            <div style={{ marginBottom: '4px' }}>{icon}</div>
            <span>{label}</span>
        </NavLink>
    );
}
