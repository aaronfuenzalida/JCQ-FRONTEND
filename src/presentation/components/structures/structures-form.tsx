"use client";

import { useEffect, useState } from "react";
import { Button, TextInput, NumberInput, Select, Group, Stack, Box, LoadingOverlay } from "@mantine/core";
import { structuresApi } from "@/src/infrastructure/api/structures.api"; 
import type { Structure, CreateStructureDto } from "@/src/core/entities/structure-entity"; 

export interface StructureFormProps {
  initialData?: Structure | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const StructureForm = ({ initialData, onClose, onSuccess }: StructureFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<CreateStructureDto>({
    name: "",
    category: "CATEGORY_A", 
    measure: "",
    stock: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        category: initialData.category || "CATEGORY_A",
        measure: initialData.measure || "",
        stock: initialData.stock || 0,
      });
    } else {
      setFormData({
        name: "",
        category: "CATEGORY_A",
        measure: "",
        stock: 0,
      });
    }
  }, [initialData]);

  const handleChangeText = (field: keyof CreateStructureDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeNumber = (field: keyof CreateStructureDto, value: number | string) => {
    setFormData((prev) => ({ ...prev, [field]: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (initialData) {
        await structuresApi.update(initialData.id, formData);
      } else {
        await structuresApi.create(formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error guardando estructura:", error);
      alert("Error al guardar. Revisa la consola.");
    } finally {
      setIsLoading(false);
    }
  };

  const commonInputStyles = {
    input: { backgroundColor: "#0f0f0f", borderColor: "#2d2d2d", color: "white" },
    label: { color: "#9ca3af" },
    dropdown: { backgroundColor: "#0f0f0f", borderColor: "#2d2d2d", color: "white" },
    option: { hover: { backgroundColor: "#2d2d2d" } } 
  };

  return (
    <Box component="form" onSubmit={handleSubmit} pos="relative">
      <LoadingOverlay visible={isLoading} overlayProps={{ radius: "sm", blur: 2 }} />
      
      <Stack gap="md">
        <TextInput
          label="Nombre de la Estructura"
          placeholder="Ej: Andamio X"
          required
          value={formData.name}
          onChange={(e) => handleChangeText("name", e.target.value)}
          styles={commonInputStyles}
        />

        <Group grow>
          <TextInput
            label="Medidas (Opcional)"
            placeholder="Ej: 3x3 mts"
            value={formData.measure || ""}
            onChange={(e) => handleChangeText("measure", e.target.value)}
            styles={commonInputStyles}
          />

          <NumberInput
            label="Stock"
            placeholder="0"
            required
            min={0}
            allowNegative={false}
            value={formData.stock}
            onChange={(val) => handleChangeNumber("stock", val)}
            styles={commonInputStyles}
          />
        </Group>

        <Select
          label="Categoría"
          placeholder="Selecciona una categoría"
          required
          data={[
            { value: "CATEGORY_A", label: "Categoría A" },
            { value: "CATEGORY_B", label: "Categoría B" },
            { value: "CATEGORY_C", label: "Categoría C" },
          ]}
          value={formData.category}
          onChange={(val) => handleChangeText("category", val || "CATEGORY_A")}
          styles={commonInputStyles}
          checkIconPosition="right"
          comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} styles={{ root: { backgroundColor: "transparent", borderColor: "#2d2d2d", color: "white" } }}>
            Cancelar
          </Button>
          <Button type="submit" color="orange" loading={isLoading}>
            {initialData ? "Guardar Cambios" : "Crear Estructura"}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};