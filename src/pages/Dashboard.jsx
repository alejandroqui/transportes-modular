import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

export function Dashboard() {
    const { transports, expenses, formatMoney } = useApp();
    const [filter, setFilter] = useState('month'); // day, week, month

    const filterLabel = {
        day: 'Hoy',
        week: 'Esta Semana',
        month: 'Este Mes'
    };

    const filteredData = useMemo(() => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let fromDate;
        if (filter === 'day') fromDate = startOfDay;
        else if (filter === 'week') fromDate = startOfWeek;
        else fromDate = startOfMonth;

        // Reset date to compare properly (ignore time components if stored as such, but we store YYYY-MM-DD string mostly so need parsing)
        // Actually we store YYYY-MM-DD strings. 
        // Let's rely on string comparison for simplistic "filtering" or parse.
        const fromTime = fromDate.getTime();

        const currentTransports = transports.filter(t => {
            const tDate = new Date(t.date + 'T00:00:00');
            return tDate.getTime() >= fromTime;
        });

        const currentExpenses = expenses.filter(e => {
            const eDate = new Date(e.date + 'T00:00:00');
            return eDate.getTime() >= fromTime;
        });

        return { trans: currentTransports, exp: currentExpenses };
    }, [filter, transports, expenses]);

    const stats = useMemo(() => {
        const income = filteredData.trans.reduce((sum, t) => sum + (t.weight * t.pricePerKg), 0);
        const expenseTotal = filteredData.exp.reduce((sum, e) => sum + e.amount, 0);
        const profit = income - expenseTotal;
        const kilos = filteredData.trans.reduce((sum, t) => sum + t.weight, 0);

        return { income, expenseTotal, profit, kilos };
    }, [filteredData]);

    return (
        <div className="page-dashboard">
            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {['day', 'week', 'month'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            border: 'none',
                            background: filter === f ? 'var(--color-primary)' : 'white',
                            color: filter === f ? 'white' : 'var(--color-text-muted)',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            boxShadow: 'var(--shadow-sm)',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {filterLabel[f]}
                    </button>
                ))}
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <SummaryCard
                    icon={<TrendingUp size={20} color="var(--color-success)" />}
                    label="Ingresos"
                    value={formatMoney(stats.income)}
                    subCheck={`${stats.kilos} Kg`}
                />
                <SummaryCard
                    icon={<TrendingDown size={20} color="var(--color-danger)" />}
                    label="Gastos"
                    value={formatMoney(stats.expenseTotal)}
                />
            </div>

            <Card style={{ background: 'linear-gradient(135deg, var(--color-text-main) 0%, #0f172a 100%)', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', opacity: 0.8 }}>
                    <DollarSign size={20} />
                    <span>Ganancia Neta</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {formatMoney(stats.profit)}
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.6, marginTop: '0.5rem' }}>
                    {filterLabel[filter]}
                </div>
            </Card>

            {/* Simple Visualization */}
            <Card>
                <h3>Balance</h3>
                <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        <span>Ingresos vs Gastos</span>
                        <span>{(stats.expenseTotal / (stats.income || 1) * 100).toFixed(0)}%</span>
                    </div>
                    <div style={{ height: '10px', background: '#F1F5F9', borderRadius: '5px', overflow: 'hidden', display: 'flex' }}>
                        <div style={{ width: '100%', background: 'var(--color-success)', flex: 1 }}></div>
                        {stats.income > 0 && (
                            <div style={{
                                width: `${Math.min((stats.expenseTotal / stats.income) * 100, 100)}%`,
                                background: 'var(--color-danger)',
                                marginLeft: '-100%' // Overlay approach or flex ratio
                            }}></div>
                        )}
                        {/* Better Bar: Two segments if we want ratio. Or simply one bar for income and one for expense. */}
                    </div>
                    {/* Correction: Stacked or Comparative? Let's do two bars */}

                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
                                <span>Ingresos</span>
                            </div>
                            <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: '100%', height: '100%', background: 'var(--color-success)' }}></div>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
                                <span>Gastos ({stats.income > 0 ? ((stats.expenseTotal / stats.income) * 100).toFixed(1) : 0}%)</span>
                            </div>
                            <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min((stats.expenseTotal / (stats.income || 1)) * 100, 100)}%`, height: '100%', background: 'var(--color-danger)' }}></div>
                            </div>
                        </div>
                    </div>

                </div>
            </Card>

            {/* Recent Activity Hint */}
            <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Accesos Rápidos</h4>
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                    <Card style={{ minWidth: '120px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 0 }} onClick={() => window.location.href = '/transports'}>
                        <Calendar size={24} style={{ marginBottom: '0.5rem', opacity: 0.7 }} />
                        <span style={{ fontSize: '0.875rem' }}>Ver Viajes</span>
                    </Card>
                    {/* Could add more stats here */}
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ icon, label, value, subCheck }) {
    return (
        <Card style={{ padding: '1rem', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'var(--color-background)' }}>
                    {icon}
                </div>
            </div>
            <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{label}</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{value}</div>
                {subCheck && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{subCheck}</div>}
            </div>
        </Card>
    );
}
