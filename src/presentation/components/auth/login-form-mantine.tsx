"use client";

import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Stack,
  Group,
  Alert,
} from "@mantine/core";
import { IconMail, IconLock } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/src/presentation/stores";

// Zod schema for login validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Debe ser un correo electrónico válido")
    .transform((val) => val.trim()),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .transform((val) => val.trim()),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginFormMantine() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Validate on change
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Watch form values to enable/disable button
  const email = watch("email");
  const password = watch("password");

  // Button should be disabled if fields are empty (after trim)
  const isButtonDisabled =
    !email?.trim() || !password?.trim() || !isValid || isLoading;

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      router.push("/dashboard");
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
        padding: "1.5rem",
      }}
    >
      <Container size={460} my={40}>
        <Paper
          withBorder
          shadow="xl"
          p={40}
          radius="lg"
          style={{
            backgroundColor: "#1a1a1a",
            borderColor: "#2d2d2d",
          }}
        >
          <Stack gap="lg">
            {/* Logo and Title */}
            <Group justify="center" gap="md" mb="xs">
              <Building2 size={48} color="#ff6b35" strokeWidth={2.5} />
              <div>
                <Title
                  order={1}
                  size="2rem"
                  c="#ff6b35"
                  style={{ lineHeight: 1 }}
                >
                  JCQ
                </Title>
                <Text
                  size="xs"
                  c="#9ca3af"
                  fw={500}
                  style={{ letterSpacing: "0.1em" }}
                >
                  ANDAMIOS
                </Text>
              </div>
            </Group>

            <div style={{ textAlign: "center" }}>
              <Title order={2} size="h3" mb="xs" c="white">
                Iniciar Sesión
              </Title>
              <Text size="sm" c="#9ca3af">
                Ingresa tus credenciales para acceder
              </Text>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="lg">
                {error && (
                  <Alert color="red" variant="light" title="Error">
                    {error}
                  </Alert>
                )}

                <TextInput
                  label="Correo Electrónico"
                  placeholder="correo@ejemplo.com"
                  {...register("email")}
                  error={errors.email?.message}
                  leftSection={<IconMail size={20} />}
                  size="md"
                  autoComplete="email"
                  styles={{
                    label: { color: "#e5e7eb", marginBottom: "0.5rem" },
                    input: {
                      backgroundColor: "#2d2d2d",
                      borderColor: errors.email ? "#fa5252" : "#404040",
                      color: "white",
                      height: "48px",
                    },
                  }}
                />

                <PasswordInput
                  label="Contraseña"
                  placeholder="••••••••"
                  {...register("password")}
                  error={errors.password?.message}
                  leftSection={<IconLock size={20} />}
                  size="md"
                  autoComplete="current-password"
                  styles={{
                    label: { color: "#e5e7eb", marginBottom: "0.5rem" },
                    input: {
                      backgroundColor: "#2d2d2d",
                      borderColor: errors.password ? "#fa5252" : "#404040",
                      color: "white",
                      height: "48px",
                    },
                    innerInput: { color: "white" },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  size="md"
                  loading={isLoading}
                  disabled={isButtonDisabled}
                  mt="sm"
                  style={{ height: "48px" }}
                  color="orange"
                >
                  Ingresar
                </Button>
              </Stack>
            </form>

            <Text
              size="xs"
              c="#6b7280"
              ta="center"
              pt="md"
              style={{ borderTop: "1px solid #2d2d2d" }}
            >
              © 2025 JCQ Andamios. Todos los derechos reservados.
            </Text>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}
