import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Select } from '../components/Input';
import { Plus, X, Wallet, Trash2 } from 'lucide-react';

export function Expenses() {
    const { expenses, addExpense, deleteExpense, formatMoney } = useApp();
    const [showForm, setShowForm] = useState(false);

    // New Expense Form State
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        type: 'Gasolina',
        description: '',
        amount: ''
    });

    const expenseTypes = [
        { value: 'Gasolina', label: 'Gasolina' },
        { value: 'Mecánico', label: 'Mantenimiento / Mecánico' },
        { value: 'Peajes', label: 'Peajes' },
        { value: 'Alimentación', label: 'Alimentación' },
        { value: 'Otros', label: 'Otros' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount) return;

        addExpense({
            date: formData.date,
            type: formData.type,
            description: formData.description,
            amount: Number(formData.amount)
        });

        setFormData({ ...formData, description: '', amount: '' });
        setShowForm(false);
    };

    const sortedExpenses = useMemo(() => {
        return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [expenses]);

    return (
        <div className="page-expenses">
            {!showForm && (
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={() => setShowForm(true)} variant="secondary">
                        <Plus size={20} style={{ marginRight: '8px' }} />
                        Nuevo Gasto
                    </Button>
                </div>
            )}

            {showForm && (
                <Card style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Registrar Gasto</h3>
                        <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X size={20} /></Button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Fecha"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            fullWidth
                        />
                        <Select
                            label="Tipo de Gasto"
                            options={expenseTypes}
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            fullWidth
                        />
                        <Input
                            label="Valor ($)"
                            type="number"
                            placeholder="0"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            fullWidth
                        />
                        <Input
                            label="Descripción (Opcional)"
                            placeholder="Detalles..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            fullWidth
                        />

                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                            <Button type="submit" fullWidth variant="secondary">Guardar</Button>
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)} fullWidth>Cancelar</Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* List */}
            <div className="expenses-list">
                {sortedExpenses.length === 0 ? (
                    <Card style={{ textAlign: 'center', opacity: 0.7 }}>
                        <Wallet size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No hay gastos registrados.</p>
                    </Card>
                ) : (
                    sortedExpenses.map(item => (
                        <Card key={item.id} style={{ padding: '1rem', borderLeft: '4px solid var(--color-secondary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                                        {new Date(item.date).toLocaleDateString()} • {item.type}
                                    </div>
                                    <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
                                        {item.description || item.type}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'var(--color-danger)', fontWeight: '600' }}>
                                        - {formatMoney(item.amount)}
                                    </div>
                                    <button
                                        onClick={() => { if (confirm('¿Eliminar?')) deleteExpense(item.id) }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--color-text-muted)',
                                            marginTop: '0.5rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
