"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  isLoading = false,
}: DeleteConfirmationModalProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const isValid = confirmationText.toLowerCase() === "eliminar";

  // Reset input when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setConfirmationText("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (isValid) {
      onConfirm();
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={title}
      centered
      size="md"
      styles={{
        content: {
          backgroundColor: "#1a1a1a",
        },
        header: {
          backgroundColor: "#1a1a1a",
          borderBottom: "1px solid #2d2d2d",
        },
        title: {
          color: "white",
          fontSize: "1.125rem",
          fontWeight: 600,
        },
        body: {
          padding: "1.5rem",
        },
      }}
    >
      <Stack gap="lg">
        {/* Warning Icon */}
        <Group justify="center">
          <div
            style={{
              backgroundColor: "#7f1d1d",
              borderRadius: "50%",
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={32} color="#ef4444" strokeWidth={2} />
          </div>
        </Group>

        {/* Message */}
        <Stack gap="xs">
          <Text size="sm" c="#e5e7eb" ta="center">
            {message}
          </Text>

          {itemName && (
            <Text size="sm" c="#f59e0b" fw={600} ta="center">
              {itemName}
            </Text>
          )}

          <Text size="xs" c="#9ca3af" ta="center" mt="xs">
            Esta acción no se puede deshacer.
          </Text>
        </Stack>

        {/* Confirmation Input */}
        <Stack gap="xs">
          <Text size="sm" c="#e5e7eb">
            Para confirmar, escribe <Text span c="#ef4444" fw={600}>eliminar</Text> a continuación:
          </Text>

          <TextInput
            placeholder="eliminar"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            disabled={isLoading}
            styles={{
              input: {
                backgroundColor: "#2d2d2d",
                borderColor: confirmationText && !isValid ? "#ef4444" : "#404040",
                color: "white",
              },
            }}
            error={confirmationText && !isValid ? "Debe escribir 'eliminar' exactamente" : undefined}
          />
        </Stack>

        {/* Actions */}
        <Group justify="flex-end" gap="sm" mt="md">
          <Button
            variant="subtle"
            color="gray"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            color="red"
            onClick={handleConfirm}
            loading={isLoading}
            disabled={!isValid}
            leftSection={<Trash2 size={16} />}
          >
            {confirmText}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

