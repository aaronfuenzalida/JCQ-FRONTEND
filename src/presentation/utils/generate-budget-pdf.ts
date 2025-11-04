import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Project, Client } from "@/src/core/entities";
import { formatARS } from "./format-currency";

interface BudgetPDFData {
  project: Project;
  client: Client;
  budgetNumber: string;
  items?: Array<{
    quantity: number;
    description: string;
    presentation: string;
    unitPrice: number;
    subtotal: number;
  }>;
  notes?: string;
  validityDays?: number;
}

/**
 * Genera un PDF de presupuesto basado en el diseño de Kansaco
 */
export function generateBudgetPDF(data: BudgetPDFData): void {
  const { project, client, budgetNumber, items = [] } = data;

  // Crear documento PDF A4
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colores de marca JCQ
  const orangeColor = "#ff6b35";
  const blackColor = "#1a1a1a";
  const grayColor = "#6b7280";
  const lightGrayBg = "#f9fafb";

  // --- MARCA DE AGUA "PRESUPUESTO" ---
  doc.saveGraphicsState();
  // @ts-ignore - jsPDF types issue with GState
  doc.setGState(new doc.GState({ opacity: 0.08 }));
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(80);
  doc.setFont("helvetica", "bold");

  const watermarkText = "JCQ";
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;

  doc.text(watermarkText, centerX, centerY - 10, {
    align: "center",
    angle: 45,
  });

  doc.setFontSize(50);
  doc.text("ANDAMIOS", centerX, centerY + 15, {
    align: "center",
    angle: 45,
  });

  doc.restoreGraphicsState();

  // --- ENCABEZADO ---
  // Logo simulado (cuadrado naranja)
  doc.setFillColor(orangeColor);
  doc.rect(20, 15, 20, 20, "F");

  // Texto "JCQ ANDAMIOS" dentro del logo
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("JCQ", 30, 23, { align: "center" });
  doc.setFontSize(7);
  doc.text("ANDAMIOS", 30, 28, { align: "center" });

  // Información de la empresa (derecha del logo)
  doc.setTextColor(blackColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("JCQ ANDAMIOS", 45, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(grayColor);
  doc.text("CUIT 99-99999999-9", 45, 25);
  doc.text("Localidad Buenos Aires, Argentina", 45, 29);
  doc.text("Tel: +54 11 XXXX-XXXX", 45, 33);
  doc.text("Email: ventas@jcq-andamios.com", 45, 37);

  // Número de presupuesto y fecha (derecha)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(blackColor);
  doc.text(`Presupuesto #${budgetNumber}`, pageWidth - 20, 20, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(grayColor);
  const today = format(new Date(), "dd/MM/yyyy", { locale: es });
  doc.text(`Fecha: ${today}`, pageWidth - 20, 25, { align: "right" });

  // Línea separadora naranja
  doc.setDrawColor(orangeColor);
  doc.setLineWidth(1);
  doc.line(20, 42, pageWidth - 20, 42);

  // --- TÍTULO PRESUPUESTO ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(blackColor);
  doc.text("PRESUPUESTO", pageWidth / 2, 52, { align: "center" });

  // --- DATOS DEL CLIENTE ---
  let yPos = 62;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(orangeColor);
  doc.text("DATOS DEL CLIENTE", 20, yPos);

  yPos += 7;

  // Cuadro de cliente
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(20, yPos - 3, pageWidth - 40, 28, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(grayColor);

  // Razón Social
  doc.text("Razón Social:", 25, yPos + 3);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(blackColor);
  doc.text(client.fullname, 50, yPos + 3);

  yPos += 6;

  // Teléfono y Email en la misma línea
  doc.setFont("helvetica", "bold");
  doc.setTextColor(grayColor);
  doc.text("Teléfono:", 25, yPos + 3);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(blackColor);
  doc.text(client.phone || "N/A", 45, yPos + 3);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(grayColor);
  doc.text("Email:", 90, yPos + 3);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(blackColor);
  doc.text(
    client.fullname.toLowerCase().replace(/\s/g, "") + "@cliente.com",
    105,
    yPos + 3
  );

  yPos += 6;

  // Dirección y Localidad
  doc.setFont("helvetica", "bold");
  doc.setTextColor(grayColor);
  doc.text("Dirección:", 25, yPos + 3);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(blackColor);
  doc.text(project.locationAddress || "N/A", 45, yPos + 3);

  yPos += 6;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(grayColor);
  doc.text("Localidad:", 25, yPos + 3);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(blackColor);
  doc.text("CABA, Buenos Aires", 45, yPos + 3);

  yPos += 15;

  // --- DETALLE DE PRODUCTOS ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(orangeColor);
  doc.text("DETALLE DE PRODUCTOS", 20, yPos);

  yPos += 5;

  // Usar items proporcionados o calcular del proyecto
  const tableItems =
    items.length > 0
      ? items
      : [
          {
            quantity: 1,
            description: `Proyecto: ${project.locationAddress}`,
            presentation: `${project.workers} trabajadores`,
            unitPrice: project.amount,
            subtotal: project.amount,
          },
        ];

  // Calcular subtotal e IVA
  const subtotal = tableItems.reduce((sum, item) => sum + item.subtotal, 0);
  const ivaAmount = subtotal * 0.21;
  const total = subtotal + ivaAmount;

  // Tabla de productos
  autoTable(doc, {
    startY: yPos,
    margin: { left: 20, right: 20 },
    head: [["Cant.", "Descripción", "Presentación", "P. Unit.", "Subtotal"]],
    body: [
      ...tableItems.map((item) => [
        item.quantity.toString(),
        item.description,
        item.presentation,
        formatARS(item.unitPrice, false),
        formatARS(item.subtotal, false),
      ]),
    ],
    foot: [
      ["", "", "", "Subtotal:", formatARS(subtotal, false)],
      ["", "", "", "IVA (21%):", formatARS(ivaAmount, false)],
      ["", "", "", "TOTAL:", formatARS(total, false)],
    ],
    theme: "plain",
    headStyles: {
      fillColor: orangeColor,
      textColor: "#ffffff",
      fontStyle: "bold",
      fontSize: 9,
      halign: "center",
    },
    bodyStyles: {
      textColor: blackColor,
      fontSize: 9,
      cellPadding: 3,
    },
    footStyles: {
      fillColor: "#f3f4f6",
      textColor: blackColor,
      fontStyle: "bold",
      fontSize: 9,
      halign: "right",
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 70 },
      2: { cellWidth: 25, halign: "center" },
      3: { cellWidth: 30, halign: "right" },
      4: { cellWidth: 30, halign: "right" },
    },
    alternateRowStyles: {
      fillColor: lightGrayBg,
    },
  });

  // --- CONDICIONES ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(orangeColor);
  // doc.text("CONDICIONES", 20, finalY);

  // // Cuadro de condiciones
  // doc.setDrawColor(orangeColor);
  // doc.setLineWidth(0.5);
  // doc.setFillColor(lightGrayBg);
  // doc.roundedRect(20, finalY + 3, pageWidth - 40, 20, 2, 2, "FD");

  // doc.setFont("helvetica", "normal");
  // doc.setFontSize(9);
  // doc.setTextColor(blackColor);

  // // Forma de Pago y Validez
  // doc.text("Forma de Pago: Transferencia Bancaria", 25, finalY + 9);
  // doc.text(`Validez: ${validityDays} días`, pageWidth - 25, finalY + 9, {
  //   align: "right",
  // });

  // // Notas
  // doc.setFont("helvetica", "bold");
  // doc.setTextColor(orangeColor);
  // doc.text("NOTAS:", 25, finalY + 15);

  // doc.setFont("helvetica", "normal");
  // doc.setTextColor(blackColor);
  // doc.text(notes, 25, finalY + 19);

  // --- PIE DE PÁGINA ---
  const footerY = pageHeight - 25;

  // Línea separadora
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(20, footerY, pageWidth - 20, footerY);

  // Texto "NO VÁLIDO COMO FACTURA"
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(200, 0, 0);
  doc.text("NO VÁLIDO COMO FACTURA", pageWidth / 2, footerY + 5, {
    align: "center",
  });

  // Información de contacto
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(grayColor);
  doc.text(
    "Este presupuesto no tiene validez como documento fiscal.",
    pageWidth / 2,
    footerY + 9,
    { align: "center" }
  );

  doc.text(
    "Para consultas o cambios, contacte a ventas@jcq-andamios.com",
    pageWidth / 2,
    footerY + 13,
    { align: "center" }
  );

  doc.setFontSize(7);
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
  const fileName = `Presupuesto_${cleanClientName}_${timestamp}.pdf`;
  doc.save(fileName);
}
