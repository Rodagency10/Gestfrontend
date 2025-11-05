import jsPDF from 'jspdf';
import { Sale, SaleItem } from '@/hook/useSales';

interface ReceiptConfig {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail?: string;
  taxRate: number;
}

const defaultConfig: ReceiptConfig = {
  storeName: 'GEST STORE',
  storeAddress: '123 Main Street, Abidjan, Côte d\'Ivoire',
  storePhone: 'Tel: +225 XX XX XX XX',
  storeEmail: 'contact@geststore.com',
  taxRate: 0.18, // 18% TVA
};

export class ReceiptGenerator {
  private pdf: jsPDF;
  private config: ReceiptConfig;
  private yPosition: number = 20;
  private pageWidth: number = 80; // mm - typical thermal printer width
  private margin: number = 5;

  constructor(config: Partial<ReceiptConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [this.pageWidth, 200], // Start with estimated height
    });
  }

  private addLine(text: string, fontSize: number = 8, align: 'left' | 'center' | 'right' = 'left') {
    this.pdf.setFontSize(fontSize);

    const textWidth = this.pdf.getTextWidth(text);
    let x = this.margin;

    if (align === 'center') {
      x = (this.pageWidth - textWidth) / 2;
    } else if (align === 'right') {
      x = this.pageWidth - textWidth - this.margin;
    }

    this.pdf.text(text, x, this.yPosition);
    this.yPosition += fontSize / 2 + 2;
  }

  private addSeparator(char: string = '-') {
    const separatorWidth = Math.floor((this.pageWidth - 2 * this.margin) / 1.5);
    const separator = char.repeat(separatorWidth);
    this.addLine(separator, 6, 'center');
  }

  private addSpace(height: number = 3) {
    this.yPosition += height;
  }

  private formatPrice(price: string | number): string {
    const numPrice = typeof price === 'string' ? Number(price) : price;
    return numPrice.toLocaleString('fr-FR') + ' FCFA';
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private addHeader() {
    // Store name with larger font
    this.pdf.setFont('helvetica', 'bold');
    this.addLine(this.config.storeName, 14, 'center');

    // Store details
    this.pdf.setFont('helvetica', 'normal');
    this.addLine(this.config.storeAddress, 7, 'center');
    this.addLine(this.config.storePhone, 7, 'center');
    if (this.config.storeEmail) {
      this.addLine(this.config.storeEmail, 7, 'center');
    }

    this.addSeparator('=');

    // Receipt title
    this.pdf.setFont('helvetica', 'bold');
    this.addLine('RECU DE VENTE', 10, 'center');
    this.pdf.setFont('helvetica', 'normal');

    this.addSeparator();
  }

  private addSaleInfo(sale: Sale) {
    // Sale ID
    this.addLine(`Recu #: ${sale.sale_id.slice(0, 8).toUpperCase()}`, 8);

    // Date and time
    this.addLine(`Date: ${this.formatDate(sale.date)}`, 8);

    // Cashier
    this.addLine(`Caissier: ${sale.username}`, 8);

    this.addSeparator();
  }

  private addItems(items: SaleItem[]) {
    this.pdf.setFont('helvetica', 'bold');
    this.addLine('ARTICLES:', 9);
    this.pdf.setFont('helvetica', 'normal');

    let totalQuantity = 0;

    items.forEach((item, index) => {
      const quantity = item.quantity;
      const unitPrice = Number(item.unit_price);
      const totalPrice = Number(item.total_price);

      totalQuantity += quantity;

      // Product line with ID (shortened)
      const productId = item.product_id.slice(0, 8);
      this.addLine(`${index + 1}. Produit ID: ${productId}`, 7);

      // Quantity and price line
      const qtyPriceLine = `   ${quantity} x ${this.formatPrice(unitPrice)}`;
      this.addLine(qtyPriceLine, 7);

      // Total for this item (right aligned)
      const itemTotal = this.formatPrice(totalPrice);
      this.addLine(itemTotal, 8, 'right');

      this.addSpace(1);
    });

    this.addSeparator();

    // Summary
    this.addLine(`Total Articles: ${items.length}`, 8);
    this.addLine(`Quantite Totale: ${totalQuantity}`, 8);

    this.addSeparator();
  }

  private addTotals(sale: Sale) {
    const totalAmount = Number(sale.total_amount);
    const taxAmount = totalAmount * this.config.taxRate / (1 + this.config.taxRate);
    const subtotal = totalAmount - taxAmount;

    // Subtotal
    this.addLine('SOUS-TOTAL:', 8);
    this.addLine(this.formatPrice(subtotal.toFixed(2)), 9, 'right');

    // Tax
    this.addLine(`TVA (${(this.config.taxRate * 100).toFixed(0)}%):`, 8);
    this.addLine(this.formatPrice(taxAmount.toFixed(2)), 9, 'right');

    this.addSeparator('=');

    // Total
    this.pdf.setFont('helvetica', 'bold');
    this.addLine('TOTAL A PAYER:', 10);
    this.addLine(this.formatPrice(sale.total_amount), 12, 'right');
    this.pdf.setFont('helvetica', 'normal');

    this.addSeparator('=');
  }

  private addFooter() {
    this.addSpace(5);

    // Payment method
    this.addLine('Mode de paiement: ESPECES', 8, 'center');

    this.addSpace(3);

    // Thank you message
    this.pdf.setFont('helvetica', 'bold');
    this.addLine('MERCI DE VOTRE VISITE!', 9, 'center');
    this.pdf.setFont('helvetica', 'normal');

    this.addLine('Revenez nous voir bientot!', 7, 'center');

    this.addSpace(5);

    // Barcode placeholder (you could implement actual barcode generation)
    this.addLine('|||| |||| |||| ||||', 8, 'center');
    this.addLine('Code: ' + Date.now().toString().slice(-8), 6, 'center');

    this.addSpace(3);

    // Footer info
    this.addLine('Conservez ce recu', 6, 'center');
    this.addLine('www.geststore.com', 6, 'center');
  }

  public generateReceipt(sale: Sale): void {
    // Reset position
    this.yPosition = 15;

    // Generate receipt content
    this.addHeader();
    this.addSaleInfo(sale);
    this.addItems(sale.items);
    this.addTotals(sale);
    this.addFooter();

    // Adjust page height to content
    const finalHeight = this.yPosition + 10;
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [this.pageWidth, finalHeight],
    });

    // Regenerate with correct height
    this.yPosition = 15;
    this.addHeader();
    this.addSaleInfo(sale);
    this.addItems(sale.items);
    this.addTotals(sale);
    this.addFooter();
  }

  public download(filename?: string): void {
    const defaultFilename = `recu_${Date.now()}.pdf`;
    this.pdf.save(filename || defaultFilename);
  }

  public print(): void {
    // Open print dialog
    this.pdf.autoPrint();
    window.open(this.pdf.output('bloburl'), '_blank');
  }

  public preview(): void {
    // Open PDF in new tab for preview
    window.open(this.pdf.output('bloburl'), '_blank');
  }

  public getBlob(): Blob {
    return this.pdf.output('blob');
  }
}

// Helper function to generate and download receipt
export const generateSaleReceipt = (sale: Sale, action: 'download' | 'print' | 'preview' = 'download') => {
  const generator = new ReceiptGenerator();
  generator.generateReceipt(sale);

  switch (action) {
    case 'download':
      generator.download(`recu_${sale.sale_id.slice(0, 8)}.pdf`);
      break;
    case 'print':
      generator.print();
      break;
    case 'preview':
      generator.preview();
      break;
  }
};

// Helper function for batch receipt generation
export const generateMultipleReceipts = (sales: Sale[], action: 'download' | 'preview' = 'download') => {
  if (sales.length === 0) return;

  if (sales.length === 1) {
    generateSaleReceipt(sales[0], action);
    return;
  }

  // For multiple receipts, create a combined PDF
  const generator = new ReceiptGenerator();

  sales.forEach((sale, index) => {
    if (index > 0) {
      // Add new page for each receipt after the first
      generator['pdf'].addPage([generator['pageWidth'], 200]);
      generator['yPosition'] = 15;
    }
    generator.generateReceipt(sale);
  });

  switch (action) {
    case 'download':
      generator.download(`recus_${sales.length}_ventes.pdf`);
      break;
    case 'preview':
      generator.preview();
      break;
  }
};
