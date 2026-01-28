import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function Settings() {
    const { settings, setSettings } = useApp();
    const [form, setForm] = useState(settings);
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSettings(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="settings-page">
            <Card>
                <h2>Configuración General</h2>
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Valor por Kilogramo (COP)"
                        type="number"
                        value={form.pricePerKg}
                        onChange={(e) => setForm({ ...form, pricePerKg: Number(e.target.value) })}
                        fullWidth
                    />

                    <div style={{ marginTop: '1rem' }}>
                        <Button type="submit" variant="primary" fullWidth>
                            Guardar Cambios
                        </Button>
                    </div>

                    {saved && (
                        <p style={{ color: 'var(--color-success)', marginTop: '0.5rem', textAlign: 'center' }}>
                            ✓ Configuración guardada
                        </p>
                    )}
                </form>
            </Card>

            <Card>
                <h3>Datos de la Aplicación</h3>
                <p>Los datos se guardan localmente en este dispositivo.</p>
                <p style={{ fontSize: '0.875rem' }}>Versión 1.0.0</p>
            </Card>
        </div>
    );
}
