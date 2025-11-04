"use client";

import { Modal, Button, Group, Stack, Text } from "@mantine/core";
import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmColor = "orange",
  isLoading = false,
  icon,
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
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
        {icon && (
          <Group justify="center">
            {icon}
          </Group>
        )}

        <Text size="sm" c="#e5e7eb" ta="center">
          {message}
        </Text>

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
            color={confirmColor}
            onClick={handleConfirm}
            loading={isLoading}
          >
            {confirmText}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

