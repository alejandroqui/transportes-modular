import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Plus, X, Calendar, Package } from 'lucide-react';

export function Transports() {
    const { transports, addTransport, deleteTransport, settings, formatMoney } = useApp();
    const [showForm, setShowForm] = useState(false);

    // New Transport Form State
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.weight) return;

        addTransport({
            date: formData.date,
            weight: Number(formData.weight),
            notes: formData.notes,
            pricePerKg: settings.pricePerKg // Store snapshot of price
        });

        // Reset form but keep date
        setFormData({ ...formData, weight: '', notes: '' });
        setShowForm(false);
    };

    // Sort by date desc
    const sortedTransports = useMemo(() => {
        return [...transports].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [transports]);

    return (
        <div className="page-transports">
            {/* Actions */}
            {!showForm && (
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={() => setShowForm(true)}>
                        <Plus size={20} style={{ marginRight: '8px' }} />
                        Nuevo Viaje
                    </Button>
                </div>
            )}

            {/* Form */}
            {showForm && (
                <Card style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Registrar Transporte</h3>
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
                        <Input
                            label="Peso (Kg)"
                            type="number"
                            step="0.1"
                            placeholder="0.0"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            fullWidth
                        />
                        <Input
                            label="Observaciones (Opcional)"
                            placeholder="Ej: Placa XYZ-123"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            fullWidth
                        />

                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                            <Button type="submit" fullWidth>Guardar</Button>
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)} fullWidth>Cancelar</Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* List */}
            <div className="transports-list">
                {sortedTransports.length === 0 ? (
                    <Card style={{ textAlign: 'center', opacity: 0.7 }}>
                        <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No hay transportes registrados.</p>
                    </Card>
                ) : (
                    sortedTransports.map(item => (
                        <Card key={item.id} style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <Calendar size={14} style={{ opacity: 0.5 }} />
                                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                            {new Date(item.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                                        {item.weight} Kg
                                    </div>
                                    {item.notes && <div style={{ fontSize: '0.875rem', marginTop: '0.25rem', opacity: 0.8 }}>{item.notes}</div>}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                                        {formatMoney(item.weight * item.pricePerKg)}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                        a {formatMoney(item.pricePerKg)}/kg
                                    </div>
                                    <button
                                        onClick={() => { if (confirm('¿Eliminar?')) deleteTransport(item.id) }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--color-danger)',
                                            fontSize: '0.75rem',
                                            marginTop: '0.5rem',
                                            cursor: 'pointer',
                                            opacity: 0.7
                                        }}
                                    >
                                        Eliminar
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
