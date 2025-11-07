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
    // Utiliser jsPDF avec format 55mm uniformisé
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [55, 200], // largeur 55mm uniformisée
    });

    doc.setFont("courier", "normal");
    doc.setFontSize(8);

    let y = 10;
    doc.setFont("courier", "bold");
    doc.text("Restaurant chez Mamoune", 3, y, { align: "left" });
    y += 5;
    doc.setFont("courier", "normal");
    doc.text("Tel: 92 70 81 13", 3, y);
    y += 5;
    doc.line(3, y, 52, y);
    y += 5;

    doc.text(`N° Reçu: ${receiptData.receipt_number}`, 3, y);
    y += 5;
    doc.text(`Date: ${formatDate(receiptData.date)}`, 3, y);
    y += 5;
    doc.text(`Caissier: ${receiptData.cashier_name}`, 3, y);
    y += 8;

    doc.text("ARTICLES:", 3, y);
    y += 5;
    receiptData.items.forEach((item) => {
      doc.text(`${item.name}`, 3, y);
      y += 4;
      doc.text(
        `${item.quantity} x ${item.unit_price.toFixed(0)} = ${item.total_price.toFixed(0)} FCFA`,
        3,
        y,
      );
      y += 5;
    });

    doc.line(3, y, 52, y);
    y += 5;
    doc.setFont("courier", "bold");
    doc.text(`TOTAL: ${receiptData.total_amount.toFixed(0)} FCFA`, 3, y);
    y += 8;

    doc.setFont("courier", "normal");
    doc.text("Merci pour votre visite!", 3, y);
    y += 5;
    doc.text("Conservez votre reçu", 3, y);

    // Ouvrir le PDF pour impression
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");

    onPrint();
  };

  const handleDownload = () => {
    // PDF thermique format 55mm uniformisé
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [55, 200], // largeur 55mm uniformisée
    });

    doc.setFont("courier", "normal");
    doc.setFontSize(8);

    let y = 10;
    doc.setFont("courier", "bold");
    doc.text("Restaurant chez Mamoune", 3, y, { align: "left" });
    y += 5;
    doc.setFont("courier", "normal");
    doc.text("Tel: 92 70 81 13", 3, y);
    y += 5;
    doc.line(3, y, 52, y);
    y += 5;

    doc.text(`N° Reçu: ${receiptData.receipt_number}`, 3, y);
    y += 5;
    doc.text(`Date: ${formatDate(receiptData.date)}`, 3, y);
    y += 5;
    doc.text(`Caissier: ${receiptData.cashier_name}`, 3, y);
    y += 8;

    doc.text("ARTICLES:", 3, y);
    y += 5;
    receiptData.items.forEach((item) => {
      doc.text(`${item.name}`, 3, y);
      y += 4;
      doc.text(
        `${item.quantity} x ${item.unit_price.toFixed(0)} = ${item.total_price.toFixed(0)} FCFA`,
        3,
        y,
      );
      y += 5;
    });

    doc.line(3, y, 52, y);
    y += 5;
    doc.setFont("courier", "bold");
    doc.text(`TOTAL: ${receiptData.total_amount.toFixed(0)} FCFA`, 3, y);
    y += 8;

    doc.setFont("courier", "normal");
    doc.text("Merci pour votre visite!", 3, y);
    y += 5;
    doc.text("Conservez votre reçu", 3, y);

    doc.save(`recu_${receiptData.receipt_number}.pdf`);
    if (onDownload) onDownload();
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: 55mm auto;
            margin: 3mm;
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
            width: 55mm !important;
            min-width: 55mm !important;
            max-width: 55mm !important;
            margin: 0 !important;
            padding: 3mm !important;
            font-family: "Courier New", Courier, monospace !important;
            font-size: 10px !important;
            line-height: 1.2 !important;
          }
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 55mm !important;
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
              <div className="receipt-title text-black font-bold">
                Restaurant chez Mamoune
              </div>
              <div className="text-black">Tel: 92 70 81 13</div>
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
              <div className="total-row total-final">
                <span className="text-black font-bold">TOTAL:</span>
                <span className="text-black font-bold">
                  {receiptData.total_amount.toFixed(0)} FCFA
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
