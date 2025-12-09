// src/presentation/components/staff/hours-form.tsx
"use client"; // Importante por los hooks

import React, { useState, useEffect } from 'react';
// Aquí puedes importar tus componentes de UI existentes si quieres (Button, Input, etc)
// import { Button } from '@/presentation/components/ui/button';
// import { Input } from '@/presentation/components/ui/input';

interface FormData {
  date: string;
  project: string;
  hours: string | number;
  description: string;
}

interface HoursFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  initialData?: FormData | null;
}

const HoursForm = ({ onSubmit, onCancel, initialData = null }: HoursFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split('T')[0],
    project: '',
    hours: '',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Nota: He mantenido clases de Tailwind estándar.
  // Si usas tus componentes UI (Button, Input), reemplaza los elementos <input> y <button> aquí.
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
        <input
          type="date"
          required
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
        <select
          required
          value={formData.project}
          onChange={(e) => setFormData({...formData, project: e.target.value})}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Selecciona un proyecto</option>
          <option value="Web App MVP">Web App MVP</option>
          <option value="Marketing">Marketing</option>
          <option value="Internal">Gestión Interna</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Horas Trabajadas</label>
        <input
          type="number"
          step="0.5"
          min="0.5"
          max="24"
          required
          value={formData.hours}
          onChange={(e) => setFormData({...formData, hours: parseFloat(e.target.value) || ''})}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: 4.5"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="¿Qué hiciste hoy?"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm"
        >
          {initialData ? 'Guardar Cambios' : 'Cargar Horas'}
        </button>
      </div>
    </form>
  );
};

export default HoursForm;