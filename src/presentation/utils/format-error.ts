import type { ApiError } from "@/src/core/entities";

/**
 * Formatea el mensaje de error de la API para mostrarlo al usuario
 *
 * @param error - Error de la API o cualquier otro error
 * @returns Mensaje de error formateado para mostrar al usuario
 */
export function formatErrorMessage(error: unknown): string {
  // Si es un ApiError
  if (isApiError(error)) {
    // Si message es un array, unir con saltos de línea
    if (Array.isArray(error.message)) {
      return error.message.join("\n");
    }

    // Si es un string, devolverlo directamente
    return error.message;
  }

  // Si es un Error estándar
  if (error instanceof Error) {
    return error.message;
  }

  // Si es un objeto con message
  if (typeof error === "object" && error !== null && "message" in error) {
    const msg = (error as { message: unknown }).message;
    if (typeof msg === "string") {
      return msg;
    }
    if (Array.isArray(msg)) {
      return msg.join("\n");
    }
  }

  // Fallback: convertir a string
  return String(error) || "Error desconocido";
}

/**
 * Verifica si un objeto es un ApiError
 */
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "success" in error &&
    "statusCode" in error &&
    "message" in error &&
    error.success === false
  );
}

/**
 * Obtiene el código de error de la API si está disponible
 */
export function getErrorCode(error: unknown): string | undefined {
  if (isApiError(error)) {
    return error.code;
  }
  return undefined;
}

/**
 * Obtiene el status code del error
 */
export function getErrorStatusCode(error: unknown): number | undefined {
  if (isApiError(error)) {
    return error.statusCode;
  }
  return undefined;
}
