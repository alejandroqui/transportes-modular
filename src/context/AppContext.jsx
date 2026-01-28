import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext();

export function AppProvider({ children }) {
    // Settings
    const [settings, setSettings] = useLocalStorage('cargo_settings', {
        pricePerKg: 450,
        currencySymbol: '$',
        currencyLocale: 'es-CO' // Colombia
    });

    // Data Lists
    const [transports, setTransports] = useLocalStorage('cargo_transports', []);
    const [expenses, setExpenses] = useLocalStorage('cargo_expenses', []);

    // CRUD Actions
    const addTransport = (transport) => {
        const newTransport = {
            ...transport,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString()
        };
        setTransports((prev) => [newTransport, ...prev]);
    };

    const updateTransport = (id, updatedData) => {
        setTransports((prev) =>
            prev.map(item => item.id === id ? { ...item, ...updatedData } : item)
        );
    };

    const deleteTransport = (id) => {
        setTransports((prev) => prev.filter(item => item.id !== id));
    };

    const addExpense = (expense) => {
        const newExpense = {
            ...expense,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString()
        };
        setExpenses((prev) => [newExpense, ...prev]);
    };

    const deleteExpense = (id) => {
        setExpenses((prev) => prev.filter(item => item.id !== id));
    };

    // Helper: Format Money
    const formatMoney = (amount) => {
        return new Intl.NumberFormat(settings.currencyLocale, {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const value = useMemo(() => ({
        settings,
        setSettings,
        transports,
        expenses,
        addTransport,
        updateTransport,
        deleteTransport,
        addExpense,
        deleteExpense,
        formatMoney
    }), [settings, transports, expenses]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
