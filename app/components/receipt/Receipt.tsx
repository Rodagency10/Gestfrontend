"use client";

import React, { useRef } from "react";
import jsPDF from "jspdf";

interface ReceiptItem {
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface ReceiptData {
  receipt_number: string;
  date: string;
  cashier_name: string;
  items: ReceiptItem[];
  subtotal: number;
  tax_amount: number;
  total_amount: number;
}

interface ReceiptProps {
  receiptData: ReceiptData;
  onClose: () => void;
  onPrint: () => void;
  onDownload?: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({
  receiptData,
  onClose,
  onPrint,
  onDownload,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrint = () => {
    // Utiliser jsPDF comme sur l'admin pour un format cohérent
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [60, 200], // largeur 60mm, hauteur ajustable
    });

    doc.setFont("courier", "normal");
    doc.setFontSize(8);

    let y = 10;
    doc.text("RESTAURANT FASTFOOD", 5, y, { align: "left" });
    y += 5;
    doc.text("Système de Gestion", 5, y);
    y += 5;
    doc.line(5, y, 55, y);
    y += 5;

    doc.text(`N° Reçu: ${receiptData.receipt_number}`, 5, y);
    y += 5;
    doc.text(`Date: ${formatDate(receiptData.date)}`, 5, y);
    y += 5;
    doc.text(`Caissier: ${receiptData.cashier_name}`, 5, y);
    y += 8;

    doc.text("ARTICLES:", 5, y);
    y += 5;
    receiptData.items.forEach((item) => {
      doc.text(`${item.name}`, 5, y);
      y += 4;
      doc.text(
        `${item.quantity} x ${item.unit_price.toFixed(0)} = ${item.total_price.toFixed(0)} FCFA`,
        5,
        y,
      );
      y += 5;
    });

    doc.line(5, y, 55, y);
    y += 5;
    doc.text(`Sous-total: ${receiptData.subtotal.toFixed(0)} FCFA`, 5, y);
    y += 5;
    doc.text(`TOTAL: ${receiptData.subtotal.toFixed(0)} FCFA`, 5, y);
    y += 8;

    doc.text("Merci pour votre visite!", 5, y);
    y += 5;
    doc.text("Conservez votre reçu", 5, y);

    // Ouvrir le PDF pour impression
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");

    onPrint();
  };

  const handleDownload = () => {
    // PDF thermique format ticket plus étroit
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [60, 200], // largeur 60mm, hauteur ajustable
    });

    doc.setFont("courier", "normal");
    doc.setFontSize(8);

    let y = 10;
    doc.text("RESTAURANT FASTFOOD", 5, y, { align: "left" });
    y += 5;
    doc.text("Système de Gestion", 5, y);
    y += 5;
    doc.line(5, y, 75, y);
    y += 5;

    doc.text(`N° Reçu: ${receiptData.receipt_number}`, 5, y);
    y += 5;
    doc.text(`Date: ${formatDate(receiptData.date)}`, 5, y);
    y += 5;
    doc.text(`Caissier: ${receiptData.cashier_name}`, 5, y);
    y += 8;

    doc.text("ARTICLES:", 5, y);
    y += 5;
    receiptData.items.forEach((item) => {
      doc.text(`${item.name}`, 5, y);
      y += 4;
      doc.text(
        `${item.quantity} x ${item.unit_price.toFixed(0)} = ${item.total_price.toFixed(0)} FCFA`,
        5,
        y,
      );
      y += 5;
    });

    doc.line(5, y, 75, y);
    y += 5;
    doc.text(`Sous-total: ${receiptData.subtotal.toFixed(0)} FCFA`, 5, y);
    y += 5;
    doc.text(`TOTAL: ${receiptData.subtotal.toFixed(0)} FCFA`, 5, y);
    y += 8;

    doc.text("Merci pour votre visite!", 5, y);
    y += 5;
    doc.text("Conservez votre reçu", 5, y);

    doc.save(`recu_${receiptData.receipt_number}.pdf`);
    if (onDownload) onDownload();
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 5mm;
          }
          body * {
            visibility: hidden !important;
          }
          #receipt-print,
          #receipt-print * {
            visibility: visible !important;
          }
          #receipt-print {
            position: absolute !important;
            left: 0;
            top: 0;
            width: 70mm !important;
            min-width: 70mm !important;
            max-width: 70mm !important;
            margin: 0 !important;
            padding: 5mm !important;
            font-family: "Courier New", Courier, monospace !important;
            font-size: 10px !important;
            line-height: 1.2 !important;
          }
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 80mm !important;
            height: auto !important;
          }
        }
      `}</style>
      <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
        <div
          id="receipt-print"
          className="relative top-20 mx-auto p-5 border w-[300px] shadow-lg rounded-md bg-white"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-black">Reçu de vente</h2>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div ref={receiptRef} className="receipt-content">
            <div className="receipt-header">
              <div className="receipt-title text-black">
                RESTAURANT FASTFOOD
              </div>
              <div className="text-black">Système de Gestion</div>
            </div>

            <div className="receipt-info">
              <div className="total-row">
                <span className="text-black">N° Reçu:</span>
                <span className="text-black">{receiptData.receipt_number}</span>
              </div>
              <div className="total-row">
                <span className="text-black">Date:</span>
                <span className="text-black">
                  {formatDate(receiptData.date)}
                </span>
              </div>
              <div className="total-row">
                <span className="text-black">Caissier:</span>
                <span className="text-black">{receiptData.cashier_name}</span>
              </div>
            </div>

            <div className="receipt-items">
              <div
                style={{ fontWeight: "bold", marginBottom: "10px" }}
                className="text-black"
              >
                ARTICLES:
              </div>
              {receiptData.items.map((item, index) => (
                <div key={index}>
                  <div className="item-row">
                    <span className="text-black">{item.name}</span>
                    <span className="text-black">
                      {item.total_price.toFixed(0)} FCFA
                    </span>
                  </div>
                  <div className="item-details">
                    <span className="text-gray-600">
                      {item.quantity} x {item.unit_price.toFixed(0)} FCFA
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="receipt-totals">
              <div className="total-row">
                <span className="text-black">Sous-total:</span>
                <span className="text-black">
                  {receiptData.subtotal.toFixed(0)} FCFA
                </span>
              </div>
              <div className="total-row total-final">
                <span className="text-black font-bold">TOTAL:</span>
                <span className="text-black font-bold">
                  {receiptData.subtotal.toFixed(0)} FCFA
                </span>
              </div>
            </div>

            <div className="receipt-footer">
              <div className="text-black">Merci pour votre visite!</div>
              <div className="text-black">Conservez votre reçu</div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={handlePrint}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🖨️ Imprimer
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              💾 Télécharger PDF
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Receipt;
