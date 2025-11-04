import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Paid, Client } from "@/src/core/entities";
import { formatARS } from "./format-currency";

interface PaymentReceiptData {
  paid: Paid;
  client: Client;
  projectName?: string;
}

/**
 * Genera un PDF de comprobante de pago
 */
export function generatePaymentReceipt(data: PaymentReceiptData): void {
  const { paid, client, projectName } = data;

  // Crear documento PDF A4
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colores de marca
  const orangeColor = "#ff6b35";
  const blackColor = "#1a1a1a";
  const grayColor = "#6b7280";

  // --- MARCA DE AGUA ---
  doc.saveGraphicsState();
  // @ts-ignore - jsPDF types issue with GState
  doc.setGState(new doc.GState({ opacity: 0.1 }));
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(60);
  doc.setFont("helvetica", "bold");

  // Rotar y centrar la marca de agua
  const watermarkText = "JCQ";
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;

  doc.text(watermarkText, centerX, centerY, {
    align: "center",
    angle: 45,
  });

  // Segunda línea de marca de agua
  doc.setFontSize(40);
  const watermarkText2 = "ANDAMIOS";
  doc.text(watermarkText2, centerX, centerY + 20, {
    align: "center",
    angle: 45,
  });

  doc.restoreGraphicsState();

  // --- ENCABEZADO ---
  // Logo simulado (cuadrado con color naranja)
  doc.setFillColor(orangeColor);
  doc.rect(20, 15, 15, 15, "F");

  // Marca JCQ ANDAMIOS
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(orangeColor);
  doc.text("JCQ", 38, 22);

  doc.setFontSize(10);
  doc.setTextColor(grayColor);
  doc.text("ANDAMIOS", 38, 27);

  // Título COMPROBANTE DE PAGO
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(blackColor);
  doc.text("COMPROBANTE DE PAGO", pageWidth / 2, 45, { align: "center" });

  // Línea separadora
  doc.setDrawColor(orangeColor);
  doc.setLineWidth(0.5);
  doc.line(20, 50, pageWidth - 20, 50);

  // --- INFORMACIÓN DEL COMPROBANTE ---
  let yPos = 60;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(grayColor);

  // Número de comprobante
  doc.text("Comprobante N°:", 20, yPos);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(blackColor);
  doc.text(paid.id.toString(), 60, yPos);

  yPos += 7;

  // Fecha de emisión
  doc.setFont("helvetica", "normal");
  doc.setTextColor(grayColor);
  doc.text("Fecha de Emisión:", 20, yPos);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(blackColor);
  const emissionDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", {
    locale: es,
  });
  doc.text(emissionDate, 60, yPos);

  yPos += 7;

  // Fecha del pago
  doc.setFont("helvetica", "normal");
  doc.setTextColor(grayColor);
  doc.text("Fecha de Pago:", 20, yPos);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(blackColor);
  const paymentDate = format(new Date(paid.date), "dd 'de' MMMM 'de' yyyy", {
    locale: es,
  });
  doc.text(paymentDate, 60, yPos);

  yPos += 15;

  // --- DATOS DEL CLIENTE ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(orangeColor);
  doc.text("DATOS DEL CLIENTE", 20, yPos);

  yPos += 8;

  // Cuadro de información del cliente
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(20, yPos - 3, pageWidth - 40, 35, 2, 2, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(grayColor);

  doc.text("Nombre/Razón Social:", 25, yPos + 3);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(blackColor);
  doc.text(client.fullname, 70, yPos + 3);

  yPos += 7;

  if (client.cuit) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayColor);
    doc.text("CUIT:", 25, yPos + 3);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(blackColor);
    doc.text(client.cuit, 70, yPos + 3);
    yPos += 7;
  }

  if (client.dni) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayColor);
    doc.text("DNI:", 25, yPos + 3);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(blackColor);
    doc.text(client.dni, 70, yPos + 3);
    yPos += 7;
  }

  if (client.phone) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayColor);
    doc.text("Teléfono:", 25, yPos + 3);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(blackColor);
    doc.text(client.phone, 70, yPos + 3);
  }

  yPos += 15;

  // --- DETALLE DEL PAGO ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(orangeColor);
  doc.text("DETALLE DEL PAGO", 20, yPos);

  yPos += 8;

  // Tabla de detalle
  autoTable(doc, {
    startY: yPos,
    margin: { left: 20, right: 20 },
    head: [["Concepto", "Valor"]],
    body: [
      ["Número de Factura", paid.bill || "N/A"],
      ["Monto Pagado", formatARS(paid.amount)],
      ["Fecha de Pago", paymentDate],
      ...(projectName ? [["Proyecto", projectName]] : []),
    ],
    theme: "plain",
    headStyles: {
      fillColor: orangeColor,
      textColor: "#ffffff",
      fontStyle: "bold",
      fontSize: 10,
      halign: "left",
    },
    bodyStyles: {
      textColor: blackColor,
      fontSize: 10,
    },
    alternateRowStyles: {
      fillColor: "#f9fafb",
    },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: "normal" },
      1: { cellWidth: "auto", fontStyle: "bold" },
    },
  });

  // Posición después de la tabla
  const finalY = (doc as any).lastAutoTable.finalY + 15;

  // --- MONTO TOTAL DESTACADO ---
  doc.setDrawColor(orangeColor);
  doc.setLineWidth(0.8);
  doc.setFillColor(255, 245, 240);
  doc.roundedRect(pageWidth - 90, finalY, 70, 20, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(grayColor);
  doc.text("TOTAL PAGADO:", pageWidth - 85, finalY + 8);

  doc.setFontSize(16);
  doc.setTextColor(orangeColor);
  doc.text(formatARS(paid.amount), pageWidth - 85, finalY + 16);

  // --- PIE DE PÁGINA ---
  const footerY = pageHeight - 30;

  // Línea separadora
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(20, footerY, pageWidth - 20, footerY);

  // Texto del pie
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(grayColor);
  doc.text(
    "Este comprobante es válido como constancia de pago.",
    pageWidth / 2,
    footerY + 7,
    { align: "center" }
  );

  doc.setFontSize(8);
  doc.text(
    "JCQ Andamios - Gestión de Proyectos de Construcción",
    pageWidth / 2,
    footerY + 12,
    { align: "center" }
  );

  doc.text(
    `Generado el ${format(new Date(), "dd/MM/yyyy 'a las' HH:mm")}`,
    pageWidth / 2,
    footerY + 17,
    { align: "center" }
  );

  // --- GUARDAR PDF ---
  // Limpiar nombre del cliente para usar en nombre de archivo
  const cleanClientName = client.fullname
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
    .replace(/[^a-zA-Z0-9\s]/g, "") // Quitar caracteres especiales
    .replace(/\s+/g, "_") // Reemplazar espacios con guión bajo
    .substring(0, 50); // Limitar longitud

  const timestamp = format(new Date(), "yyyyMMdd_HHmmss");
  const fileName = `Pago_${cleanClientName}_${timestamp}.pdf`;
  doc.save(fileName);
}
