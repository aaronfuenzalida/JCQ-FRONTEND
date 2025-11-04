/**
 * Formatea un número como moneda con separador de miles (.) y decimales (,)
 * Ejemplo: 1234567.89 -> "1.234.567,89"
 */
export function formatCurrency(amount: number | string, decimals: number = 2): string {
  // Convertir a número si es string
  const num = typeof amount === "string" ? parseFloat(amount) : amount;

  // Si no es un número válido, retornar 0,00
  if (isNaN(num)) {
    return "0" + (decimals > 0 ? "," + "0".repeat(decimals) : "");
  }

  // Separar en parte entera y decimal
  const [integerPart, decimalPart = ""] = num.toFixed(decimals).split(".");

  // Agregar separador de miles (.)
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Si no hay decimales, solo retornar la parte entera
  if (decimals === 0) {
    return formattedInteger;
  }

  // Retornar con decimales (,)
  return `${formattedInteger},${decimalPart}`;
}

/**
 * Parsea un string formateado como moneda a número
 * Ejemplo: "1.234.567,89" -> 1234567.89
 */
export function parseCurrency(formatted: string): number {
  if (!formatted) return 0;

  // Remover separadores de miles (.) y reemplazar coma decimal (,) por punto (.)
  const cleaned = formatted.replace(/\./g, "").replace(/,/g, ".");

  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Formatea un número como moneda argentina (ARS)
 * Ejemplo: 1234567.89 -> "$ 1.234.567,89"
 */
export function formatARS(amount: number | string, showSymbol: boolean = true): string {
  const formatted = formatCurrency(amount, 2);
  return showSymbol ? `$ ${formatted}` : formatted;
}

