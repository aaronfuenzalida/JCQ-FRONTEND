import React, { useState } from 'react';
import { useForm } from 'react-hook-form'; 
import { Input } from '@/src/presentation/components/ui/input';
import { Button } from '@/src/presentation/components/ui/button';

interface HoursFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function HoursForm({ onSubmit, onCancel, isLoading }: HoursFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // Default= Fecha de hoy
      hours: 0,
      advance: 0, // Campo de adelanto
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Fecha */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Fecha</label>
          <Input 
            type="date" 
            {...register('date', { required: 'La fecha es requerida' })} 
          />
          {errors.date && <p className="text-xs text-red-500">{errors.date.message as string}</p>}
        </div>

        {/* Horas */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Horas Trabajadas</label>
          <Input 
            type="number" 
            step="0.5"
            {...register('hours', { required: 'Las horas son requeridas', min: 0 })} 
          />
        </div>
      </div>

      {/* Adelanto */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Adelanto ($)</label>
        <Input 
          type="number" 
          step="0.01"
          placeholder="0.00"
          {...register('advance')} 
        />
        <p className="text-xs text-gray-500">
          Monto entregado por adelantado. Se restará del total a pagar.
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Registrar Horas'}
        </Button>
      </div>
    </form>
  );
}